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
export const TemplateType = z.nativeEnum(TemplateTypeEnum);
export type TemplateType = z.infer<typeof TemplateType>;

export interface IGitRepo {
  getTemplate(groupId: string, type: TemplateType, templateVersion?: GitSha7): Promise<string>;
  getVariablesForPage(
    startupId: string,
    templateGroupId: string,
    templateVersion: GitSha7,
  ): Promise<Record<string, unknown>>;
}
