import { type TemplateType } from "@/lib/model/Template";
import { type IGitRepo } from "@/lib/repo/IGitRepo";
import { type MdxService } from "@/lib/services/MdxService";
import { type SimpleObject } from "@/utils/types";

import { AbstractCachedUseCase } from "./AbstractCacheUseCase";

export enum PageExtEnum {
  HTML = "html",
  MARKDOWN = "md",
  PDF = "pdf",
  TEXT = "txt",
}

export interface GetLegalPageAsFileInput {
  fileType: PageExtEnum;
  startupId: IGitRepo.StartupId;
  templateType: TemplateType;
  variableId: IGitRepo.VariableId;
}

export type GetLegalPageAsFileOutput = {
  content: Buffer | string;
  contentType: string;
  encoding?: string;
};

export class GetLegalPageAsFile extends AbstractCachedUseCase<GetLegalPageAsFileInput, GetLegalPageAsFileOutput> {
  protected readonly cacheMasterKey = "GetLegalPageAsFile";

  constructor(
    private readonly mdxService: MdxService,
    private readonly gitRepo: IGitRepo,
  ) {
    super();
  }

  public async cachedExecute({
    startupId,
    templateType,
    variableId,
    fileType,
  }: GetLegalPageAsFileInput): Promise<GetLegalPageAsFileOutput> {
    const variable = await this.gitRepo.getVariableForPage(startupId, variableId, templateType);
    const raw = await this.gitRepo.getTemplateRaw(variable.group, templateType, variable.sha);

    switch (fileType) {
      case PageExtEnum.HTML:
        return {
          content: await this.renderAsHtml(raw, variable.variables),
          contentType: "text/html; charset=utf-8",
          encoding: "utf-8",
        };
      case PageExtEnum.MARKDOWN:
        return {
          content: this.renderAsMarkdown(raw, variable.variables),
          contentType: "text/markdown; charset=utf-8",
          encoding: "utf-8",
        };
      case PageExtEnum.PDF:
        return {
          content: await this.renderAsPdf(raw, variable.variables),
          contentType: "application/pdf; charset=utf-8",
          encoding: "utf-8",
        };
      case PageExtEnum.TEXT:
        return {
          content: this.renderAsPlainText(raw, variable.variables),
          contentType: "text/plain; charset=utf-8",
          encoding: "utf-8",
        };
      default:
        throw new Error(`Unknown file type: ${fileType as string}`);
    }
  }

  private async renderAsHtml(raw: string, data?: SimpleObject): Promise<string> {
    return this.mdxService.renderAsHtml(raw, data);
  }

  private renderAsMarkdown(raw: string, data?: SimpleObject): string {
    return this.mdxService.renderAsMarkdown(raw, data);
  }

  private renderAsPlainText(raw: string, data?: SimpleObject): string {
    return this.mdxService.renderAsPlainText(raw, data);
  }

  private renderAsPdf(raw: string, data?: SimpleObject): Promise<Buffer> {
    return this.mdxService.renderAsPdf(raw, data);
  }
}
