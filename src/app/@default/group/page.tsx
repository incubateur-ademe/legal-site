import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Highlight from "@codegouvfr/react-dsfr/Highlight";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { times } from "lodash";
import Link from "next/link";

import { config } from "@/config";
import { Container, Grid, GridCol, Icon } from "@/dsfr";
import { RecapCard } from "@/dsfr/base/RecapCard";
import { TemplateTypeEnum, TemplateTypeName } from "@/lib/model/Template";
import { auth } from "@/lib/next-auth/auth";
import { gitRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";

const espaceMembreService = await getServerService("espaceMembre");

const GroupListPage = async () => {
  const session = await auth();

  const groups = await gitRepo.getGroups();

  return (
    <Container my="4w">
      <h1>Liste des groupes</h1>
      <Highlight>
        Un groupe est une représentation d'une organisation ou d'un service. Il permet de créer des templates qui
        peuvent leurs être spécifiques.
        <br />
        Il est représenté et administré par un ou plusieurs propriétaires en fonction des règles de votre organisation.
      </Highlight>
      <Grid haveGutters>
        <GridCol md={3}>
          <RecapCard
            title="Nouveau groupe"
            className={cx("!border-dashed", `!border-[var(--border-action-low-blue-france)]`)}
            classes={{ content: "flex flex-col items-center" }}
            content={
              <>
                <p>
                  <i>Votre groupe ?</i>
                </p>
                {!session && (
                  <p className={cx(fr.cx("fr-text--sm"), "text-center")}>
                    <i>
                      (Vous devez être <Link href="/login">connecté</Link> pour créer un groupe)
                    </i>
                  </p>
                )}
                <Button
                  {...((session ? { linkProps: { href: "/group/new" } } : {}) as unknown as object)} // have to cast to unknown to avoid type error
                  disabled={!session}
                  title="Créer un groupe"
                  iconId="fr-icon-add-line"
                  size="large"
                >
                  Créer
                </Button>
              </>
            }
          />
        </GridCol>
        {groups.map(async group => {
          let isInGroup = false;
          if (session?.user) {
            const { isMember, isOwner } = await espaceMembreService.getMemberMembership(session.user.username, group);
            isInGroup = config.templates.admins.includes(session.user.username) || isOwner || isMember;
          }
          return (
            <GridCol key={group.id} md={3}>
              <RecapCard
                title={
                  <>
                    {group.name}{" "}
                    {isInGroup && (
                      <Badge as="span" small severity="info">
                        Membre
                      </Badge>
                    )}
                  </>
                }
                editLink={isInGroup && `/group/${group.id}/edit`}
                content={
                  <>
                    <p>{group.description}</p>
                    ID : <b>{group.id}</b>
                    <br />
                    Propriétaires :{" "}
                    {group.owners.map(owner => (
                      <Tag small key={`${group.id}-${owner}`}>
                        {owner}
                      </Tag>
                    ))}
                    <br />
                    Templates :
                    <ul className="list-none">
                      {Object.values(TemplateTypeEnum).map(type => {
                        const hasTemplate = group.templates.find(t => t.type === type);

                        return (
                          <li key={`${group.id}-${type}`}>
                            <Icon
                              icon={hasTemplate ? "fr-icon-checkbox-circle-fill" : "fr-icon-close-circle-fill"}
                              color={hasTemplate ? "text-default-success" : "text-default-error"}
                              text={
                                <Link
                                  className={fr.cx("fr-mb-1v")}
                                  href={`/template/${group.id}/${type}/${hasTemplate ? hasTemplate.sha : "new"}`}
                                >
                                  {TemplateTypeName[type]}
                                </Link>
                              }
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </>
                }
              />
            </GridCol>
          );
        })}
        {times(10, n => (
          <GridCol md={3} key={`fake-group-${n}`}>
            {/* Fake group */}
            <RecapCard
              title="Groupe"
              content={
                <>
                  <p>
                    <i>Un groupe fictif</i>
                  </p>
                  <p>
                    <i>pour tester l'interface</i>
                  </p>
                  <p>
                    <i>et les fonctionnalités</i>
                  </p>
                  <p>
                    <i>de gestion des groupes</i>
                  </p>
                  <p>
                    <i>et des templates</i>
                  </p>
                </>
              }
            />
          </GridCol>
        ))}
      </Grid>
    </Container>
  );
};

export default GroupListPage;
