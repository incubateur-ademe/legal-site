const isDeployment = !!process.env.SOURCE_VERSION;

const priorities = {
  "/": 1.0,
  "/stats": 0.5,
  "/healthz": 0,
};

/** @type {import('next-sitemap').IConfig} */
const config = {
  generateRobotsTxt: false,
  siteUrl: isDeployment ? `https://${process.env.NEXT_PUBLIC_SITE_URL}` : "http://localhost:3000",
  changefreq: "weekly",
  transform: async (config, path) => {
    return {
      loc: path,
      priority: priorities[path] ?? config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
      changefreq: config.changefreq,
    };
  },
};

module.exports = config;
