import { Suspense } from "react";
import { z } from "zod";

import { ClientOnly } from "@/components/utils/ClientOnly";
import { Container } from "@/dsfr";
import { GitSha7, TemplateType, TemplateTypeName } from "@/lib/model/Template";
import { gitRepo } from "@/lib/repo";
import { getService } from "@/lib/services";
import { GetTemplateWithRawContent } from "@/useCases/GetTemplateWithRawContent";
import { withValidation } from "@/utils/next";

import { MdxEditor } from "../../../../MdxEditor";

const paramsSchema = z.object({
  groupId: z.string(),
  sha: GitSha7,
  templateType: TemplateType,
});

const TemplateEdit = withValidation(
  { paramsSchema },
  { notFound: true },
)(async ({ params }) => {
  const { groupId, sha, templateType } = await params;
  const mdxService = await getService("mdx");
  const useCase = new GetTemplateWithRawContent(mdxService, gitRepo);
  const { raw, template } = await useCase.execute({ groupId, templateId: sha, templateType });

  return (
    <Container className="min-h-64 max-h-full" ptmd="14v" mbmd="14v" size="md" fluid mx="3w">
      <Container>
        <h1>
          Modifier le tempate de {TemplateTypeName[template.type]} ({template.groupId})
        </h1>
      </Container>
      <ClientOnly>
        <Suspense>
          <MdxEditor raw={raw} template={template} />
        </Suspense>
      </ClientOnly>
    </Container>
  );
});

export default TemplateEdit;
