import { prisma, withDatabase } from "@/lib/db";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

export async function getOrders() {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id,
        orderNumber: row.order_number ?? row.orderNumber,
        customerName: row.customer_name ?? row.customerName,
        customerEmail: row.customer_email ?? row.customerEmail,
        customerPhone: row.customer_phone ?? row.customerPhone,
        customerAddress: row.customer_address ?? row.customerAddress,
        comment: row.comment,
        items: row.items,
        subtotal: row.subtotal,
        total: row.total,
        currency: row.currency ?? "BYN",
        status: row.status,
        paymentStatus: row.payment_status ?? row.paymentStatus,
        createdAt: new Date(row.created_at ?? row.createdAt),
        updatedAt: new Date(row.updated_at ?? row.updatedAt)
      }));
    } catch (error) {
      console.error("[supabase orders]", error);
    }
  }

  return withDatabase(async () => prisma.order.findMany({ orderBy: { createdAt: "desc" } }), []);
}

export async function getOrderById(id: string) {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("[supabase order]", error);
    }
  }

  return withDatabase(async () => prisma.order.findUnique({ where: { id } }), null);
}
