import { Prisma } from "@prisma/client";
import { prisma, withDatabase } from "@/lib/db";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

export async function createAdminLog(data: {
  action: string;
  entityType?: string;
  entityId?: string;
  message?: string;
  metadata?: unknown;
}) {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data: row } = await supabase
        .from("admin_logs")
        .insert({
          action: data.action,
          entity_type: data.entityType,
          entity_id: data.entityId,
          message: data.message,
          metadata: data.metadata
        })
        .select("*")
        .single();
      return row;
    } catch (error) {
      console.error("[supabase admin log]", error);
      return null;
    }
  }

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
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("admin_logs").select("*").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id,
        action: row.action,
        entityType: row.entity_type,
        entityId: row.entity_id,
        message: row.message,
        metadata: row.metadata,
        createdAt: new Date(row.created_at)
      }));
    } catch (error) {
      console.error("[supabase admin logs]", error);
    }
  }

  return withDatabase(async () => prisma.adminLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 }), []);
}
