import { Container } from "@/dsfr";
import { type TemplateType } from "@/lib/model/Template";
import { gitRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { GetLegalPage } from "@/useCases/GetLegalPage";

const StartupLegalPage = async ({
  params,
}: {
  params: Promise<{ startupId: string; templateType: TemplateType; variableId: string }>;
}) => {
  const { startupId, templateType, variableId } = await params;

  const useCase = new GetLegalPage(await getServerService("mdx"), gitRepo);

  const { content, raw, template } = await useCase.execute({
    startupId,
    templateType,
    variableId,
  });

  return <Container my="4w">{content}</Container>;
};

export default StartupLegalPage;
