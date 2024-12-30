import { z } from "zod";

import { mdxFetcher } from "@/lib/mdx/fetcher";
import { type TemplateTypeEnum } from "@/lib/repo/IGitRepo";

enum PageExtEnum {
  HTML = "html",
  MARKDOWN = "md",
  PDF = "pdf",
  TEXT = "txt",
}

const PageExt = z.nativeEnum(PageExtEnum);
type PageExt = z.infer<typeof PageExt>;

type Param = { ext: PageExt; startupId: string; templateType: TemplateTypeEnum };

export async function GET(request: Request, { params }: { params: Promise<Param> }) {
  const { ext, startupId, templateType } = await params;
  console.log({ ext, startupId, templateType });
  const { content, frontmatter } = await mdxFetcher(startupId, "ademe", templateType, "72c7813");

  switch (ext) {
    case PageExtEnum.HTML:
      return new Response((await import("react-dom/server")).renderToString(content), {
        headers: { "Content-Type": "text/html; charset=utf-8", encoding: "iso8859-1" },
      });
    case PageExtEnum.MARKDOWN:
      return new Response("MARKDOWN", { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
    case PageExtEnum.TEXT:
      return new Response("TEXT", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    case PageExtEnum.PDF:
      return new Response("PDF", { headers: { "Content-Type": "application/pdf; charset=utf-8" } });
    default:
      return new Response("Not Found", { status: 404 });
  }
}
