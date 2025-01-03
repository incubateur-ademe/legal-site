import { ClientOnly } from "@/components/utils/ClientOnly";
import { Container } from "@/dsfr";

import { MdxEditor } from "./MdxEditor";

interface Params {
  groupId: string;
  sha: string;
  type: string;
}

interface Props {
  params: Promise<Params>;
}

const TemplateEdit = async ({ params }: Props) => {
  const { groupId, sha, type } = await params;
  const rawTemplate = await fetch(
    `https://raw.githubusercontent.com/incubateur-ademe/legal-site-templates-test/${sha}/templates/${groupId}/${type}.md`,
  );
  const template = await rawTemplate.text();

  return (
    <Container ptmd="14v" mbmd="14v" className="min-h-64 max-h-full" fluid>
      <ClientOnly>
        <MdxEditor defaultValue={template} />
      </ClientOnly>
    </Container>
  );
};

export default TemplateEdit;
