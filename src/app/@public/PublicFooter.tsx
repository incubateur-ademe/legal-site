import Footer, { type FooterProps } from "@codegouvfr/react-dsfr/Footer";

import { config } from "@/config";

export interface PublicFooterProps {
  id: FooterProps["id"];
}

export const PublicFooter = ({ id }: PublicFooterProps) => (
  <Footer
    id={id}
    accessibility="non compliant"
    operatorLogo={config.brand.operator.enable ? config.brand.operator.logo : undefined}
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
