import { type ReactElement } from "react";

import { type Template, type TemplateType } from "@/lib/model/Template";
import { type IGitRepo } from "@/lib/repo/IGitRepo";
import { type MdxService } from "@/lib/services/MdxService";

import { AbstractCachedUseCase } from "./AbstractCacheUseCase";

export interface GetLegalPageInput {
  startupId: IGitRepo.StartupId;
  templateType: TemplateType;
  variableId: IGitRepo.VariableId;
}

export interface GetLegalPageOutput {
  content: ReactElement;
  raw: string;
  template: Template;
}
export class GetLegalPage extends AbstractCachedUseCase<GetLegalPageInput, GetLegalPageOutput> {
  protected readonly cacheMasterKey = "GetLegalPage";

  constructor(
    private readonly mdxService: MdxService,
    private readonly gitRepo: IGitRepo,
  ) {
    super();
  }

  public async cachedExecute({ startupId, templateType, variableId }: GetLegalPageInput): Promise<GetLegalPageOutput> {
    const variable = await this.gitRepo.getVariableForPage(startupId, variableId, templateType);
    const template = await this.gitRepo.getTemplate(variable.group, templateType, variable.sha);
    const raw = await this.gitRepo.getTemplateRaw(variable.group, templateType, variable.sha);

    const content = await this.mdxService.renderRawAsComponent(raw, variable.variables);
    return {
      content,
      raw,
      template,
    };
  }
}
