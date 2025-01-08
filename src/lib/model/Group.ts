import { type Member } from "@incubateur-ademe/next-auth-espace-membre-provider/EspaceMembreClient";
import { z } from "zod";

import { toFrenchDate } from "@/utils/data";
import { UnexpectedError } from "@/utils/error";

import { Template } from "./Template";

export const enum GroupRuleType {
  Animation = "animation",
  Incubator = "incubator",
  Member = "member",
  Startup = "startup",
}

export const GroupRuleTypeName = {
  [GroupRuleType.Member]: "Membre",
  [GroupRuleType.Startup]: "Startup",
  [GroupRuleType.Incubator]: "Incubateur",
  [GroupRuleType.Animation]: "Animation",
};

export const GroupRule = z.object({
  rule: z.union([
    ...(Object.keys(GroupRuleTypeName).map(key => z.string().regex(new RegExp(`${key}/[\\w.]+`, "gi"))) as [
      z.ZodString,
    ]),
    z.literal("*"),
  ]),
  ttlStart: z.coerce.date().optional(),
  ttlEnd: z.coerce.date().optional(),
});
export const Group = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  templates: z.array(Template),
  owners: z.array(GroupRule.shape.rule),
  membershipRules: z.array(GroupRule),
});

export type GroupRule = z.infer<typeof GroupRule>;
export type Group = z.infer<typeof Group>;

export type GroupRuleValidations = {
  [P in GroupRuleType]: (member: Member, ruleValue: string) => boolean;
};

const groupRuleExplainer: Record<GroupRuleType, (name: string) => string> = {
  animation: name =>
    name === "*"
      ? "Toutes les équipes d'Animation (ou transverse) de tous les incubateurs confondus."
      : `L'équipe d'Animation (ou transverse) de l'incubateur "${name}"`,
  incubator: name => `Tous les membres de l'incubateur "${name}"`,
  member: name => `Uniquement le membre "${name}"`,
  startup: name => `Uniquement les membres de la startup "${name}"`,
};

const groupRuleTtlExplainer = (ttlStart?: Date | null, ttlEnd?: Date | null): string => {
  console.log("ttlStart", ttlStart);
  console.log("ttlEnd", ttlEnd);
  if (ttlStart && ttlEnd) {
    return ` (entre le ${toFrenchDate(ttlStart, true)} et le ${toFrenchDate(ttlEnd, true)})`;
  }
  if (ttlStart) {
    return ` (à partir du ${toFrenchDate(ttlStart, true)})`;
  }
  if (ttlEnd) {
    return ` (jusqu'au ${toFrenchDate(ttlEnd, true)})`;
  }
  return "";
};

export const groupRuleValidations: GroupRuleValidations = {
  member: (member, ruleValue) => member.username === ruleValue,
  startup: (member, ruleValue) => member.startups.filter(s => s.ghid === ruleValue).some(s => s.isCurrent),
  incubator: (member, ruleValue) => member.startups.filter(s => s.incubator.ghid === ruleValue).some(s => s.isCurrent),
  animation: (member, ruleValue) =>
    ruleValue === "*"
      ? member.teams.some(t => t.name.toLowerCase() === "animation")
      : member.teams.filter(t => t.ghid === ruleValue && t.name.toLowerCase() === "animation").length > 0,
};

export const explainGroupRule = (groupRule: GroupRule): string => {
  const [ruleType, ruleValue] = groupRule.rule.split("/") as [GroupRuleType, string];
  const ttlExplained = groupRuleTtlExplainer(groupRule.ttlStart, groupRule.ttlEnd);

  if ((ruleType as string) === "*") return "Tous les membres" + ttlExplained;
  if (!groupRuleTypeList.includes(ruleType)) {
    throw new UnexpectedError(`Invalid rule type ${ruleType}`);
  }

  return groupRuleExplainer[ruleType](ruleValue) + ttlExplained;
};

export const groupRuleTypeList = Object.keys(groupRuleValidations) as GroupRuleType[];

export interface GroupMembership {
  isMember: boolean;
  isOwner: boolean;
}
export const getGroupMembership = (member: Member, group: Group): GroupMembership => {
  // first check if the member is an owner
  for (const ownerRule of group.owners) {
    const [ruleType, ruleValue] = ownerRule.split("/") as [GroupRuleType, string];
    if ((ruleType as string) === "*") return { isOwner: true, isMember: true };
    if (!groupRuleTypeList.includes(ruleType)) {
      throw new UnexpectedError(`Invalid owner rule type ${ruleType} for group ${group.id}`);
    }

    if (groupRuleValidations[ruleType](member, ruleValue)) {
      return { isOwner: true, isMember: true };
    }
  }

  // then check if the member is a member
  for (const membershipRule of group.membershipRules) {
    const [ruleType, ruleValue] = membershipRule.rule.split("/") as [GroupRuleType, string];
    if ((ruleType as string) === "*") return { isOwner: false, isMember: true };
    if (!groupRuleTypeList.includes(ruleType)) {
      throw new UnexpectedError(`Invalid membership rule type ${ruleType} for group ${group.id}`);
    }

    if (groupRuleValidations[ruleType](member, ruleValue)) {
      // check membership dates but keep in mind that the rule might not have start date or end date
      // a rule can have only start date, only end date, both or none
      const now = new Date();
      if (membershipRule.ttlStart && membershipRule.ttlStart > now) {
        continue;
      }
      if (membershipRule.ttlEnd && membershipRule.ttlEnd < now) {
        continue;
      }
      return { isOwner: false, isMember: true };
    }
  }

  return { isOwner: false, isMember: false };
};
