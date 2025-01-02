import matter from "gray-matter";
import Mustache from "mustache";
import { compileMDX } from "next-mdx-remote/rsc";
import { cache, type ReactElement } from "react";

import { validateTemplateMeta } from "@/utils/templateMeta";

const cachedMatter = cache(matter);
const cachedMustache = cache(Mustache.render);

export class MdxService {
  public async renderRawAsComponent(rawContent: string, data?: Record<string, unknown>): Promise<ReactElement> {
    const source = cachedMustache(rawContent, data);
    const { content } = await compileMDX({
      source,
    });
    return content;
  }

  public async renderRawAsDisplayableComponent(rawContent: string): Promise<ReactElement> {
    const { data, content } = cachedMatter(rawContent);

    const metadata = validateTemplateMeta(data);
    const fakeVariables = Object.fromEntries(Object.entries(metadata.variables).map(([k]) => [k, `\\{\\{${k}\\}\\}`]));

    return this.renderRawAsComponent(content, fakeVariables);
  }

  public removeMetadataFromRaw(rawContent: string): string {
    const { content } = cachedMatter(rawContent);
    return content;
  }
}
