import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";

import { Container, FormFieldset, Grid, GridCol } from "@/dsfr";
import { RecapCard } from "@/dsfr/base/RecapCard";
import { groupRuleValidations } from "@/lib/model/Group";
import { type TemplateType, TemplateTypeShortName } from "@/lib/model/Template";
import { auth } from "@/lib/next-auth/auth";
import { gitRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";

const PageListPage = async () => {
  const session = await auth();

  // TODO : in use case
  const member = session
    ? await (await getServerService("espaceMembre")).getMemberByUsername(session.user.username)
    : null;

  const incubators = await (await getServerService("espaceMembre")).getIncubatorsWithStartups();

  const variables = await gitRepo.getAllVariables();
  // ---
  const knownStartups = Object.keys(variables);

  return (
    <Container my="4w">
      {incubators
        .sort((i1, i2) => (i1.ghid.toLowerCase() < i2.ghid.toLowerCase() ? -1 : 1))
        .map(incubator => {
          const startupsToKeep = incubator.startups.filter(startup => knownStartups.includes(startup.ghid));
          const isInAnimation = member ? groupRuleValidations.animation(member, incubator.ghid) : false;
          return (
            <FormFieldset
              key={incubator.uuid}
              legend={`${incubator.title} (${startupsToKeep.length} / ${incubator.startups.length})`}
              hint={
                <>
                  {incubator.ghid}
                  {isInAnimation && (
                    <Badge as="span" small severity="info" className={cx(fr.cx("fr-ml-1-5v"), "align-middle")}>
                      Vous animez
                    </Badge>
                  )}
                </>
              }
              elements={[
                startupsToKeep.length ? (
                  <Grid key={`startups-${incubator.uuid}`} haveGutters>
                    {startupsToKeep
                      .sort((s1, s2) => (s1.ghid.toLowerCase() < s2.ghid.toLowerCase() ? -1 : 1))
                      .map(startup => {
                        const currentStartupVariables = variables[startup.ghid];
                        const startupVariableIds = Object.keys(currentStartupVariables);
                        const isInStartup = member ? groupRuleValidations.startup(member, startup.ghid) : false;

                        return (
                          <GridCol key={startup.uuid} md={4}>
                            <RecapCard
                              title={
                                <>
                                  {startup.name} ({startup.ghid})
                                  {isInStartup && (
                                    <Badge as="span" small severity="info">
                                      Membre
                                    </Badge>
                                  )}
                                </>
                              }
                              content={
                                <ul>
                                  {startupVariableIds.map(variableId => (
                                    <li key={`${startup.uuid}-${variableId}`}>
                                      {variableId} :{" "}
                                      {(Object.keys(TemplateTypeShortName) as TemplateType[]).map(templateType => {
                                        const currentVariable = currentStartupVariables[variableId][templateType];
                                        return (
                                          <Tag
                                            className={fr.cx("fr-mr-1-5v")}
                                            key={`${startup.uuid}-${variableId}-${templateType}`}
                                            {...(currentVariable?.url
                                              ? { linkProps: { href: currentVariable.url } }
                                              : { nativeButtonProps: { disabled: true } })}
                                            small
                                          >
                                            {TemplateTypeShortName[templateType]}
                                          </Tag>
                                        );
                                      })}
                                    </li>
                                  ))}
                                </ul>
                              }
                            />
                          </GridCol>
                        );
                      })}
                  </Grid>
                ) : (
                  <Alert severity="info" small description="Aucune startup n'a commencé ses pages légales." />
                ),
              ]}
            />
          );
        })}
    </Container>
  );
};

export default PageListPage;
