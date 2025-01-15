import "./globals.scss";
import "react-loading-skeleton/dist/skeleton.css";

import { fr } from "@codegouvfr/react-dsfr";
import { type HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { DsfrHead } from "@codegouvfr/react-dsfr/next-appdir/DsfrHead";
import { DsfrProvider } from "@codegouvfr/react-dsfr/next-appdir/DsfrProvider";
import { getHtmlAttributes } from "@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type Metadata } from "next";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { type PropsWithChildren, type ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { ClientOnly } from "@/components/utils/ClientOnly";
import { config } from "@/config";

import { defaultColorScheme } from "../defaultColorScheme";
import { StartDsfr } from "../StartDsfr";
import { AuthFooter } from "./@default/AuthFooter";
import { AuthHeader } from "./@default/AuthHeader";
import { PublicFooter } from "./@public/PublicFooter";
import { PublicHeader } from "./@public/PublicHeader";
import { PublicSlotFilter } from "./PublicSlotFilter";
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

interface RootLayoutSlots {
  default: ReactNode;
  public: ReactNode;
}

const RootLayout = ({ children, default: defaultSlot, public: publicSlot }: PropsWithChildren<RootLayoutSlots>) => {
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
              <div className={styles.app}>
                <PublicSlotFilter
                  defaultChildren={<AuthHeader operatorLogo={operatorLogo} />}
                  publicChildren={<PublicHeader operatorLogo={operatorLogo} />}
                />
                <ClientAnimate as="main" id={contentId} className={styles.content}>
                  {config.env === "prod" ? (
                    <SystemMessageDisplay code="construction" noRedirect />
                  ) : config.maintenance ? (
                    <SystemMessageDisplay code="maintenance" noRedirect />
                  ) : defaultSlot || publicSlot ? (
                    <PublicSlotFilter defaultChildren={defaultSlot} publicChildren={publicSlot} />
                  ) : (
                    <ClientOnly>{children}</ClientOnly>
                  )}
                </ClientAnimate>
                <PublicSlotFilter
                  defaultChildren={<AuthFooter id={footerId} operatorLogo={operatorLogo} />}
                  publicChildren={<PublicFooter id={footerId} operatorLogo={operatorLogo} />}
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
