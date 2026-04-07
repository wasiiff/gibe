import "server-only";

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

import { PrismaClient } from "@/lib/generated/prisma";
import { serverEnv } from "@/lib/env";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

neonConfig.webSocketConstructor = ws;

const connectionString =
  serverEnv.databaseUrl ??
  "postgresql://user:password@localhost:5432/gibe?schema=public";
const adapter = new PrismaNeon({
  connectionString,
});

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
