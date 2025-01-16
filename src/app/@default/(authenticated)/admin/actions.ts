"use server";

import { revalidatePath } from "next/cache";

import { gitRepo } from "@/lib/repo";

export async function cleanGitLocalRepo() {
  try {
    return gitRepo.cleanLocalRepo();
  } finally {
    revalidatePath("/", "layout");
  }
}
