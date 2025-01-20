import { fr } from "@codegouvfr/react-dsfr";
import Button, { type ButtonProps } from "@codegouvfr/react-dsfr/Button";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import Link from "next/link";

import { Container } from "@/dsfr";
import { TableCustom } from "@/dsfr/base/TableCustom";
import { auth } from "@/lib/next-auth/auth";
import { gitRepo } from "@/lib/repo";
import { ListTemplates } from "@/useCases/ListTemplates";

const Template = async () => {
  const session = await auth();
  const useCase = new ListTemplates(gitRepo);

  const templates = await useCase.execute({});

  return (
    <Container my="4w">
      {session && (
        <Button
          linkProps={{
            href: "/template/new",
          }}
        >
          Nouveau template
        </Button>
      )}
      <TableCustom
        showColWhenNullData
        compact
        className={fr.cx("fr-mt-2w")}
        header={[
          {
            children: "Groupe",
          },
          {
            children: "Type",
          },
          {
            children: "Auteurice",
          },
          {
            children: "Description",
          },
          {
            children: "Nombre de variables",
          },
          {
            children: "Nombre de versions",
          },
          {
            children: "Actions",
          },
        ]}
        body={templates.map(template => ({
          className: template.author === session?.user.id && "border-solid",
          row: [
            {
              children: (
                <Link href={`/template/${template.groupId}/${template.type}/${template.sha}`}>{template.groupId}</Link>
              ),
            },
            {
              children: template.type,
            },
            {
              children: template.author,
            },
            {
              children: template.description ? (
                <Tooltip kind="hover" title={template.description}>
                  <span className="underline decoration-dotted underline-offset-2 cursor-pointer">
                    {template.description.substring(0, 17)}...
                  </span>
                </Tooltip>
              ) : (
                ""
              ),
            },
            {
              children: (() => {
                const varKeys = Object.keys(template.variables);
                return varKeys.length ? (
                  <Tooltip
                    kind="hover"
                    title={varKeys.map(k => (
                      <div key={k}>{k}</div>
                    ))}
                  >
                    <span className="underline decoration-dotted underline-offset-2 cursor-pointer">
                      {varKeys.length}
                    </span>
                  </Tooltip>
                ) : (
                  0
                );
              })(),
            },
            {
              children: template.versions.length,
            },
            {
              children: (
                <Tooltip kind="hover" title="Dupliquer le template">
                  <Button
                    iconId="ri-file-copy-line"
                    size="small"
                    priority="secondary"
                    {...({} as unknown as ButtonProps)} // avoid title prop
                  />
                </Tooltip>
              ),
            },
          ],
        }))}
      />
    </Container>
  );
};

export default Template;
