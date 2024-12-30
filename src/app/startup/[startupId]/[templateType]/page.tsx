import { mdxFetcher } from "@/lib/mdx/fetcher";
import { type TemplateTypeEnum } from "@/lib/repo/IGitRepo";

const StartupLegalPage = async ({
  params,
}: {
  params: Promise<{ startupId: string; templateType: TemplateTypeEnum }>;
}) => {
  const { startupId, templateType } = await params;
  const { content, frontmatter } = await mdxFetcher(startupId, "ademe", templateType, "72c7813");
  return (
    <>
      <code>{JSON.stringify({ frontmatter })}</code>
      {content}
    </>
  );
};

export default StartupLegalPage;
