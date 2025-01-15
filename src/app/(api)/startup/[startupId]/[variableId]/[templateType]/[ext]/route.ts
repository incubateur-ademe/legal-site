import { notFound } from "next/navigation";
import { z } from "zod";

import { type TemplateType } from "@/lib/model/Template";
import { gitRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { GetLegalPageAsFile, PageExtEnum } from "@/useCases/GetLegalPageAsFile";
import { NotImplementError } from "@/utils/error";
import { getStatusCodeResponse } from "@/utils/network";

const PageExt = z.nativeEnum(PageExtEnum);
type PageExt = z.infer<typeof PageExt>;

type Param = { ext: PageExt; startupId: string; templateType: TemplateType; variableId: string };

export async function GET(_: Request, { params }: { params: Promise<Param> }) {
  const { ext, startupId, templateType, variableId } = await params;

  if (PageExt.safeParse(ext).success === false) {
    notFound();
  }

  const useCase = new GetLegalPageAsFile(await getServerService("mdx"), gitRepo);

  try {
    const { content, contentType, encoding } = await useCase.execute({
      fileType: ext,
      startupId,
      templateType,
      variableId,
    });

    return new Response(content, {
      headers: {
        "Content-Type": contentType,
        ...(encoding && { "Content-Encoding": encoding }),
      },
    });
  } catch (e) {
    if (e instanceof NotImplementError) {
      return getStatusCodeResponse("NOT_IMPLEMENTED");
    }
    return getStatusCodeResponse("INTERNAL_SERVER_ERROR");
  }
}
