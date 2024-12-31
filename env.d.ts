// Auto-generated with "generateEnvDeclaration" script
/* eslint-disable */
declare namespace NodeJS {
    interface ProcessEnv {
        /**
         * Dist: `dev`  
         * {@link [Local Env Dist](.env.development)}
         */
        APP_ENV?: string;
        /**
         * Dist: `false`  
         * {@link [Local Env Dist](.env.development)}
         */
        MAINTENANCE_MODE?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        APP_SUPER_ADMIN?: string;
        /**
         * Dist: `development`  
         * {@link [Local Env Dist](.env.development)}
         */
        NODE_ENV?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        ESPACE_MEMBRE_API_KEY?: string;
        /**
         * Dist: `https://espace-membre.incubateur.net`  
         * {@link [Local Env Dist](.env.development)}
         */
        ESPACE_MEMBRE_URL?: string;
        /**
         * Dist: `false`  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_ENABLE?: string;
        /**
         * Dist: `127.0.0.1`  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_SMTP_HOST?: string;
        /**
         * Dist: `1025`  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_SMTP_PORT?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_SMTP_PASSWORD?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_SMTP_LOGIN?: string;
        /**
         * Dist: `false`  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_SMTP_SSL?: string;
        /**
         * Dist: `Bot Incubateur ADEME <bot@incubateur-ademe.beta.gouv.fr>`  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_FROM_EMAIL?: string;
        /**
         * Dist: `sikretfordevonly`  
         * {@link [Local Env Dist](.env.development)}
         */
        SECURITY_JWT_SECRET?: string;
        /**
         * Dist: `HS256`  
         * {@link [Local Env Dist](.env.development)}
         */
        SECURITY_JWT_ALGORITHM?: string;
        /**
         * Dist: `../local-site-templates-test`  
         * {@link [Local Env Dist](.env.development)}
         */
        TEMPLATES_GIT_URL?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        TEMPLATES_GIT_GPG_PRIVATE_KEY?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        TEMPLATES_GIT_GPG_PASSPHRASE?: string;
        /**
         * Dist: `bot@email.com`  
         * {@link [Local Env Dist](.env.development)}
         */
        TEMPLATES_GIT_AUTHOR_EMAIL?: string;
        /**
         * Dist: `Bot`  
         * {@link [Local Env Dist](.env.development)}
         */
        TEMPLATES_GIT_AUTHOR_NAME?: string;
        /**
         * Dist: `bot@email.com`  
         * {@link [Local Env Dist](.env.development)}
         */
        TEMPLATES_GIT_COMMITTER_EMAIL?: string;
        /**
         * Dist: `Bot`  
         * {@link [Local Env Dist](.env.development)}
         */
        TEMPLATES_GIT_COMMITTER_NAME?: string;
        /**
         * Dist: `./templates_tmp`  
         * {@link [Local Env Dist](.env.development)}
         */
        TEMPLATES_TMPDIR?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        TEMPLATES_GITHUB_TOKEN?: string;
        /**
         * Dist: `legal-site`  
         * {@link [Local Env Dist](.env.development)}
         */
        REDIS_BASE?: string;
        /**
         * Dist: `localhost`  
         * {@link [Local Env Dist](.env.development)}
         */
        REDIS_HOST?: string;
        /**
         * Dist: `6379`  
         * {@link [Local Env Dist](.env.development)}
         */
        REDIS_PORT?: string;
        /**
         * Dist: `false`  
         * {@link [Local Env Dist](.env.development)}
         */
        REDIS_TLS?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        REDIS_PASSWORD?: string;
        /**
         * Dist: `1`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_MATOMO_SITE_ID?: string;
        /**
         * Dist: `http://localhost`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_MATOMO_URL?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_APP_VERSION?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_APP_VERSION_COMMIT?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_REPOSITORY_URL?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_SITE_URL?: string;
    }
}
declare type ProcessEnvCustomKeys = 
    | 'APP_ENV'
    | 'MAINTENANCE_MODE'
    | 'APP_SUPER_ADMIN'
    | 'NODE_ENV'
    | 'ESPACE_MEMBRE_API_KEY'
    | 'ESPACE_MEMBRE_URL'
    | 'MAILER_ENABLE'
    | 'MAILER_SMTP_HOST'
    | 'MAILER_SMTP_PORT'
    | 'MAILER_SMTP_PASSWORD'
    | 'MAILER_SMTP_LOGIN'
    | 'MAILER_SMTP_SSL'
    | 'MAILER_FROM_EMAIL'
    | 'SECURITY_JWT_SECRET'
    | 'SECURITY_JWT_ALGORITHM'
    | 'TEMPLATES_GIT_URL'
    | 'TEMPLATES_GIT_GPG_PRIVATE_KEY'
    | 'TEMPLATES_GIT_GPG_PASSPHRASE'
    | 'TEMPLATES_GIT_AUTHOR_EMAIL'
    | 'TEMPLATES_GIT_AUTHOR_NAME'
    | 'TEMPLATES_GIT_COMMITTER_EMAIL'
    | 'TEMPLATES_GIT_COMMITTER_NAME'
    | 'TEMPLATES_TMPDIR'
    | 'TEMPLATES_GITHUB_TOKEN'
    | 'REDIS_BASE'
    | 'REDIS_HOST'
    | 'REDIS_PORT'
    | 'REDIS_TLS'
    | 'REDIS_PASSWORD'
    | 'NEXT_PUBLIC_MATOMO_SITE_ID'
    | 'NEXT_PUBLIC_MATOMO_URL'
    | 'NEXT_PUBLIC_APP_VERSION'
    | 'NEXT_PUBLIC_APP_VERSION_COMMIT'
    | 'NEXT_PUBLIC_REPOSITORY_URL'
    | 'NEXT_PUBLIC_SITE_URL';