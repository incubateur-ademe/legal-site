"use server";

import { type CompileMDXResult } from "next-mdx-remote/rsc";

import { gitRepo } from "../repo";
import { type GitSha7, type TemplateType } from "../repo/IGitRepo";
import { mdxRenderer } from "./renderer";

export async function mdxFetcher(
  startupId: string,
  groupId: string,
  type: TemplateType,
  templateVersion?: GitSha7,
): Promise<CompileMDXResult> {
  const file = await gitRepo.getTemplate(groupId, type, templateVersion);
  const data = await gitRepo.getVariablesForPage(startupId, groupId, templateVersion!);

  return mdxRenderer(file, data);
}
