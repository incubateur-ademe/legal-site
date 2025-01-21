import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { notFound } from "next/navigation";

import { StartupGrid, StartupGridExplainer } from "@/components/StartupGrid";
import { Container } from "@/dsfr";
import { groupRuleValidations } from "@/lib/model/Group";
import { auth } from "@/lib/next-auth/auth";
import { gitRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { type NextServerPageProps } from "@/utils/next";

interface Params {
  id: string;
}
const IncubatorPage = async ({ params }: NextServerPageProps<Params>) => {
  const session = await auth();

  const { id } = await params;

  // TODO : in use case
  const espaceMembreService = await getServerService("espaceMembre");
  const member = session ? await espaceMembreService.getMemberByUsername(session.user.username) : null;
  const incubators = await espaceMembreService.getIncubatorsWithStartups();
  const variables = await gitRepo.getAllVariables();
  // ---

  const incubator = incubators.find(incubator => incubator.ghid === id);

  if (!incubator) {
    notFound();
  }

  const startups = incubator.startups
    .sort((s1, s2) => (s1.ghid.toLowerCase() < s2.ghid.toLowerCase() ? -1 : 1))
    .sort((s1, s2) => {
      const s1Member = member ? groupRuleValidations.startup(member, s1.ghid) : false;
      const s2Member = member ? groupRuleValidations.startup(member, s2.ghid) : false;
      return s1Member === s2Member ? 0 : s1Member ? -1 : 1;
    });
  const isInAnimation = member ? groupRuleValidations.animation(member, incubator.ghid) : false;

  return (
    <Container my="4w">
      <h1>
        {incubator.title}
        {isInAnimation && (
          <Badge as="span" severity="info" className={cx(fr.cx("fr-ml-1-5v"), "align-middle")}>
            Vous animez
          </Badge>
        )}
      </h1>
      <StartupGridExplainer />
      <StartupGrid
        showDefaultIfNoVar
        member={member}
        startups={startups}
        variables={variables}
        isInAnimation={isInAnimation}
      />
    </Container>
  );
};

export default IncubatorPage;
