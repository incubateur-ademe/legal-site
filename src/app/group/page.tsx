import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Highlight from "@codegouvfr/react-dsfr/Highlight";
import Tag from "@codegouvfr/react-dsfr/Tag";
import Link from "next/link";
import { Suspense } from "react";

import { config } from "@/config";
import { Container, Grid, GridCol, Icon } from "@/dsfr";
import { RecapCard } from "@/dsfr/base/RecapCard";
import { auth } from "@/lib/next-auth/auth";
import { gitRepo } from "@/lib/repo";
import { TemplateTypeEnum, TemplateTypeName } from "@/lib/repo/IGitRepo";
import { espaceMembreService } from "@/lib/services";

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
        <Suspense>
          {groups.map(async group => {
            const isInGroup = session
              ? config.api.templates.admins.includes(session.user.username) ||
                (await espaceMembreService.isMemberInGroup(session.user.username, group))
              : false;
            return (
              <GridCol key={group.id} md={3}>
                <RecapCard
                  title={
                    <>
                      {group.name}{" "}
                      {isInGroup && (
                        <Badge small severity="info">
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
                                    href={`/template/${type}/${group.id}/${hasTemplate ? hasTemplate.sha : "new"}`}
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
        </Suspense>
      </Grid>
    </Container>
  );
};

export default GroupListPage;
