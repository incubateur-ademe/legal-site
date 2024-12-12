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
    | 'NEXT_PUBLIC_MATOMO_SITE_ID'
    | 'NEXT_PUBLIC_MATOMO_URL'
    | 'NEXT_PUBLIC_APP_VERSION'
    | 'NEXT_PUBLIC_APP_VERSION_COMMIT'
    | 'NEXT_PUBLIC_REPOSITORY_URL'
    | 'NEXT_PUBLIC_SITE_URL';