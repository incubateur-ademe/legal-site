import fs from "fs";
import fsP from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { CheckRepoActions, type SimpleGit, simpleGit } from "simple-git";

import { config } from "@/config";
import { type Group } from "@/lib/model/Group";
import { type GitSha7, type Template, type TemplateType, type TemplateVersions } from "@/lib/model/Template";
import { type Variable } from "@/lib/model/Variable";
import { illogical } from "@/utils/error";
import { validateGroup, validateTemplateMeta, validateVariable } from "@/utils/templateMeta";

import { CONFIG_EXT, GROUP_FILE, type IGitRepo, TEMPLATE_DIR, TEMPLATE_EXT, VARIABLE_DIR } from "../IGitRepo";

// TODO: Add pool to avoid multiple concurrent git operations
// like Map<repoPath, {git: SimpleGit, configDone: boolean}>

export class SimpleGitRepo implements IGitRepo {
  private readonly git: SimpleGit;
  // private readonly remote: "local" | "origin" = config.api.templates.git.provider === "local" ? "local" : "origin";
  private readonly remote = "origin";
  private configDone = false;
  private readonly tmpdir = path.resolve(config.api.templates.tmpdir);

  constructor() {
    if (!fs.existsSync(this.tmpdir)) {
      fs.mkdirSync(this.tmpdir, { recursive: true });
    }
    this.git = simpleGit(this.tmpdir);
  }

  private async init() {
    if (!this.configDone) {
      if (!(await this.git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT))) {
        await this.git.clone(config.api.templates.git.url, ".");
      }
      await this.git.addConfig("core.worktree", this.tmpdir);
      await this.git
        .addConfig("user.email", config.api.templates.git.committer.email)
        .addConfig("user.name", config.api.templates.git.committer.name)
        .addConfig("pull.rebase", "false");

      if (config.api.templates.git.gpgPrivateKey) {
        await this.git
          .addConfig("user.signingkey", config.api.templates.git.gpgPrivateKey)
          .addConfig("commit.gpgSign", "true");
      }

      // const remotes = await this.git.getRemotes();
      // if (!remotes.some(r => r.name === this.remote)) {
      //   await this.git.addRemote(this.remote, this.getAuthRemoteUrl());
      // }
      await this.git.removeRemote("origin").addRemote("origin", this.getAuthRemoteUrl());

      this.configDone = true;
    }

    await this.git.fetch(this.remote, ["-p"]);
    await this.git.checkout(config.api.templates.git.mainBranch);
    await this.git.pull(this.remote, config.api.templates.git.mainBranch, {
      // "--set-upstream-to": `${this.remote}/${config.api.templates.git.mainBranch}`,
    });
  }

  private getAuthRemoteUrl() {
    if (config.api.templates.git.provider === "local") {
      return config.api.templates.git.url;
    }

    const { providerToken, providerUser } = config.api.templates.git;
    const url = new URL(config.api.templates.git.url);
    url.username = providerUser;
    url.password = providerToken;
    return url.toString();
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

  private getGitProviderUrlForTemplate({
    groupId,
    type,
    templateVersion,
  }: {
    groupId: string;
    templateVersion?: GitSha7;
    type: TemplateType;
  }): string {
    switch (config.api.templates.git.provider) {
      case "github":
        return `${config.api.templates.git.url}/blob/${templateVersion || config.api.templates.git.mainBranch}/${TEMPLATE_DIR}/${groupId}/${type}.${TEMPLATE_EXT}`;
      case "gitlab":
        return `${config.api.templates.git.url}/-/blob/${templateVersion || config.api.templates.git.mainBranch}/${TEMPLATE_DIR}/${groupId}/${type}.${TEMPLATE_EXT}`;
      case "local":
        return `file://${config.api.templates.git.url}/${TEMPLATE_DIR}/${groupId}/${type}.${TEMPLATE_EXT}`;
      default:
        return illogical("Unknown git provider");
    }
  }

  private getGitUrlForVariable({
    startupId,
    templateType,
    variableId,
  }: {
    startupId: string;
    templateType: TemplateType;
    variableId?: string;
  }): string {
    switch (config.api.templates.git.provider) {
      case "github":
        return `${config.api.templates.git.url}/blob/${config.api.templates.git.mainBranch}/${VARIABLE_DIR}/${startupId}/${variableId ? `${variableId}/` : ""}${templateType}.${CONFIG_EXT}`;
      case "gitlab":
        return `${config.api.templates.git.url}/-/blob/${config.api.templates.git.mainBranch}/${VARIABLE_DIR}/${startupId}/${variableId ? `${variableId}/` : ""}${templateType}.${CONFIG_EXT}`;
      case "local":
        return `file://${config.api.templates.git.url}/${VARIABLE_DIR}/${startupId}/${variableId ? `${variableId}/` : ""}${templateType}.${CONFIG_EXT}`;
      default:
        return illogical("Unknown git provider");
    }
  }

  public async getAllTemplates(groupId?: string): Promise<Template[]> {
    await this.init();

    const templateBasePath = `${this.tmpdir}/${TEMPLATE_DIR}/`;
    const files = await fsP.readdir(templateBasePath, {
      recursive: true,
      withFileTypes: true,
      encoding: "utf-8",
    });

    const templates = files
      .filter(f => f.isFile())
      .map(f => {
        const [currentGroupId] = f.parentPath.split("/").reverse();
        if (groupId && currentGroupId !== groupId) {
          return null;
        }
        if (f.name === GROUP_FILE) {
          return null;
        }
        const [type] = f.name.split(".") as [TemplateType, string];
        const filePath = path.resolve(templateBasePath, currentGroupId, f.name);
        const content = fs.readFileSync(filePath, { encoding: "utf-8" });
        const { data } = matter(content);
        return {
          groupId: currentGroupId,
          type,
          path: filePath,
          ...validateTemplateMeta(data),
          gitProviderUrl: "",
          sha: "",
          versions: [],
        };
      })
      .filter(Boolean) as Template[];

    for (const template of templates) {
      const [sha, versions] = await this.getShaAndHVersionForTemplate(template);
      template.gitProviderUrl = this.getGitProviderUrlForTemplate({
        groupId: template.groupId,
        type: template.type,
        templateVersion: sha,
      });
      template.sha = sha;
      template.versions = versions;
    }

    return templates;
  }

  public async getTemplate(groupId: string, type: TemplateType, templateVersion?: GitSha7): Promise<Template> {
    const content = await this.getTemplateRaw(groupId, type, templateVersion);

    const templateBasePath = `${this.tmpdir}/${TEMPLATE_DIR}/`;
    const filePath = path.resolve(templateBasePath, groupId, `${type}.${TEMPLATE_EXT}`);
    const { data } = matter(content);

    const template = {
      groupId,
      type,
      path: filePath,
      gitProviderUrl: this.getGitProviderUrlForTemplate({ groupId, type, templateVersion }),
      ...validateTemplateMeta(data),
    };

    await this.init(); // Ensure we have the latest history
    const [sha, versions] = await this.getShaAndHVersionForTemplate(template);

    return { ...template, sha, versions };
  }

  public async getTemplateRaw(groupId: string, type: TemplateType, templateVersion?: GitSha7): Promise<string> {
    await this.init();
    if (templateVersion) {
      // TODO: handle errors / not found
      const checkoutResult = await this.git.checkout(templateVersion);
    }

    return this.git.show([`HEAD:${TEMPLATE_DIR}/${groupId}/${type}.${TEMPLATE_EXT}`]);
  }

  public async getVariableForPage(
    startupId: IGitRepo.StartupId,
    variableId: IGitRepo.VariableId,
    templateType: TemplateType,
  ): Promise<Variable> {
    await this.init();

    const raw = await this.git.show([`HEAD:${VARIABLE_DIR}/${startupId}/${variableId}/${templateType}.${CONFIG_EXT}`]);
    const variable = validateVariable(JSON.parse(raw) as Variable);

    return {
      ...variable,
      gitProviderUrl: this.getGitUrlForVariable({ startupId, templateType, variableId: variableId }),
      path: path.resolve(this.tmpdir, VARIABLE_DIR, startupId, variableId, `${templateType}.${CONFIG_EXT}`),
      url: `${config.host}/startup/${startupId}${variableId === "default" ? "" : `/${variableId}`}/${templateType}`,
    };
  }

  public async saveTemplate(
    template: Template,
    content: string,
    comment?: string,
    author?: { email: string; name: string },
  ): Promise<GitSha7> {
    const filePath = path.resolve(template.path);
    const commitMessage = `template(${template.groupId}): ${template.type} - ${comment || "Update"}`;
    await this.init();
    await fsP.writeFile(filePath, content);
    const commitResult = await this.git
      .add(filePath)
      .commit(commitMessage, filePath, author && { "--author": `${author.name} <${author.email}>` });

    const _pushResult = await this.git.push(this.remote);
    // TODO: handle push errors

    return commitResult.commit.substring(0, 7);
  }

  public async getGroup(groupId: string): Promise<Group | null> {
    await this.init();

    const groupPath = `${this.tmpdir}/${TEMPLATE_DIR}/${groupId}/${GROUP_FILE}`;
    if (!fs.existsSync(groupPath)) {
      return null;
    }
    const content = await fsP.readFile(groupPath, { encoding: "utf-8" });

    const fileGroup = JSON.parse(content) as Partial<Group>;

    const templates = await this.getAllTemplates(groupId);

    return validateGroup({
      id: groupId,
      templates,
      ...fileGroup,
    });
  }

  public async saveGroup(group: Group): Promise<void> {
    await this.init();

    const groupPath = `${this.tmpdir}/${TEMPLATE_DIR}/${group.id}/${GROUP_FILE}`;
    // if file does not exist, create it
    const exists = fs.existsSync(groupPath);
    if (!exists) {
      await fsP.mkdir(path.dirname(groupPath), { recursive: true });
    }
    const commitMessage = `group(${group.id}): ${group.name} - ${exists ? "Update" : "Create"}`;
    const validated = { ...validateGroup(group) } as Partial<Group>;
    delete validated.templates;
    delete validated.id;
    await fsP.writeFile(groupPath, JSON.stringify(validated, null, 2));
    const _commitResult = await this.git.add(groupPath).commit(commitMessage, groupPath);

    const _pushResult = await this.git.push(this.remote);
  }

  public async getGroups(): Promise<Group[]> {
    await this.init();

    const groupBasePath = `${this.tmpdir}/${TEMPLATE_DIR}/`;
    const files = await fsP.readdir(groupBasePath, {
      recursive: true,
      withFileTypes: true,
      encoding: "utf-8",
    });

    const groups: Group[] = files
      .filter(f => f.isFile() && f.name === GROUP_FILE)
      .map(f => {
        const [groupId] = f.parentPath.split("/").reverse();
        const filePath = path.resolve(groupBasePath, groupId, f.name);
        const content = fs.readFileSync(filePath, { encoding: "utf-8" });
        return { ...validateGroup(JSON.parse(content) as Group), id: groupId };
      });

    for (const group of groups) {
      const templates = await this.getAllTemplates();
      group.templates = templates.filter(t => t.groupId === group.id);
    }

    return groups;
  }

  public async getAllVariables(): Promise<IGitRepo.AllVariables> {
    await this.init();

    const variableBasePath = `${this.tmpdir}/${VARIABLE_DIR}/`;
    const files = await fsP.readdir(variableBasePath, {
      recursive: true,
      withFileTypes: true,
      encoding: "utf-8",
    });

    const variables: IGitRepo.AllVariables = {};
    for (const f of files) {
      if (!f.isFile()) {
        continue;
      }
      // files to parse are "${templateType}.json"
      // they can be located either in "/variables/${startupId}/" or "/variables/${startupId}/${productId}/"
      // if productId is present, it should be handled during path spliting
      // also the key in the first level of the Record will be "${startupId}-${productId}"
      // if productId is not present, the key will be just "${startupId}"
      const [variableId, startupId] = f.parentPath.split("/").reverse() as [IGitRepo.VariableId, IGitRepo.StartupId];
      const [type] = f.name.split(".") as [TemplateType, string];
      const filePath = path.resolve(variableBasePath, startupId, variableId, f.name);
      const content = await fsP.readFile(filePath, { encoding: "utf-8" });
      const variablesObj = JSON.parse(content) as Variable;
      if (!variables[startupId]) {
        variables[startupId] = {} as IGitRepo.StartupVariables;
      }
      if (!variables[startupId][variableId]) {
        variables[startupId][variableId] = {} as Record<TemplateType, Variable>;
      }
      variables[startupId][variableId][type] = {
        ...validateVariable(variablesObj),
        gitProviderUrl: this.getGitUrlForVariable({ startupId, templateType: type, variableId: variableId }),
        path: filePath,
        url: `${config.host}/startup/${startupId}${variableId === "default" ? "" : `/${variableId}`}/${type}`,
      };
    }

    return variables;
  }
}
