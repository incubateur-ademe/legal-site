import { type Metadata } from "next";

import { Container } from "@/dsfr";

import { sharedMetadata } from "../shared-metadata";
import { StatsContent } from "./content";

const title = "Statistiques d'utilisation";
const description = "Statistiques d'utilisation de la plateforme";
const url = "/stats";

export const metadata: Metadata = {
  ...sharedMetadata,
  title,
  description,
  openGraph: {
    ...sharedMetadata.openGraph,
    title,
    description,
    url,
  },
  alternates: {
    canonical: url,
  },
};

const Stats = () => (
  <Container py="6w">
    <h1>{title}</h1>
    <StatsContent />
  </Container>
);

export default Stats;
