import { z } from "zod";

import { ClientOnly } from "@/components/utils/ClientOnly";
import { Container } from "@/dsfr";
import { gitRepo } from "@/lib/repo";
import { GitSha7, TemplateType } from "@/lib/repo/IGitRepo";
import { mdxService } from "@/lib/services";
import { GetTemplateWithRawContent } from "@/useCases/GetTemplateWithRawContent";
import { withValidation } from "@/utils/next";

import { MdxEditor } from "./MdxEditor";

const paramsSchema = z.object({
  groupId: z.string(),
  sha: GitSha7,
  type: TemplateType,
});

const TemplateEdit = withValidation(
  { paramsSchema },
  { notFound: true },
)(async ({ params }) => {
  const { groupId, sha, type } = await params;
  const useCase = new GetTemplateWithRawContent(mdxService, gitRepo);
  const { raw, template } = await useCase.execute({ groupId, templateId: sha, type });

  return (
    <Container className="min-h-64 max-h-full" ptmd="14v" mbmd="14v" size="md" fluid mx="3w">
      <ClientOnly>
        <MdxEditor raw={raw} template={template} />
      </ClientOnly>
    </Container>
  );
});

export default TemplateEdit;
