import Badge from "@codegouvfr/react-dsfr/Badge";
import Header, { type HeaderProps } from "@codegouvfr/react-dsfr/Header";

import { Brand } from "@/components/Brand";
import { config } from "@/config";

export interface PublicHeaderProps {
  operatorLogo: HeaderProps["operatorLogo"];
}

export const PublicHeader = ({ operatorLogo }: PublicHeaderProps) => (
  <Header
    brandTop={<Brand />}
    homeLinkProps={{
      href: "#",
      title: ``,
    }}
    serviceTitle={
      <>
        {config.name}
        &nbsp;
        <Badge as="span" noIcon severity="success">
          Beta
        </Badge>
        {config.maintenance && (
          <Badge as="span" noIcon severity="warning">
            Maintenance
          </Badge>
        )}
      </>
    }
    operatorLogo={operatorLogo}
    classes={{
      operator: "shimmer",
    }}
  />
);
