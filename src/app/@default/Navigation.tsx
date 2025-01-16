"use client";

import { MainNavigation } from "@codegouvfr/react-dsfr/MainNavigation";
import { useSelectedLayoutSegment } from "next/navigation";

export const Navigation = () => {
  const segment = useSelectedLayoutSegment("default");

  // const { data: session, status } = useSession();

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
        // ...(status === "authenticated"
        //   ? ((): MainNavigationProps.Item[] => {
        //       switch (session.user.data.type) {
        //         case "Membre":
        //           return [
        //             {
        //               text: "Gérer vos CRA",
        //               isActive: segments.includes("cra") && segments.includes("declaration"),
        //               linkProps: {
        //                 href: "/cra/declaration",
        //               },
        //             },
        //           ];
        //         case "Intra":
        //           return [
        //             {
        //               text: "Suivre les CRA",
        //               isActive: segments.includes("cra") && segments.includes("validation"),
        //               linkProps: {
        //                 href: "/cra/validation",
        //               },
        //             },
        //             {
        //               text: "Demander un devis",
        //               isActive: segment === "cra",
        //               linkProps: {
        //                 href: "#",
        //                 onClick(evt) {
        //                   evt.preventDefault();
        //                   alert(`"Demander un devis" en construction 🚧`);
        //                 },
        //               },
        //             },
        //           ];
        //         case "Gestionnaire":
        //         default:
        //           return [];
        //       }
        //     })()
        //   : []),
      ]}
    />
  );
};
