import { type Group } from "@/lib/model/Group";
import { type IGitRepo } from "@/lib/repo/IGitRepo";
import { UnexpectedError } from "@/utils/error";

import { type UseCase } from "./types";

export interface SaveGroupInput {
  group: Group;
  newGroup?: boolean;
}

export class SaveGroup implements UseCase<SaveGroupInput, void> {
  constructor(private readonly gitRepo: IGitRepo) {}

  public async execute({ group, newGroup }: SaveGroupInput): Promise<void> {
    if (newGroup) {
      const groups = await this.gitRepo.getGroups();
      if (groups.some(g => g.id === group.id)) {
        throw new AlreadyExistsSaveGroupError(`Le groupe ${group.id} existe déjà`);
      }
    }
    return this.gitRepo.saveGroup(group);
  }
}

export class SaveGroupError extends UnexpectedError {
  public readonly name: string = "SaveGroupError";
}

export class AlreadyExistsSaveGroupError extends SaveGroupError {
  public readonly name: string = "AlreadyExistsSaveGroupError";
}
