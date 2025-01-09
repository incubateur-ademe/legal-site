"use server";

import { type Group } from "@/lib/model/Group";
import { gitRepo } from "@/lib/repo";
import { SaveGroup } from "@/useCases/SaveGroup";
import { assertServerSession } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export async function saveGroup(group: Group, newGroup = false): Promise<ServerActionResponse<void>> {
  await assertServerSession(
    newGroup
      ? {
          message: "Vous n'avez pas le droit de créer un groupe",
        }
      : {
          groupOwner: {
            check: group,
            message: "Vous n'avez pas le droit de modifier ce groupe",
          },
        },
  );

  const useCase = new SaveGroup(gitRepo);

  try {
    await useCase.execute({ group, newGroup });
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: (error as Error).message,
    };
  }
}
