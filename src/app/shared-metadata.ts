import { type Metadata } from "next";

import { config } from "@/config";

const description = config.brand.tagline;

export const sharedMetadata: Metadata = {
  description,
  openGraph: {
    description,
    type: "website",
    locale: "fr_FR",
    countryName: "France",
    siteName: config.brand.name,
    images: [
      {
        url: new URL(`/img/ademe-incubateur-logo.png`, config.host),
        alt: config.brand.name,
      },
    ],
  },
};
