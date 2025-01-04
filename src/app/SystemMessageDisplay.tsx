import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import artworkOvoidSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/background/ovoid.svg";
import artworkCalendarSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/digital/calendar.svg";
import artworkSearchSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/digital/search.svg";
import artworkPadlockSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/system/padlock.svg";
import artworkTechnicalErrorSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/system/technical-error.svg";
import { type StaticImageData } from "next/image";
import { type LinkProps } from "next/link";
import { type ReactNode } from "react";

import { Box, Container, Grid, GridCol } from "@/dsfr";
import artworkInProgressSvgUrl from "@/dsfr/artwork/pictograms/digital/in-progress.svg";

const artworkMap = {
  calendar: artworkCalendarSvgUrl,
  inProgress: artworkInProgressSvgUrl,
  padlock: artworkPadlockSvgUrl,
  technicalError: artworkTechnicalErrorSvgUrl,
  search: artworkSearchSvgUrl,
};

interface SystemCodeMap {
  [key: string]: {
    body: ReactNode;
    headline: string;
    pictogram: StaticImageData | keyof typeof artworkMap;
    title: string;
  };
}

export const systemCodes = {
  "401": {
    title: "Erreur de connexion",
    headline: "Connexion non autorisée.",
    body: (
      <>
        L'identifiant avec lequel vous avez tenté de vous connecter n'est pas autorisé (compte inconnu, inactif, ou
        filtré). Si vous pensez qu'il s'agit d'une erreur, veuillez contacter un·e admin.
      </>
    ),
    pictogram: artworkMap.padlock,
  },
  get unauthorized() {
    return this["401"];
  },
  "403": {
    title: "Accès refusé",
    headline: "Opération non autorisée.",
    body: (
      <>
        Vous n'avez pas les droits nécessaires pour accéder à cette page. Si vous pensez qu'il s'agit d'une erreur,
        veuillez contacter un·e admin.
      </>
    ),
    pictogram: artworkMap.padlock,
  },
  get forbidden() {
    return this["403"];
  },
  "404": {
    title: "Page non trouvée",
    headline: "La page que vous cherchez est introuvable. Excusez-nous pour la gène occasionnée.",
    body: (
      <>
        Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle est correcte. La page n’est peut-être plus
        disponible.
      </>
    ),
    pictogram: artworkMap.search,
  },
  get "not-found"() {
    return this["404"];
  },
  "500": {
    title: "Erreur inattendue",
    headline:
      "Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible.",
    body: <>Essayez de rafraichir la page ou bien reessayez plus tard.</>,
    pictogram: artworkMap.technicalError,
  },
  construction: {
    title: "En construction",
    headline: "Ce service est en cours de construction.",
    body: <>Nous travaillons pour le rendre disponible le plus rapidement possible.</>,
    pictogram: artworkMap.inProgress,
  },
  maintenance: {
    title: "Maintenance",
    headline: "Le service est actuellement en maintenance.",
    body: <>Nous travaillons pour le rétablir le plus rapidement possible.</>,
    pictogram: artworkMap.inProgress,
  },
  get "login-AuthorizedCallbackError"() {
    return this["401"];
  },
  get "login-AccessDenied"() {
    return this["401"];
  },
} satisfies SystemCodeMap;

export type SystemMessageDisplayProps = SystemMessageDisplayProps.WithCode & SystemMessageDisplayProps.WithRedirect;

namespace SystemMessageDisplayProps {
  export type WithRedirect =
    | {
        noRedirect: true;
        redirectLink?: never;
        redirectText?: never;
      }
    | {
        noRedirect?: never;
        redirectLink?: LinkProps<string>["href"];
        redirectText?: string;
      };

  export type WithCode =
    | {
        body: ReactNode;
        code: "custom";
        headline: string;
        pictogram?: StaticImageData | keyof typeof artworkMap;
        title: string;
      }
    | {
        body?: never;
        code: keyof typeof systemCodes;
        headline?: never;
        pictogram?: never;
        title?: never;
      };
}

export const SystemMessageDisplay = ({
  code,
  noRedirect,
  body,
  headline,
  title,
  pictogram = artworkMap.technicalError,
  redirectLink = "/",
  redirectText = "Page d'accueil",
}: SystemMessageDisplayProps) => {
  if (code !== "custom") {
    if (!systemCodes[code]) throw new Error(`Unknown system code: ${code}`);
    ({ body, headline, title, pictogram } = systemCodes[code]);
  }

  if (typeof pictogram === "string") pictogram = artworkMap[pictogram];

  return (
    <Container>
      <Grid haveGutters valign="middle" align="center" my="7w" mtmd="12w" mbmd="10w">
        <GridCol md={6} py="0">
          <h1>{title}</h1>
          {!isNaN(+code) && (
            <Box as="p" className="fr-text--sm" mb="3w">
              Erreur {code}
            </Box>
          )}
          <Box as="p" className="fr-text--lead" mb="3w">
            {headline}
          </Box>
          <Box className="fr-text--sm" mb="5w">
            {body}
          </Box>
          {!noRedirect && (
            <ButtonsGroup
              inlineLayoutWhen="md and up"
              buttons={[
                {
                  children: redirectText,
                  linkProps: {
                    href: redirectLink,
                  },
                },
              ]}
            />
          )}
        </GridCol>
        <GridCol md={3} offsetMd={1} px="6w" pxmd="0" py="0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="fr-responsive-img fr-artwork"
            aria-hidden="true"
            width="160"
            height="200"
            viewBox="0 0 160 200"
          >
            <use className="fr-artwork-motif" href={`${artworkOvoidSvgUrl.src}#artwork-motif`}></use>
            <use className="fr-artwork-background" href={`${artworkOvoidSvgUrl.src}#artwork-background`}></use>
            <g transform="translate(40, 60)">
              <use className="fr-artwork-decorative" href={`${pictogram.src}#artwork-decorative`}></use>
              <use className="fr-artwork-minor" href={`${pictogram.src}#artwork-minor`}></use>
              <use className="fr-artwork-major" href={`${pictogram.src}#artwork-major`}></use>
            </g>
          </svg>
        </GridCol>
      </Grid>
    </Container>
  );
};
