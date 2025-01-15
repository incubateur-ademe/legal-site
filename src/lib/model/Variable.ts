import { z } from "zod";

import { GitSha7 } from "./Template";

export const Variable = z.object({
  author: z.string(),
  lastEditor: z.string(),
  description: z.string().optional().default(""),
  variables: z.record(z.string()),
  sha: GitSha7,
  group: z.string(),
  path: z.string(),
  gitProviderUrl: z.string().url(),
  url: z.string().url(),
});

export type Variable = z.infer<typeof Variable>;
