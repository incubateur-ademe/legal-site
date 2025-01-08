import { type Group } from "../model/Group";
import { type GitSha7, type Template, type TemplateType } from "../model/Template";

export interface IGitRepo {
  getAllTemplates(groupId?: string): Promise<Template[]>;
  getGroup(groupId: string): Promise<Group | null>;
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
