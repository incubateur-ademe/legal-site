import Mustache from "mustache";
import { compileMDX } from "next-mdx-remote/rsc";
import { type ReactElement } from "react";

export async function mdxFetcher(
  template: string,
  data: Record<string, unknown>,
): Promise<[metadata: Record<string, unknown>, templateContent: ReactElement]> {
  const res = await fetch(template);
  if (!res.ok) {
    throw new Error("Failed to fetch MDX");
  }
  const file = await res.text();

  const templated = Mustache.render(file, data);

  const { frontmatter, content } = await compileMDX({
    source: templated,
    options: {
      parseFrontmatter: true,
    },
  });
  return [frontmatter, content];
}
