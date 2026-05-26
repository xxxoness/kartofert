import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
export const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

export function getDatabaseStatus() {
  if (!hasDatabaseUrl && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      connected: false,
      message:
        "База данных не подключена. Добавьте Supabase env или DATABASE_URL в переменные окружения, затем выполните миграцию и seed."
    };
  }

  return {
    connected: true,
    message: hasSupabaseConfig
      ? "База данных подключена, Supabase env заполнены."
      : "DATABASE_URL задан. Supabase URL/keys можно добавить для следующих этапов интеграции."
  };
}
