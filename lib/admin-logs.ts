import { Prisma } from "@prisma/client";
import { prisma, withDatabase } from "@/lib/db";

export async function createAdminLog(data: {
  action: string;
  entityType?: string;
  entityId?: string;
  message?: string;
  metadata?: unknown;
}) {
  return withDatabase(
    async () =>
      prisma.adminLog.create({
        data: {
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          message: data.message,
          metadata: data.metadata as Prisma.InputJsonValue
        }
      }),
    null
  );
}

export async function getAdminLogs() {
  return withDatabase(async () => prisma.adminLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 }), []);
}
