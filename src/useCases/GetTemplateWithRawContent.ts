import { type GitSha7, type IGitRepo, type Template, type TemplateType } from "@/lib/repo/IGitRepo";
import { type MdxService } from "@/lib/services/MdxService";

import { AbstractCachedUseCase } from "./AbstractCacheUsedCase";

export interface GetTemplateWithRawContentIntput {
  groupId: string;
  templateId: GitSha7;
  type: TemplateType;
}

export interface GetTemplateWithRawContentOutput {
  raw: string;
  template: Template;
}

export class GetTemplateWithRawContent extends AbstractCachedUseCase<
  GetTemplateWithRawContentIntput,
  GetTemplateWithRawContentOutput
> {
  protected readonly cacheMasterKey = "GetTemplateWithRawContent";

  constructor(
    private readonly mdxService: MdxService,
    private readonly gitRepo: IGitRepo,
  ) {
    super();
  }

  public async cachedExecute({
    groupId,
    templateId,
    type,
  }: GetTemplateWithRawContentIntput): Promise<GetTemplateWithRawContentOutput> {
    const template = await this.gitRepo.getTemplate(groupId, type, templateId);
    const fullRaw = await this.gitRepo.getTemplateRaw(groupId, type, templateId);
    const raw = this.mdxService.removeMetadataFromRaw(fullRaw);

    return {
      raw,
      template,
    };
  }
}
