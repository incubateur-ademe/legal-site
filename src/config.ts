import { ensureApiEnvVar, ensureNextEnvVar } from "@/utils/os";
import { isTruthy } from "@/utils/string";

export const config = {
  maintenance: ensureApiEnvVar(process.env.MAINTENANCE_MODE, isTruthy, false),
  /** First year of recorded activity */
  firstDate: new Date(2025, 0, 1),
  host: ensureNextEnvVar(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  name: "Legal.BetaGouv",
  tagline: "Gestion des pages légales des services BetaGouv",
  env: ensureApiEnvVar<"dev" | "prod" | "staging">(process.env.APP_ENV, "dev"),
  matomo: {
    url: ensureNextEnvVar(process.env.NEXT_PUBLIC_MATOMO_URL, ""),
    siteId: ensureNextEnvVar(process.env.NEXT_PUBLIC_MATOMO_SITE_ID, ""),
  },
  appVersion: ensureNextEnvVar(process.env.NEXT_PUBLIC_APP_VERSION, "dev"),
  appVersionCommit: ensureNextEnvVar(process.env.NEXT_PUBLIC_APP_VERSION_COMMIT, "<unknown>"),
  repositoryUrl: ensureNextEnvVar(
    process.env.NEXT_PUBLIC_REPOSITORY_URL,
    "https://github.com/incubateur-ademe/legal-site",
  ),
  api: {
    mailer: {
      host: ensureApiEnvVar(process.env.MAILER_SMTP_HOST, "127.0.0.1"),
      smtp: {
        port: ensureApiEnvVar(process.env.MAILER_SMTP_PORT, Number, 1025),
        password: ensureApiEnvVar(process.env.MAILER_SMTP_PASSWORD, ""),
        login: ensureApiEnvVar(process.env.MAILER_SMTP_LOGIN, ""),
        ssl: ensureApiEnvVar(process.env.MAILER_SMTP_SSL, isTruthy, false),
      },
      // TODO: change
      from: ensureApiEnvVar(process.env.MAILER_FROM_EMAIL, "Bot Incubateur ADEME <bot@incubateur.ademe.fr>"),
    },
    security: {
      auth: {
        secret: ensureApiEnvVar(process.env.SECURITY_JWT_SECRET, "secret"),
      },
    },
    espaceMembre: {
      apiKey: ensureApiEnvVar(process.env.ESPACE_MEMBRE_API_KEY, ""),
      url: ensureApiEnvVar(process.env.ESPACE_MEMBRE_URL, "https://espace-membre.incubateur.net"),
    },
    templates: {
      admins: ensureApiEnvVar(
        process.env.TEMPLATES_ADMINS,
        v =>
          v
            .trim()
            .split(",")
            .map(a => a.trim())
            .filter(Boolean),
        [
          "lilian.sagetlethias",
          "julien.bouqillon",
          "lucas.charrier",
          "alexandre.le.borgne",
          "wissem.bellili",
          "osiris.moukoko",
        ],
      ),
      git: {
        url: ensureApiEnvVar(
          process.env.TEMPLATES_GIT_URL,
          "https://github.com/incubateur-ademe/legal-site-templates-test",
        ),
        gpg_private_key: ensureApiEnvVar(process.env.TEMPLATES_GIT_GPG_PRIVATE_KEY, ""),
        gpg_passphrase: ensureApiEnvVar(process.env.TEMPLATES_GIT_GPG_PASSPHRASE, ""),
        author: {
          email: ensureApiEnvVar(process.env.TEMPLATES_GIT_AUTHOR_EMAIL, "bot@email.com"),
          name: ensureApiEnvVar(process.env.TEMPLATES_GIT_AUTHOR_NAME, "Bot"),
        },
        committer: {
          email: ensureApiEnvVar(process.env.TEMPLATES_GIT_COMMITTER_EMAIL, "bot@email.com"),
          name: ensureApiEnvVar(process.env.TEMPLATES_GIT_COMMITTER_NAME, "Bot"),
        },
      },
      tmpdir: ensureApiEnvVar(process.env.TEMPLATES_TMPDIR, "./templates_tmp"),
    },
    github: {
      token: ensureApiEnvVar(process.env.TEMPLATES_GITHUB_TOKEN, ""),
    },
  },
} as const;
