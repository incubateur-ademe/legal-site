import Card from "@codegouvfr/react-dsfr/Card";

import { Grid, GridCol } from "@/dsfr";
import { fetchMatomoData } from "@/lib/matomo";

export const StatsContent = async () => {
  const matomoData = await fetchMatomoData();

  return (
    <Grid haveGutters>
      <GridCol md={4}>
        <Card
          title="Nombre de visites"
          desc="Nombre de visites total du site sur les 12 derniers mois"
          start={<strong className="fr-display--md">{matomoData.nbVisits}</strong>}
          size="large"
          grey
        />
      </GridCol>
      <GridCol md={4}>
        <Card
          title="Nombre de pages vues (total)"
          desc="Nombre de pages vues au total sur le site sur les 12 derniers mois"
          start={<strong className="fr-display--md">{matomoData.nbPageViews}</strong>}
          size="large"
          grey
        />
      </GridCol>
      <GridCol md={4}>
        <Card
          title="Nombre de pages vues (uniques)"
          desc="Nombre de pages vues uniques sur le site sur les 12 derniers mois"
          start={<strong className="fr-display--md">{matomoData.nbUniqPageViews}</strong>}
          size="large"
          grey
        />
      </GridCol>
    </Grid>
  );
};
