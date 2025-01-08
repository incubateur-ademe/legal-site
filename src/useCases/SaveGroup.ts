import { type Group } from "@/lib/model/Group";
import { type IGitRepo } from "@/lib/repo/IGitRepo";

import { type UseCase } from "./types";

export interface SaveGroupInput {
  group: Group;
}

export class SaveGroup implements UseCase<SaveGroupInput, void> {
  constructor(private readonly gitRepo: IGitRepo) {}

  public async execute({ group }: SaveGroupInput): Promise<void> {
    return this.gitRepo.saveGroup(group);
  }
}
