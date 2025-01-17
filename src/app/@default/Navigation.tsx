"use client";

import { MainNavigation, type MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useSelectedLayoutSegment } from "next/navigation";
import { useSession } from "next-auth/react";

export const Navigation = () => {
  const segment = useSelectedLayoutSegment("default");

  const { data: session, status } = useSession();

  return (
    <MainNavigation
      items={[
        {
          text: "Accueil",
          linkProps: {
            href: "/",
          },
          isActive: !segment,
        },
        {
          text: "Groupes",
          linkProps: {
            href: "/group",
          },
          isActive: segment === "group",
        },
        {
          text: "Templates",
          linkProps: {
            href: "/template",
          },
          isActive: segment === "template",
        },
        {
          text: "Startups",
          linkProps: {
            href: "/startup",
          },
          isActive: segment === "startup",
        },
        ...(((status === "authenticated" &&
          session.user.isAdmin && [
            {
              text: "Admin",
              linkProps: {
                href: "/admin",
              },
              isActive: segment === "admin",
            },
          ]) ||
          []) as MainNavigationProps["items"]),
      ]}
    />
  );
};
