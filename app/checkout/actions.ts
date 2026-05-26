"use server";

import { Prisma } from "@prisma/client";
import { prisma, withDatabase } from "@/lib/db";

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
