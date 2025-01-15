import Badge from "@codegouvfr/react-dsfr/Badge";
import Header, { type HeaderProps } from "@codegouvfr/react-dsfr/Header";

import { Brand } from "@/components/Brand";
import { config } from "@/config";

import { LoginLogoutHeaderItem, UserHeaderItem } from "./AuthHeaderItems";
import { Navigation } from "./Navigation";

export interface AuthHeaderProps {
  operatorLogo: HeaderProps["operatorLogo"];
}
export const AuthHeader = ({ operatorLogo }: AuthHeaderProps) => (
  <Header
    navigation={config.maintenance ? null : <Navigation />}
    brandTop={<Brand />}
    homeLinkProps={{
      href: "/",
      title: `Accueil - ${config.name}`,
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
    serviceTagline={config.tagline}
    operatorLogo={operatorLogo}
    classes={{
      operator: "shimmer",
    }}
    quickAccessItems={
      config.maintenance
        ? []
        : [<UserHeaderItem key="hqai-user" />, <LoginLogoutHeaderItem key="hqai-loginlogout" />].filter(Boolean)
    }
  />
);
