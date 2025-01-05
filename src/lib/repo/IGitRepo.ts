import { z } from "zod";

import { type UniqueString } from "@/utils/types";

export const GitSha7 = z.string().regex(/^[0-9a-f]{7}$/, "Not a valid Git SHA");
export type GitSha7 = UniqueString<z.infer<typeof GitSha7>>;

export enum TemplateTypeEnum {
  CGU = "cgu",
  MentionsLegales = "mentions-legales",
  PolitiqueDeConfidentialite = "politique-de-confidentialite",
  PolitiqueDeCookies = "politique-de-cookies",
}
export const TemplateTypeName = {
  [TemplateTypeEnum.CGU]: "CGU",
  [TemplateTypeEnum.MentionsLegales]: "Mentions Légales",
  [TemplateTypeEnum.PolitiqueDeConfidentialite]: "Confidentialité",
  [TemplateTypeEnum.PolitiqueDeCookies]: "Cookies",
} as const;

export const TemplateType = z.nativeEnum(TemplateTypeEnum);
export type TemplateType = z.infer<typeof TemplateType>;

export const TemplateMeta = z.object({
  author: z.string(),
  lastEditor: z.string(),
  description: z.string(),
  variables: z.record(z.string()),
});

export const TemplateVersions = z.array(
  z.object({ sha: GitSha7, date: z.date(), comment: z.string().optional().default("") }),
);

export const Template = TemplateMeta.extend({
  sha: GitSha7,
  type: TemplateType,
  groupId: z.string(),
  versions: TemplateVersions,
  path: z.string(),
  githubUrl: z.string().url(),
});

export type TemplateVersions = z.infer<typeof TemplateVersions>;
export type TemplateMeta = z.infer<typeof TemplateMeta>;
export type Template = z.infer<typeof Template>;

export const GroupMembershipRule = z.object({
  rule: z.union([
    z.string().regex(/member\/[\w.]+/gi),
    z.string().regex(/startup\/[\w.]+/gi),
    z.string().regex(/incubator\/[\w.]+/gi),
    z.string().regex(/animation\/[\w.]+/gi),
    z.literal("*"),
  ]),
  ttlStart: z.date().optional(),
  ttlEnd: z.date().optional(),
});
export const Group = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  templates: z.array(Template),
  owners: z.array(GroupMembershipRule.shape.rule),
  membershipRules: z.array(GroupMembershipRule),
});

export type GroupMembershipRule = z.infer<typeof GroupMembershipRule>;
export type Group = z.infer<typeof Group>;

export interface IGitRepo {
  getAllTemplates(groupId?: string): Promise<Template[]>;
  getGroup(groupId: string): Promise<Group>;
  getGroups(): Promise<Group[]>;
  getTemplate(groupId: string, type: TemplateType, templateVersion?: GitSha7): Promise<Template>;
  getTemplateRaw(groupId: string, type: TemplateType, templateVersion?: GitSha7): Promise<string>;
  getVariablesForPage(
    startupId: string,
    templateGroupId: string,
    templateVersion: GitSha7,
  ): Promise<Record<string, unknown>>;
  saveGroup(group: Group): Promise<void>;
  saveTemplate(
    template: Template,
    content: string,
    comment?: string,
    author?: { email: string; name: string },
  ): Promise<GitSha7>;
}
