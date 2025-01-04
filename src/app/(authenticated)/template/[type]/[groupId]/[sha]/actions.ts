"use server";

import { gitRepo } from "@/lib/repo";
import { type GitSha7, type Template } from "@/lib/repo/IGitRepo";
import { mdxService } from "@/lib/services";
import { SaveTemplate } from "@/useCases/SaveTemplate";
import { assertServerSession } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export async function saveTemplate(
  template: Template,
  content: string,
  comment?: string,
): Promise<ServerActionResponse<GitSha7>> {
  // const session = await assertServerSession({ owner: template.author, admin: template.groupId === "default" });
  const session = await assertServerSession();

  const useCase = new SaveTemplate(gitRepo, mdxService);

  try {
    const sha = await useCase.execute({
      content,
      template,
      editor: {
        email: session.user.email,
        name: session.user.username,
      },
      comment,
    });

    return {
      ok: true,
      data: sha,
    };
  } catch (error) {
    return {
      ok: false,
      error: (error as Error).message,
    };
  }
}
