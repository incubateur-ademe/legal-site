import { ClientOnly } from "@/components/utils/ClientOnly";

import { MdxEditor } from "./MdxEditor";

const TemplateEdit = async () => {
  const rawTemplate = await fetch(
    "https://raw.githubusercontent.com/incubateur-ademe/legal-site-templates-test/refs/heads/main/mentions-legales.md",
  );
  const template = await rawTemplate.text();

  return (
    <div style={{ height: "100vh" }}>
      <ClientOnly>
        <MdxEditor defaultValue={template} />
      </ClientOnly>
    </div>
  );
};

export default TemplateEdit;
