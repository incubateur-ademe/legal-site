import fs from "fs";
import fsP from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { type SimpleGit, simpleGit } from "simple-git";

import { config } from "@/config";
import { illogical } from "@/utils/error";
import { validateTemplateMeta } from "@/utils/templateMeta";

import { type GitSha7, type IGitRepo, type Template, type TemplateType, type TemplateVersions } from "../IGitRepo";

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
      if (!(await this.git.checkIsRepo())) {
        await this.git.clone(config.api.templates.git.url, ".");
      }
      await this.git
        .addConfig("user.email", config.api.templates.git.author.email)
        .addConfig("user.name", config.api.templates.git.author.name)
        .addConfig("user.signingkey", config.api.templates.git.gpgPrivateKey)
        .addConfig("commit.gpgSign", "true")
        .addConfig("pull.rebase", "false");

      this.configDone = true;
    }

    console.log("Fetching templates");
    await this.git.fetch(["-p"]);
    console.log("Checking out", config.api.templates.git.mainBranch);
    await this.git.checkout(config.api.templates.git.mainBranch);
    console.log("Pulling latest changes");
    await this.git.pull();
  }

  private async getShaAndHVersionForTemplate(
    template: Omit<Template, "sha" | "versions">,
  ): Promise<[GitSha7, TemplateVersions]> {
    if (!template?.path) {
      return illogical("Template path is missing");
    }
    const history = await this.git.log({ file: template.path, strictDate: true });
    if (!history.latest) {
      return illogical("No history found for template");
    }
    return [
      history.latest.hash.substring(0, 7),
      history.all.map(h => ({ sha: h.hash.substring(0, 7), date: new Date(h.date), comment: h.message })),
    ];
  }

  private getGithubUrlForTemplate(groupId: string, type: TemplateType, templateVersion?: GitSha7): string {
    switch (config.api.templates.git.provider) {
      case "github":
        return `${config.api.templates.git.url}/blob/${templateVersion || config.api.templates.git.mainBranch}/templates/${groupId}/${type}.md`;
      case "gitlab":
        return `${config.api.templates.git.url}/-/blob/${templateVersion || config.api.templates.git.mainBranch}/templates/${groupId}/${type}.md`;
      case "local":
        return `file://${config.api.templates.git.url}/templates/${groupId}/${type}.md`;
      default:
        return illogical("Unknown git provider");
    }
  }

  public async getAllTemplates(): Promise<Template[]> {
    await this.init();

    const templateBasePath = `${config.api.templates.tmpdir}/templates/`;
    const files = await fsP.readdir(templateBasePath, {
      recursive: true,
      withFileTypes: true,
      encoding: "utf-8",
    });

    const templates: Template[] = files
      .filter(f => f.isFile())
      .map(f => {
        const [groupId] = f.parentPath.split("/").reverse();
        const [type] = f.name.split(".") as [TemplateType, string];
        const filePath = path.resolve(templateBasePath, groupId, f.name);
        const content = fs.readFileSync(filePath, { encoding: "utf-8" });
        const { data } = matter(content);
        return { groupId, type, path: filePath, ...validateTemplateMeta(data), githubUrl: "", sha: "", versions: [] };
      });

    for (const template of templates) {
      const [sha, versions] = await this.getShaAndHVersionForTemplate(template);
      template.githubUrl = this.getGithubUrlForTemplate(template.groupId, template.type, sha);
      template.sha = sha;
      template.versions = versions;
    }

    return templates;
  }

  public async getTemplate(groupId: string, type: TemplateType, templateVersion?: GitSha7): Promise<Template> {
    const content = await this.getTemplateRaw(groupId, type, templateVersion);

    const templateBasePath = `${config.api.templates.tmpdir}/templates/`;
    const filePath = path.resolve(templateBasePath, groupId, `${type}.md`);
    const { data } = matter(content);

    const template = {
      groupId,
      type,
      path: filePath,
      githubUrl: this.getGithubUrlForTemplate(groupId, type, templateVersion),
      ...validateTemplateMeta(data),
    };

    await this.init(); // Ensure we have the latest history
    const [sha, versions] = await this.getShaAndHVersionForTemplate(template);

    return { ...template, sha, versions };
  }

  public async getTemplateRaw(groupId: string, type: TemplateType, templateVersion?: GitSha7): Promise<string> {
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
