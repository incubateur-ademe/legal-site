"use server";

import { revalidatePath } from "next/cache";

import { redis } from "@/lib/db/redis/storage";
import { gitRepo } from "@/lib/repo";

export async function cleanGitLocalRepo() {
  try {
    return gitRepo.cleanLocalRepo();
  } finally {
    revalidatePath("/", "layout");
  }
}

export async function clearRedis() {
  await redis.clear();
  const keys = await redis.keys();

  return keys.length === 0 ? "Redis cleared" : `Redis not cleared: ${keys.length} keys remaining\n${keys.join("\n")}`;
}

export async function getRedisContent() {
  const keys = await redis.keys();

  return keys.length
    ? (await redis.getItems(keys)).map(({ key, value }) => `${key}: ${JSON.stringify(value, null, 2)}`).join("\n")
    : "No keys in Redis";
}
