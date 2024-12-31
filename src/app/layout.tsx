import "./global.css";
import "react-loading-skeleton/dist/skeleton.css";

import { fr } from "@codegouvfr/react-dsfr";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { Header, type HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { DsfrHead } from "@codegouvfr/react-dsfr/next-appdir/DsfrHead";
import { DsfrProvider } from "@codegouvfr/react-dsfr/next-appdir/DsfrProvider";
import { getHtmlAttributes } from "@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type Metadata } from "next";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { type PropsWithChildren } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

import { Brand } from "@/components/Brand";
import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { config } from "@/config";
import { auth } from "@/lib/next-auth/auth";

import { FooterPersonalDataPolicyItem } from "../consentManagement";
import { defaultColorScheme } from "../defaultColorScheme";
import { StartDsfr } from "../StartDsfr";
import { LoginLogoutHeaderItem, UserHeaderItem } from "./AuthHeaderItems";
import { Navigation } from "./Navigation";
import styles from "./root.module.scss";
import { sharedMetadata } from "./shared-metadata";
import { SystemMessageDisplay } from "./SystemMessageDisplay";

const contentId = "content";
const footerId = "footer";

const operatorLogo: HeaderProps["operatorLogo"] = {
  imgUrl: "/img/ademe-incubateur-logo.png",
  alt: "Accélérateur de la Transition Écologique",
  orientation: "vertical",
};

export const metadata: Metadata = {
  metadataBase: new URL(config.host),
  ...sharedMetadata,
  title: {
    template: `${config.name} - %s`,
    default: config.name,
  },
  openGraph: {
    title: {
      template: `${config.name} - %s`,
      default: config.name,
    },
    ...sharedMetadata.openGraph,
  },
};

const lang = "fr";

const RootLayout = async ({ children }: PropsWithChildren) => {
  const session = await auth();
  return (
    <html lang={lang} {...getHtmlAttributes({ defaultColorScheme, lang })} className={cx(styles.app)}>
      <head>
        <StartDsfr />
        <DsfrHead
          Link={Link}
          preloadFonts={[
            "Marianne-Light",
            "Marianne-Light_Italic",
            "Marianne-Regular",
            "Marianne-Regular_Italic",
            "Marianne-Medium",
            "Marianne-Medium_Italic",
            "Marianne-Bold",
            "Marianne-Bold_Italic",
            //"Spectral-Regular",
            //"Spectral-ExtraBold"
          ]}
          doDisableFavicon
        />
      </head>
      <body>
        <SessionProvider refetchOnWindowFocus>
          <DsfrProvider lang={lang}>
            <SkeletonTheme
              baseColor={fr.colors.decisions.background.contrast.grey.default}
              highlightColor={fr.colors.decisions.background.contrast.grey.active}
              borderRadius={fr.spacing("1v")}
              duration={2}
            >
              {/* <ConsentBannerAndConsentManagement /> */}
              <SkipLinks
                links={[
                  {
                    anchor: `#${contentId}`,
                    label: "Contenu",
                  },
                  {
                    anchor: `#${footerId}`,
                    label: "Pied de page",
                  },
                ]}
              />
              <div className={styles.app} vaul-drawer-wrapper="true">
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
                      : [<UserHeaderItem key="hqai-user" />, <LoginLogoutHeaderItem key="hqai-loginlogout" />].filter(
                          Boolean,
                        )
                  }
                />
                <ClientAnimate as="main" id={contentId} className={styles.content}>
                  {config.env === "prod" ? (
                    <SystemMessageDisplay code="construction" noRedirect />
                  ) : config.maintenance ? (
                    <SystemMessageDisplay code="maintenance" noRedirect />
                  ) : (
                    children
                  )}
                </ClientAnimate>
                <Footer
                  id={footerId}
                  accessibility="non compliant"
                  accessibilityLinkProps={{ href: "/accessibilite" }}
                  contentDescription={`${config.name} est un service développé par l'accélérateur de la transition écologique de l'ADEME.`}
                  operatorLogo={operatorLogo}
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
              </div>
            </SkeletonTheme>
          </DsfrProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
