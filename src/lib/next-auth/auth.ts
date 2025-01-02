import { UnstorageAdapter } from "@auth/unstorage-adapter";
import { EspaceMembreProvider } from "@incubateur-ademe/next-auth-espace-membre-provider";
import NextAuth from "next-auth";
import { type Adapter, type AdapterUser } from "next-auth/adapters";
import Nodemailer from "next-auth/providers/nodemailer";
import { type ConnectionOptions } from "tls";
import { createStorage } from "unstorage";
import unstorageRedisDriver from "unstorage/drivers/redis";

import { config } from "@/config";

const redis = createStorage({
  driver: unstorageRedisDriver({
    base: config.api.redis.base,
    host: config.api.redis.host,
    port: config.api.redis.port,
    tls: config.api.redis.tls as unknown as ConnectionOptions, // https://unstorage.unjs.io/drivers/redis
    password: config.api.redis.password,
  }),
});

declare module "next-auth" {
  interface Session {
    user: AdapterUser & { isAdmin?: boolean };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    user: AdapterUser & { isAdmin?: boolean };
  }
}

const espaceMembreProvider = EspaceMembreProvider({
  fetch,
  fetchOptions: {
    next: {
      revalidate: 300, // 5 minutes
    },
    cache: "default",
  },
});

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth({
  secret: config.api.security.auth.secret,
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login/error",
    verifyRequest: "/login/verify-request",
  },
  session: {
    strategy: "jwt",
  },
  adapter: espaceMembreProvider.AdapterWrapper(UnstorageAdapter(redis) as Adapter),
  // experimental: {
  //   enableWebAuthn: true,
  // },
  providers: [
    espaceMembreProvider.ProviderWrapper(
      Nodemailer({
        server: {
          host: config.api.mailer.host,
          port: config.api.mailer.smtp.port,
          auth: {
            user: config.api.mailer.smtp.login,
            pass: config.api.mailer.smtp.password,
          },
        },
        from: config.api.mailer.from,
      }),
    ),
    // TODO
    // WebAuthn,
    // Passkey({
    //   registrationOptions: {},
    // }),
  ],
  callbacks: espaceMembreProvider.CallbacksWrapper({
    jwt({ token, trigger, espaceMembreMember }) {
      if (trigger !== "update" && espaceMembreMember) {
        token = {
          ...token,
          user: {
            id: token.sub || espaceMembreMember.username,
            email: espaceMembreMember.primary_email,
            name: espaceMembreMember.fullname,
            emailVerified: new Date(),
            username: espaceMembreMember.username,
            image: espaceMembreMember.avatar,
            isAdmin: config.api.templates.admins.includes(espaceMembreMember.username),
          },
        };
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user;
      return session;
    },
  }),
});
