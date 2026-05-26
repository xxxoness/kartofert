"use server";

import { Prisma } from "@prisma/client";
import { prisma, withDatabase } from "@/lib/db";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

export async function createCheckoutOrder(input: {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  comment?: string;
  items: unknown;
  subtotal?: number;
  total?: number;
  currency?: string;
}) {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("orders")
        .insert({
          order_number: input.orderNumber,
          customer_name: input.customerName,
          customer_email: input.customerEmail,
          customer_phone: input.customerPhone,
          customer_address: input.customerAddress,
          comment: input.comment,
          items: input.items,
          subtotal: input.subtotal,
          total: input.total,
          currency: input.currency ?? "BYN",
          status: "new",
          payment_status: "pending"
        })
        .select("*")
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("[supabase checkout order]", error);
      return null;
    }
  }

  return withDatabase(
    async () =>
      prisma.order.create({
        data: {
          orderNumber: input.orderNumber,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          customerAddress: input.customerAddress,
          comment: input.comment,
          items: input.items as Prisma.InputJsonValue,
          subtotal: input.subtotal,
          total: input.total,
          currency: input.currency ?? "BYN",
          status: "new",
          paymentStatus: "pending"
        }
      }),
    null
  );
}
