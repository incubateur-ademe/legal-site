import { EspaceMembreClient, type Member } from "@incubateur-ademe/next-auth-espace-membre-provider/EspaceMembreClient";

import { config } from "@/config";
import { UnexpectedError } from "@/utils/error";

import { type Group } from "../repo/IGitRepo";
import { type Service } from "./types";

type RuleType = "animation" | "incubator" | "member" | "startup";
type RuleValidations = {
  [P in RuleType]: (member: Member, ruleValue: string) => boolean;
};
const ruleValidations: RuleValidations = {
  member: (member, ruleValue) => member.username === ruleValue,
  startup: (member, ruleValue) => member.startups.filter(s => s.ghid === ruleValue).some(s => s.isCurrent),
  incubator: (member, ruleValue) => member.startups.filter(s => s.incubator.ghid === ruleValue).some(s => s.isCurrent),
  animation: (member, ruleValue) => {
    const result = member.teams.filter(t => t.ghid === ruleValue && t.name.toLowerCase() === "animation").length > 0;
    console.log("animation rule", ruleValue, result);
    return result;
  },
};
const ruleTypes = Object.keys(ruleValidations) as RuleType[];

export class EspaceMembreService implements Service {
  private readonly client = new EspaceMembreClient({
    apiKey: config.api.espaceMembre.apiKey,
    endpointUrl: config.api.espaceMembre.url,
    fetchOptions: {
      next: {
        revalidate: 3600,
      },
    },
  });

  public init(): void {
    // Nothing to do
  }

  public getMemberByUsername(username: string): Promise<Member> {
    return this.client.member.getByUsername(username);
  }

  public isMemberInGroup(username: string, group: Group): Promise<boolean>;
  public isMemberInGroup(member: Member, group: Group): Promise<boolean>;
  public async isMemberInGroup(memberOrUsername: Member | string, group: Group): Promise<boolean> {
    const member =
      typeof memberOrUsername === "string"
        ? await this.client.member.getByUsername(memberOrUsername)
        : memberOrUsername;

    console.log("=== checking membership for", member.username, "in group", group.id);
    console.log({
      ownerRules: group.owners,
      membershipRules: group.membershipRules.map(r => r.rule),
      startup: member.startups.map(s => s.ghid),
      incubator: member.startups.map(s => s.incubator.ghid),
      animation: member.teams.map(t => t.ghid),
    });
    // first check if the member is an owner
    for (const ownerRule of group.owners) {
      const [ruleType, ruleValue] = ownerRule.split("/") as [RuleType, string];
      if ((ruleType as string) === "*") return true;
      if (!ruleTypes.includes(ruleType)) {
        throw new UnexpectedError(`Invalid owner rule type ${ruleType} for group ${group.id}`);
      }

      if (ruleValidations[ruleType](member, ruleValue)) {
        return true;
      }
    }

    console.log("not an owner");

    // then check if the member is a member
    for (const membershipRule of group.membershipRules) {
      const [ruleType, ruleValue] = membershipRule.rule.split("/") as [RuleType, string];
      if ((ruleType as string) === "*") return true;
      if (!ruleTypes.includes(ruleType)) {
        throw new UnexpectedError(`Invalid membership rule type ${ruleType} for group ${group.id}`);
      }

      if (ruleValidations[ruleType](member, ruleValue)) {
        // check membership dates but keep in mind that the rule might not have start date or end date
        // a rule can have only start date, only end date, both or none
        const now = new Date();
        if (membershipRule.ttlStart && membershipRule.ttlStart > now) {
          continue;
        }
        if (membershipRule.ttlEnd && membershipRule.ttlEnd < now) {
          continue;
        }
        return true;
      }
    }

    return false;
  }
}
