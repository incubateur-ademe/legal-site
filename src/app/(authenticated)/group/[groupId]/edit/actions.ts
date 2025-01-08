"use server";

import { type Group } from "@/lib/model/Group";
import { gitRepo } from "@/lib/repo";
import { SaveGroup } from "@/useCases/SaveGroup";
import { assertServerSession } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export async function saveGroup(group: Group): Promise<ServerActionResponse<void>> {
  await assertServerSession({
    groupOwner: group,
  });

  const useCase = new SaveGroup(gitRepo);

  try {
    await useCase.execute({ group });
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
