import { loadEnvConfig } from "@next/env";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
loadEnvConfig(ROOT, process.env.NODE_ENV !== "production");

process.env._SEEDING = "true";

import { config } from "@/config";
import { gitRepo } from "@/lib/repo";

void (async () => {
  console.info("SEEDING MODE", config._seeding);
  await gitRepo.seed();
})();
