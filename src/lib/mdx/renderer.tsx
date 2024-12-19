import Mustache from "mustache";
import { compileMDX, type CompileMDXResult } from "next-mdx-remote/rsc";

export async function mdxRenderer(file: string, data: Record<string, unknown>): Promise<CompileMDXResult> {
  const templated = Mustache.render(file, data);

  const { frontmatter, content } = await compileMDX({
    source: templated,
    options: {
      parseFrontmatter: true,
    },
  });
  return { frontmatter, content };
}
