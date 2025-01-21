import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import Link from "next/link";

import { StartupGrid, StartupGridExplainer } from "@/components/StartupGrid";
import { Container, FormFieldset } from "@/dsfr";
import { groupRuleValidations } from "@/lib/model/Group";
import { auth } from "@/lib/next-auth/auth";
import { gitRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";

const PageListPage = async () => {
  const session = await auth();

  // TODO : in use case
  const espaceMembreService = await getServerService("espaceMembre");
  const member = session ? await espaceMembreService.getMemberByUsername(session.user.username) : null;
  const incubators = await espaceMembreService.getIncubatorsWithStartups();
  const variables = await gitRepo.getAllVariables();
  // ---
  const knownStartups = Object.keys(variables);

  return (
    <Container my="4w">
      <h1>Liste des startups par Incubateur</h1>
      <StartupGridExplainer />
      {incubators
        .sort((i1, i2) => (i1.ghid.toLowerCase() < i2.ghid.toLowerCase() ? -1 : 1))
        .map(incubator => {
          const startupsToKeep = incubator.startups
            .filter(startup => knownStartups.includes(startup.ghid))
            .sort((s1, s2) => (s1.ghid.toLowerCase() < s2.ghid.toLowerCase() ? -1 : 1))
            .sort((s1, s2) => {
              const s1Member = member ? groupRuleValidations.startup(member, s1.ghid) : false;
              const s2Member = member ? groupRuleValidations.startup(member, s2.ghid) : false;
              return s1Member === s2Member ? 0 : s1Member ? -1 : 1;
            });
          const isInAnimation = member ? groupRuleValidations.animation(member, incubator.ghid) : false;
          return (
            <FormFieldset
              key={incubator.uuid}
              legend={`${incubator.title} (${startupsToKeep.length} / ${incubator.startups.length})`}
              hint={
                <>
                  <Link href={`/incubator/${incubator.ghid}`}>{incubator.ghid}</Link>
                  {isInAnimation && (
                    <Badge as="span" small severity="info" className={cx(fr.cx("fr-ml-1-5v"), "align-middle")}>
                      Vous animez
                    </Badge>
                  )}
                </>
              }
              elements={[
                startupsToKeep.length ? (
                  <StartupGrid
                    member={member}
                    startups={startupsToKeep}
                    variables={variables}
                    isInAnimation={isInAnimation}
                  />
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
