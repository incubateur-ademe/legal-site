import { type Template } from "@/lib/model/Template";
import { type IGitRepo } from "@/lib/repo/IGitRepo";

import { type UseCase } from "./types";

export interface ListTemplatesInput {
  groupId?: string;
}

export class ListTemplates implements UseCase<ListTemplatesInput, Template[]> {
  constructor(private readonly gitRepo: IGitRepo) {}

  public async execute({ groupId }: ListTemplatesInput): Promise<Template[]> {
    const templates = await this.gitRepo.getAllTemplates(groupId);
    return templates;
  }
}
