const isDeployment = !!process.env.VERCEL_URL;

const priorities = {
  "/": 1.0,
  "/stats": 0.5,
  "/healthz": 0,
};

/** @type {import('next-sitemap').IConfig} */
const config = {
  generateRobotsTxt: false,
  siteUrl: isDeployment ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
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
