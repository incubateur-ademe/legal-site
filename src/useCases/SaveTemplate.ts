import { type GitSha7, type Template } from "@/lib/model/Template";
import { type IGitRepo } from "@/lib/repo/IGitRepo";
import { type MdxService } from "@/lib/services/MdxService";
import { validateTemplateMeta } from "@/utils/templateMeta";

import { type UseCase } from "./types";

export interface SaveTemplateInput {
  comment?: string;
  content: string;
  editor?: { email: string; name: string };
  template: Template;
}

export class SaveTemplate implements UseCase<SaveTemplateInput, GitSha7> {
  constructor(
    private readonly gitRepo: IGitRepo,
    private readonly mdxService: MdxService,
  ) {}

  public async execute({ editor, comment, content, template }: SaveTemplateInput): Promise<GitSha7> {
    const contentWithMetadata = this.mdxService.addMetadataToRaw(
      content,
      validateTemplateMeta({
        ...template,
        lastEditor: editor?.name,
      }),
    );
    return this.gitRepo.saveTemplate(template, contentWithMetadata, comment, editor);
  }
}
