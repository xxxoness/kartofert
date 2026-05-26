import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function withDatabase<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasDatabaseUrl) return fallback;

  try {
    return await operation();
  } catch (error) {
    console.error("[database]", error);
    return fallback;
  }
}
