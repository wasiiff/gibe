import "server-only";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";
import { hasGoogleAuthConfig, serverEnv } from "@/lib/env";

export const auth = betterAuth({
  appName: "Gibe",
  baseURL: serverEnv.authUrl ?? "http://localhost:3000",
  secret:
    serverEnv.authSecret ?? "gibe-local-dev-secret-change-me-1234567890",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  socialProviders: hasGoogleAuthConfig()
    ? {
        google: {
          clientId: serverEnv.googleClientId!,
          clientSecret: serverEnv.googleClientSecret!,
          accessType: "offline",
          prompt: "select_account consent",
        },
      }
    : undefined,
  plugins: [nextCookies()],
});
