"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { HeaderQuickAccessItem } from "@codegouvfr/react-dsfr/Header";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Skeleton from "react-loading-skeleton";

import { InitialsAvatar } from "@/components/img/InitialsAvatar";
import { config } from "@/config";

export const UserHeaderItem = () => {
  const session = useSession();

  switch (session.status) {
    case "authenticated":
      return (
        <>
          {session.data.user.image ? (
            <Image
              src={new URL(session.data.user.image, config.api.espaceMembre.url).toString()}
              alt="Avatar"
              width={40}
              height={40}
            />
          ) : (
            <InitialsAvatar name={session.data.user.name || "Anon User"} />
          )}
          <HeaderQuickAccessItem
            key="hqai-authenticated-user"
            quickAccessItem={{
              iconId: session.data.user.isAdmin ? "fr-icon-admin-fill" : "fr-icon-account-fill",
              text: `${session.data.user.name}`,
              buttonProps: {
                onClick(e) {
                  e.preventDefault();
                },
              },
            }}
          />
        </>
      );
    case "loading":
      return (
        <HeaderQuickAccessItem
          key="hqai-authloading-fake-user"
          quickAccessItem={{
            iconId: "fr-icon-account-fill",
            text: <Skeleton width={200} highlightColor="var(--text-action-high-blue-france)" />,
            buttonProps: {
              onClick(e) {
                e.preventDefault();
              },
            },
          }}
        />
      );
    default:
      return null;
  }
};

export const LoginLogoutHeaderItem = () => {
  const session = useSession();

  switch (session.status) {
    case "authenticated":
      return (
        <HeaderQuickAccessItem
          key="hqai-authenticated-logout"
          quickAccessItem={{
            iconId: "fr-icon-lock-unlock-line",
            buttonProps: {
              className: fr.cx("fr-btn--secondary"),
              onClick(e) {
                e.preventDefault();
                void signOut({ callbackUrl: "/" });
              },
            },
            text: "Se déconnecter",
          }}
        />
      );

    default: // loading
      return (
        <HeaderQuickAccessItem
          key="hqai-unauthenticated-login"
          quickAccessItem={{
            iconId: "fr-icon-lock-line",
            linkProps: {
              href: "/login",
              className: fr.cx("fr-btn--secondary"),
            },
            text: "Se connecter",
          }}
        />
      );
  }
};
