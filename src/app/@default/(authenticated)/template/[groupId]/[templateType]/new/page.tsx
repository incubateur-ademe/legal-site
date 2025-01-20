import { redirect } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";

import { ClientOnly } from "@/components/utils/ClientOnly";
import { Container } from "@/dsfr";
import { type Template, TemplateType, TemplateTypeName } from "@/lib/model/Template";
import { auth } from "@/lib/next-auth/auth";
import { gitRepo } from "@/lib/repo";
import { ListTemplates } from "@/useCases/ListTemplates";
import { withValidation } from "@/utils/next";

import { MdxEditor } from "../../../MdxEditor";

const paramsSchema = z.object({
  groupId: z.string(),
  templateType: TemplateType,
});

const TemplateEdit = withValidation(
  { paramsSchema },
  { notFound: true },
)(async ({ params }) => {
  const session = (await auth())!;
  const { groupId, templateType } = await params;
  const useCase = new ListTemplates(gitRepo);
  const templates = await useCase.execute({ groupId });

  const foundTemplate = templates.find(template => template.type === templateType);

  if (foundTemplate) {
    redirect(`/template/${groupId}/${templateType}/${foundTemplate.sha}`);
  }

  return (
    <Container className="min-h-64 max-h-full" ptmd="14v" mbmd="14v" size="md" fluid mx="3w">
      <Container>
        <h1>
          Créer un nouveau template de {TemplateTypeName[templateType]} ({groupId})
        </h1>
      </Container>
      <ClientOnly>
        <Suspense>
          <MdxEditor
            raw={""}
            template={
              {
                author: session.user.username,
                type: templateType,
                groupId,
                variables: {},
              } as Template
            }
          />
        </Suspense>
      </ClientOnly>
    </Container>
  );
});

export default TemplateEdit;
