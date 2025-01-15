import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type Metadata } from "next";

import { ImgHero } from "@/components/img/ImgHero";
import { config } from "@/config";
import { Box, Container, Grid, GridCol } from "@/dsfr";

import { sharedMetadata } from "../shared-metadata";
import styles from "./index.module.scss";

const url = "/";

export const metadata: Metadata = {
  ...sharedMetadata,
  openGraph: {
    ...sharedMetadata.openGraph,
    url,
  },
  alternates: {
    canonical: url,
  },
};

const Home = () => (
  <Box as="section" pb="4w" pt="9w" className={cx(styles.hero)}>
    <Container>
      <Grid haveGutters>
        <GridCol lg={7} className="fr-my-auto">
          <h1>{config.name}</h1>
          <p>{config.tagline}</p>
        </GridCol>
        <GridCol md={6} lg={5} className="fr-mx-auto">
          <ImgHero />
        </GridCol>
      </Grid>
    </Container>
  </Box>
);

export default Home;
