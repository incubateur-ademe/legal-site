import { ensureApiEnvVar, ensureNextEnvVar } from "@/utils/os";
import { isTruthy } from "@/utils/string";

export const config = {
  env: ensureApiEnvVar<"dev" | "prod" | "review" | "staging">(process.env.APP_ENV, "dev"),
  _seeding: ensureApiEnvVar(process.env._SEEDING, isTruthy, false),
  maintenance: ensureApiEnvVar(process.env.MAINTENANCE_MODE, isTruthy, false),
  host: ensureNextEnvVar(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  appVersion: ensureNextEnvVar(process.env.NEXT_PUBLIC_APP_VERSION, "dev"),
  appVersionCommit: ensureNextEnvVar(process.env.NEXT_PUBLIC_APP_VERSION_COMMIT, "unknown"),
  repositoryUrl: ensureNextEnvVar(
    process.env.NEXT_PUBLIC_REPOSITORY_URL,
    "https://github.com/incubateur-ademe/pages-legales-faciles",
  ),
  matomo: {
    url: ensureNextEnvVar(process.env.NEXT_PUBLIC_MATOMO_URL, ""),
    siteId: ensureNextEnvVar(process.env.NEXT_PUBLIC_MATOMO_SITE_ID, ""),
  },
  brand: {
    name: ensureNextEnvVar(process.env.NEXT_PUBLIC_BRAND_NAME, "Pages Légales Faciles"),
    tagline: ensureNextEnvVar(process.env.NEXT_PUBLIC_BRAND_TAGLINE, "Créez vos pages légales en quelques clics"),
    ministry: ensureNextEnvVar(process.env.NEXT_PUBLIC_BRAND_MINISTRY, "République\nFrançaise"),
    operator: {
      enable: ensureNextEnvVar(process.env.NEXT_PUBLIC_BRAND_OPERATOR_ENABLE, isTruthy, false),
      logo: {
        imgUrl: ensureNextEnvVar(process.env.NEXT_PUBLIC_BRAND_OPERATOR_LOGO_URL, "/img/ademe-incubateur-logo.png"),
        alt: ensureNextEnvVar(
          process.env.NEXT_PUBLIC_BRAND_OPERATOR_LOGO_ALT,
          "Accélérateur de la Transition Écologique",
        ),
        orientation: ensureNextEnvVar<"horizontal" | "vertical">(
          process.env.NEXT_PUBLIC_BRAND_OPERATOR_LOGO_ORIENTATION,
          "vertical",
        ),
      },
    },
  },
  mailer: {
    host: ensureApiEnvVar(process.env.MAILER_SMTP_HOST, "127.0.0.1"),
    smtp: {
      port: ensureApiEnvVar(process.env.MAILER_SMTP_PORT, Number, 1025),
      password: ensureApiEnvVar(process.env.MAILER_SMTP_PASSWORD, ""),
      login: ensureApiEnvVar(process.env.MAILER_SMTP_LOGIN, ""),
      ssl: ensureApiEnvVar(process.env.MAILER_SMTP_SSL, isTruthy, false),
    },
    // TODO: change
    from: ensureApiEnvVar(process.env.MAILER_FROM_EMAIL, "Pages Légales Faciles <noreply@legal.beta.gouv.fr>"),
  },
  security: {
    auth: {
      secret: ensureApiEnvVar(process.env.SECURITY_JWT_SECRET, "secret"),
    },
    webhook: {
      secret: ensureApiEnvVar(process.env.SECURITY_WEBHOOK_SECRET, "secret"),
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
      gpgEnabled: !!process.env.TEMPLATES_GIT_GPG_PRIVATE_KEY_BASE64 && process.env.TEMPLATES_GIT_GPG_PUBLIC_KEY_BASE64,
      url: ensureApiEnvVar(
        process.env.TEMPLATES_GIT_URL,
        "https://github.com/incubateur-ademe/legal-site-templates-test",
      ),
      committer: {
        email: ensureApiEnvVar(process.env.TEMPLATES_GIT_COMMITTER_EMAIL, "bot@email.com"),
        name: ensureApiEnvVar(process.env.TEMPLATES_GIT_COMMITTER_NAME, "Bot"),
      },
      mainBranch: ensureApiEnvVar(process.env.TEMPLATES_GIT_MAIN_BRANCH, "main"),
      provider: ensureApiEnvVar<"github" | "gitlab" | "local">(process.env.TEMPLATES_GIT_PROVIDER, "github"),
      providerUser: ensureApiEnvVar(process.env.TEMPLATES_GIT_PROVIDER_USER, ""),
      providerToken: ensureApiEnvVar(process.env.TEMPLATES_GIT_PROVIDER_TOKEN, ""),
    },
    tmpdir: ensureApiEnvVar(process.env.TEMPLATES_TMPDIR, "./templates_tmp"),
  },
  redis: {
    url: ensureApiEnvVar(process.env.REDIS_URL, ""),
    base: ensureApiEnvVar(process.env.REDIS_BASE, "pages-legales-faciles"),
    host: ensureApiEnvVar(process.env.REDIS_HOST, "localhost"),
    port: ensureApiEnvVar(process.env.REDIS_PORT, Number, 6379),
    tls: ensureApiEnvVar(process.env.REDIS_TLS, isTruthy, false),
    password: ensureApiEnvVar(process.env.REDIS_PASSWORD, ""),
  },
} as const;
