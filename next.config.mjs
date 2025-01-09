// @ts-check

import createMDX from "@next/mdx";
import MonacoEditorWebpackPlugin from "monaco-editor-webpack-plugin";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

import packageJson from "./package.json" with { type: "json" };

const { version } = packageJson;

const isDeployment = !!process.env.VERCEL_URL;

const env = {
  NEXT_TELEMETRY_DISABLED: "1",
  NEXT_PUBLIC_APP_VERSION: version,
  NEXT_PUBLIC_APP_VERSION_COMMIT: isDeployment ? process.env.VERCEL_GIT_COMMIT_SHA : "dev",
  NEXT_PUBLIC_REPOSITORY_URL: isDeployment
    ? `https://github.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : (process.env.NEXT_PUBLIC_APP_REPOSITORY_URL ?? "no repository"),
  NEXT_PUBLIC_SITE_URL: isDeployment
    ? (process.env.NEXT_PUBLIC_SITE_URL ?? `https://${process.env.VERCEL_BRANCH_URL}`)
    : "http://localhost:3000",
  NEXTAUTH_URL: `${
    isDeployment
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? `https://${process.env.VERCEL_BRANCH_URL}`)
      : "http://localhost:3000"
  }/api/auth`,
};

if (isDeployment) {
  console.log("==== Incoming environment variables ====", { process: process.env, env });
}

const csp = {
  "default-src": ["'none'"],
  "connect-src": [
    "'self'",
    "https://*.gouv.fr",
    process.env.APP_ENV === "preprod" && "https://vercel.live",
    process.env.NODE_ENV === "development" && "http://localhost",
  ],
  "font-src": ["'self'"],
  "media-src": ["'self'"],
  "img-src": ["'self'", "data:", "espace-membre.incubateur.net"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    process.env.NEXT_PUBLIC_MATOMO_URL,
    process.env.APP_ENV === "preprod" && "https://vercel.live",
    process.env.NODE_ENV === "development" && "'unsafe-eval' http://localhost",
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "object-src": ["'self'", "data:"],
  "frame-ancestors": ["'self'"],
  "base-uri": ["'self'", "https://*.gouv.fr"],
  "form-action": ["'self'", "https://*.gouv.fr"],
  "frame-src": [process.env.APP_ENV === "preprod" ? "https://vercel.live" : "'none'"],
  ...(process.env.NODE_ENV !== "development" && {
    "block-all-mixed-content": [],
    "upgrade-insecure-requests": [],
  }),
};

const ContentSecurityPolicy = Object.entries(csp)
  .map(([key, value]) => `${key} ${value.filter(Boolean).join(" ")};`)
  .join(" ");

/** @type {import('next').NextConfig} */
const config = {
  poweredByHeader: false,
  webpack: (/** @type {import("webpack").Configuration} */ config, options) => {
    config.module?.rules?.push({
      test: /\.(woff2|webmanifest|ttf)$/,
      type: "asset/resource",
    });

    if (!options.isServer) {
      config.plugins?.push(
        new MonacoEditorWebpackPlugin({
          languages: ["markdown", "mdx"],
          filename: "static/[name].worker.js",
        }),
      );
    }

    return config;
  },
  experimental: {
    serverMinification: true,
    authInterrupts: true,
  },
  serverExternalPackages: ["monaco-editor"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  env,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  rewrites: async () => [
    {
      source: "/startup/:startupId/:templateType.:ext(html|md|txt|pdf)",
      destination: "/startup/:startupId/:templateType/:ext",
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "espace-membre.incubateur.net",
        pathname: "/api/member/*/image",
        port: "",
        search: "",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer, strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "fullscreen=(), display-capture=(), camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkGfm, [remarkMdxFrontmatter, { name: "metadata" }]],
  },
});

export default withMDX(config);
