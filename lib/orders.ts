import { prisma, withDatabase } from "@/lib/db";

export async function getOrders() {
  return withDatabase(async () => prisma.order.findMany({ orderBy: { createdAt: "desc" } }), []);
}

export async function getOrderById(id: string) {
  return withDatabase(async () => prisma.order.findUnique({ where: { id } }), null);
}
