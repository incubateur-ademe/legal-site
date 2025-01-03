import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Tabs from "@codegouvfr/react-dsfr/Tabs";
import Tag from "@codegouvfr/react-dsfr/Tag";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import Link from "next/link";

import { ClientOnly } from "@/components/utils/ClientOnly";
import { Container, Grid, GridCol } from "@/dsfr";
import { RecapCard } from "@/dsfr/base/RecapCard";
import { auth } from "@/lib/next-auth/auth";
import { gitRepo } from "@/lib/repo";
import { type GitSha7, type TemplateType, TemplateTypeName } from "@/lib/repo/IGitRepo";
import { mdxService } from "@/lib/services";
import { GetTemplateWithDisplayableContent } from "@/useCases/GetTemplateWithDisplayableContent";
import { toFrenchDateHour } from "@/utils/data";

interface Params {
  groupId: string;
  sha: GitSha7;
  type: TemplateType;
}

interface Props {
  params: Promise<Params>;
}

const TemplateView = async ({ params }: Props) => {
  const session = await auth();
  const { groupId, sha, type } = await params;

  const useCase = new GetTemplateWithDisplayableContent(mdxService, gitRepo);

  const { content, template, raw } = await useCase.execute({ groupId, templateId: sha, type });
  const variablesEntries = Object.entries(template.variables);

  const hasNewerVersion = template.versions[0].sha !== sha;

  return (
    <Container ptmd="14v" mbmd="14v">
      <ButtonsGroup
        inlineLayoutWhen="sm and up"
        buttonsEquisized
        buttons={[
          {
            children: "Retour",
            linkProps: {
              href: "/template",
            },
            iconId: "fr-icon-arrow-left-line",
            iconPosition: "left",
            priority: "secondary",
          },
          {
            children: "Dupliquer",
            disabled: true,
            // linkProps: {
            //   href: `/template/${type}/${groupId}/${sha}/duplicate`,
            // },
            iconId: "ri-file-copy-line",
            iconPosition: "right",
            priority: "tertiary",
            title: "Fonctionnalité à venir",
          },
          {
            children: "Éditer",
            linkProps: {
              href: `/template/${type}/${groupId}/${sha}/edit`,
            },
            iconId: "fr-icon-edit-line",
            iconPosition: "right",
            priority: "primary",
          },
        ]}
      />
      {hasNewerVersion && (
        <Alert
          className={fr.cx("fr-my-2w")}
          title={`Nouvelle version disponible (${toFrenchDateHour(template.versions[0].date)})`}
          severity="warning"
          description={
            <>
              Vous regardez actuellement une ancienne version du template. Pour aller à la dernière version cliquez{" "}
              <Link href={`/template/${type}/${groupId}/${template.versions[0].sha}`}>ici</Link>.
            </>
          }
        />
      )}
      <Grid haveGutters>
        <GridCol base={4}>
          <h3 className={fr.cx("fr-mb-1v")}>Métadonnées</h3>
          <RecapCard
            title="Général"
            content={
              <>
                Auteurice :{" "}
                {session?.user.username === template.author ? <Tag small>Vous</Tag> : <b>{template.author}</b>}
                <br />
                Description : <b>{template.description}</b>
                <br />
                Type : <Tag small>{TemplateTypeName[type]}</Tag>
                <br />
                Groupe : <Tag small>{groupId}</Tag>
                <br />
                SHA :{" "}
                <b>
                  <a target="_blank" href={template.githubUrl}>
                    {sha}
                  </a>
                </b>
                <br />
                Commentaire:{" "}
                <code>{template.versions.find(v => v.sha === sha)?.comment || "(pas de commentaires)"}</code>
              </>
            }
          />
          <RecapCard
            title={`Variables (${variablesEntries.length})`}
            content={(() => {
              if (variablesEntries.length === 0) {
                return <p>Aucune variable</p>;
              }

              return (
                <ul>
                  {variablesEntries.map(([variable, description]) => (
                    <li key={variable}>
                      <b>{`{{ ${variable} }}`}</b> : <i>{description}</i>
                    </li>
                  ))}
                </ul>
              );
            })()}
          />
          <RecapCard
            title="Versions"
            content={(() => {
              return (
                <ul>
                  {template.versions.map(version => (
                    <li key={version.sha}>
                      {version.sha === sha ? (
                        version.sha
                      ) : (
                        <Link href={`/template/${type}/${groupId}/${version.sha}`}>{version.sha}</Link>
                      )}{" "}
                      <Tooltip title={version.comment || "(pas de commentaires)"} kind="hover" /> (
                      {toFrenchDateHour(version.date)}) {version.sha === sha && <Tag small>Actuelle</Tag>}
                    </li>
                  ))}
                </ul>
              );
            })()}
          />
        </GridCol>
        <GridCol base={8}>
          <ClientOnly>
            <Tabs
              tabs={[
                {
                  content,
                  label: "Rendu",
                },
                {
                  content: <pre style={{ whiteSpace: "pre-line" }}>{raw}</pre>,
                  label: "Markdown",
                },
              ]}
            />
          </ClientOnly>
        </GridCol>
      </Grid>
    </Container>
  );
};

export default TemplateView;
