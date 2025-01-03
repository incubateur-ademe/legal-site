import { ClientOnly } from "@/components/utils/ClientOnly";
import { Container } from "@/dsfr";
import { gitRepo } from "@/lib/repo";
import { type GitSha7, type TemplateType } from "@/lib/repo/IGitRepo";
import { mdxService } from "@/lib/services";
import { GetTemplateWithRawContent } from "@/useCases/GetTemplateWithRawContent";

import { MdxEditor } from "./MdxEditor";

interface Params {
  groupId: string;
  sha: GitSha7;
  type: TemplateType;
}

interface Props {
  params: Promise<Params>;
}

const TemplateEdit = async ({ params }: Props) => {
  const { groupId, sha, type } = await params;
  const useCase = new GetTemplateWithRawContent(mdxService, gitRepo);
  const { raw, template } = await useCase.execute({ groupId, templateId: sha, type });

  return (
    <Container className="min-h-64 max-h-full" ptmd="14v" mbmd="14v" size="md" fluid mx="3w">
      <ClientOnly>
        <MdxEditor defaultValue={raw} />
      </ClientOnly>
    </Container>
  );
};

export default TemplateEdit;
