import { ClientOnly } from "@/components/utils/ClientOnly";
import { Container } from "@/dsfr";

import { MdxEditor } from "./MdxEditor";

const TemplateEdit = async () => {
  const rawTemplate = await fetch(
    "https://raw.githubusercontent.com/incubateur-ademe/legal-site-templates-test/refs/heads/main/templates/ademe/mentions-legales.md",
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
