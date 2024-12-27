import fs from "fs";
import { CheckRepoActions, type SimpleGit, simpleGit } from "simple-git";

import { config } from "@/config";

import { type GitSha7, type IGitRepo, type TemplateType } from "../IGitRepo";

export class SimpleGitRepo implements IGitRepo {
  private readonly git: SimpleGit;
  private configDone = false;

  constructor() {
    if (!fs.existsSync(config.api.templates.tmpdir)) {
      fs.mkdirSync(config.api.templates.tmpdir, { recursive: true });
    }
    this.git = simpleGit(config.api.templates.tmpdir);
  }

  private async init() {
    if (!this.configDone) {
      await this.git
        .addConfig("user.email", config.api.templates.git.author.email)
        .addConfig("user.name", config.api.templates.git.author.name)
        .addConfig("user.signingkey", config.api.templates.git.gpg_private_key)
        .addConfig("commit.gpgSign", "true")
        .addConfig("pull.rebase", "false");

      this.configDone = true;
    }

    if (!(await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT))) {
      await this.git.clone(config.api.templates.git.url, ".");
    }
    await this.git.fetch(["-p"]);
    await this.git.checkout("main");
  }

  public async getTemplate(groupId: string, type: TemplateType, templateVersion?: GitSha7): Promise<string> {
    await this.init();
    if (templateVersion) {
      await this.git.checkout(templateVersion);
    }

    return this.git.show([`HEAD:templates/${groupId}/${type}.md`]);
  }

  public async getVariablesForPage(
    startupId: string,
    templateGroupId: string,
    templateVersion: GitSha7,
  ): Promise<Record<string, unknown>> {
    await this.init();

    const raw = await this.git.show([`HEAD:var/${startupId}/${templateGroupId}-${templateVersion}.json`]);

    return JSON.parse(raw) as Record<string, unknown>;
  }
}
