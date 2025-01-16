import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import Footer, { type FooterProps } from "@codegouvfr/react-dsfr/Footer";

import { config } from "@/config";
import { FooterPersonalDataPolicyItem } from "@/consentManagement";

export interface AuthFooterProps {
  id: FooterProps["id"];
}

export const AuthFooter = ({ id }: AuthFooterProps) => (
  <Footer
    id={id}
    accessibility="non compliant"
    accessibilityLinkProps={{ href: "/accessibilite" }}
    contentDescription={`${config.brand.name} est un service développé par l'Accélérateur de la Transition Écologique de l'ADEME.`}
    operatorLogo={config.brand.operator.enable ? config.brand.operator.logo : undefined}
    bottomItems={[
      {
        text: "CGU",
        linkProps: { href: "/cgu" },
      },
      <FooterPersonalDataPolicyItem key="FooterPersonalDataPolicyItem" />,
      {
        ...headerFooterDisplayItem,
        iconId: "fr-icon-theme-fill",
      },
      // <FooterConsentManagementItem key="FooterConsentManagementItem" />,
      {
        text: `Version ${config.appVersion}.${config.appVersionCommit.slice(0, 7)}`,
        linkProps: {
          href: `${config.repositoryUrl}/commit/${config.appVersionCommit}` as never,
        },
      },
    ]}
    termsLinkProps={{ href: "/mentions-legales" }}
    license={
      <>
        Sauf mention contraire, tous les contenus de ce site sont sous{" "}
        <a href={`${config.repositoryUrl}/main/LICENSE`} target="_blank" rel="noreferrer">
          licence Apache 2.0
        </a>
      </>
    }
  />
);
