"use server";

import { gitRepo } from "@/lib/repo";

export async function cleanGitLocalRepo() {
  return gitRepo.cleanLocalRepo();
}
