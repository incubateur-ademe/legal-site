import { type IGitRepo, type Template } from "@/lib/repo/IGitRepo";

import { type UseCase } from "./types";

export class ListTemplates implements UseCase<never, Template[]> {
  constructor(private readonly gitRepo: IGitRepo) {}

  public async execute(): Promise<Template[]> {
    const templates = await this.gitRepo.getAllTemplates();
    return templates;
  }
}
