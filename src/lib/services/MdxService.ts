import matter, { stringify as matterStringify } from "gray-matter";
import Mustache from "mustache";
import { compileMDX } from "next-mdx-remote/rsc";
import { cache, type ReactElement } from "react";

import { validateTemplateMeta } from "@/utils/templateMeta";
import { type SimpleObject } from "@/utils/types";

import { type Service } from "./types";

const cachedMatter = cache(matter);
const cachedMustache = cache(Mustache.render);

export class MdxService implements Service {
  public init(): void {
    // Nothing to do
  }

  public async renderRawAsComponent(rawContent: string, data?: Record<string, unknown>): Promise<ReactElement> {
    const source = cachedMustache(rawContent, data);
    const { content } = await compileMDX({
      source,
      options: {
        parseFrontmatter: true,
      },
    });
    return content;
  }

  public async renderRawAsDisplayableComponent(
    rawContent: string,
    variables?: SimpleObject<string>,
  ): Promise<ReactElement> {
    let usedVars = variables;
    if (!usedVars) {
      const { data } = cachedMatter(rawContent);
      usedVars = validateTemplateMeta(data).variables;
    }

    const fakeVariables = Object.fromEntries(Object.entries(usedVars).map(([k]) => [k, `\\{\\{${k}\\}\\}`]));

    return this.renderRawAsComponent(rawContent, fakeVariables);
  }

  public removeMetadataFromRaw(rawContent: string): string {
    const { content } = cachedMatter(rawContent);
    return content;
  }

  public addMetadataToRaw(rawContent: string, metadata: Record<string, unknown>): string {
    return matterStringify(rawContent, metadata);
  }
}
