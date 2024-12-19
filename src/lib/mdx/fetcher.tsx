import { type CompileMDXResult } from "next-mdx-remote/rsc";

import { mdxRenderer } from "./renderer";

export async function mdxFetcher(template: string, data: Record<string, unknown>): Promise<CompileMDXResult> {
  const res = await fetch(template);
  if (!res.ok) {
    throw new Error("Failed to fetch MDX");
  }
  const file = await res.text();

  return mdxRenderer(file, data);
}
