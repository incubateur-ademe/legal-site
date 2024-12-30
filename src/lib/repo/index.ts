import { type IGitRepo } from "./IGitRepo";
import { SimpleGitRepo } from "./impl/SimpleGitRepo";

export const gitRepo: IGitRepo = new SimpleGitRepo();
