import { type MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  // private site, no need to index
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
};

export default robots;
