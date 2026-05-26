"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminLog } from "@/lib/admin-logs";
import { hasDatabaseUrl, prisma } from "@/lib/db";

function ensureDb() {
  if (!hasDatabaseUrl) {
    throw new Error("DATABASE_URL не задан. Сохранение будет доступно после подключения PostgreSQL.");
  }
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? value : null;
}

function numberOrNull(formData: FormData, key: string) {
  const value = text(formData, key).replace(",", ".");
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function jsonValue(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return Prisma.JsonNull;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function productPayload(formData: FormData) {
  const priceMode = text(formData, "priceMode") || "request";
  const price = priceMode === "request" ? null : numberOrNull(formData, "price");

  return {
    title: text(formData, "title"),
    shortTitle: nullableText(formData, "shortTitle"),
    slug: text(formData, "slug"),
    description: text(formData, "description"),
    shortDescription: nullableText(formData, "shortDescription"),
    category: text(formData, "category"),
    type: nullableText(formData, "type"),
    stage: nullableText(formData, "stage"),
    task: nullableText(formData, "task"),
    nutrients: jsonValue(formData, "nutrients"),
    composition: jsonValue(formData, "composition"),
    specs: jsonValue(formData, "specs"),
    instructions: jsonValue(formData, "instructions"),
    image: nullableText(formData, "image"),
    images: jsonValue(formData, "images"),
    packageWeightKg: numberOrNull(formData, "packageWeightKg") ?? 25,
    price,
    currency: text(formData, "currency") || "BYN",
    priceMode,
    stockStatus: text(formData, "stockStatus") || "in_stock",
    stockQty: numberOrNull(formData, "stockQty"),
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: numberOrNull(formData, "sortOrder") ?? 0,
    seoTitle: nullableText(formData, "seoTitle"),
    seoDescription: nullableText(formData, "seoDescription")
  };
}

export async function createProductAction(formData: FormData) {
  const admin = await requireAdmin();
  ensureDb();

  const product = await prisma.product.create({ data: productPayload(formData) });
  await createAdminLog({
    action: "product.create",
    entityType: "product",
    entityId: product.id,
    message: `${admin.email} создал товар ${product.title}`
  });

  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(id: string, formData: FormData) {
  const admin = await requireAdmin();
  ensureDb();

  const previous = await prisma.product.findUnique({ where: { id } });
  const product = await prisma.product.update({ where: { id }, data: productPayload(formData) });
  await createAdminLog({
    action: previous?.price?.toString() !== product.price?.toString() ? "product.price_update" : "product.update",
    entityType: "product",
    entityId: product.id,
    message: `${admin.email} изменил товар ${product.title}`,
    metadata: { previousSlug: previous?.slug, newSlug: product.slug }
  });

  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  if (previous?.slug && previous.slug !== product.slug) revalidatePath(`/products/${previous.slug}`);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function toggleProductPublishedAction(id: string) {
  const admin = await requireAdmin();
  ensureDb();

  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  const next = await prisma.product.update({ where: { id }, data: { isPublished: !product.isPublished } });
  await createAdminLog({
    action: next.isPublished ? "product.publish" : "product.unpublish",
    entityType: "product",
    entityId: id,
    message: `${admin.email} ${next.isPublished ? "опубликовал" : "скрыл"} товар ${next.title}`
  });

  revalidatePath("/products");
  revalidatePath(`/products/${next.slug}`);
  revalidatePath("/admin/products");
}

function articlePayload(formData: FormData) {
  const status = text(formData, "status") || "draft";

  return {
    title: text(formData, "title"),
    slug: text(formData, "slug"),
    excerpt: text(formData, "excerpt"),
    content: text(formData, "content"),
    category: text(formData, "category"),
    coverImage: nullableText(formData, "coverImage"),
    readTime: nullableText(formData, "readTime"),
    publishedAt: status === "published" ? new Date() : null,
    status,
    isFeatured: formData.get("isFeatured") === "on",
    seoTitle: nullableText(formData, "seoTitle"),
    seoDescription: nullableText(formData, "seoDescription")
  };
}

export async function createArticleAction(formData: FormData) {
  const admin = await requireAdmin();
  ensureDb();

  const article = await prisma.article.create({ data: articlePayload(formData) });
  await createAdminLog({
    action: "article.create",
    entityType: "article",
    entityId: article.id,
    message: `${admin.email} создал статью ${article.title}`
  });

  revalidatePath("/knowledge");
  revalidatePath(`/knowledge/${article.slug}`);
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateArticleAction(id: string, formData: FormData) {
  const admin = await requireAdmin();
  ensureDb();

  const previous = await prisma.article.findUnique({ where: { id } });
  const article = await prisma.article.update({ where: { id }, data: articlePayload(formData) });
  await createAdminLog({
    action: "article.update",
    entityType: "article",
    entityId: article.id,
    message: `${admin.email} изменил статью ${article.title}`,
    metadata: { previousSlug: previous?.slug, newSlug: article.slug, status: article.status }
  });

  revalidatePath("/knowledge");
  revalidatePath(`/knowledge/${article.slug}`);
  if (previous?.slug && previous.slug !== article.slug) revalidatePath(`/knowledge/${previous.slug}`);
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateSettingsAction(formData: FormData) {
  const admin = await requireAdmin();
  ensureDb();

  const value = {
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    city: text(formData, "city"),
    footerText: text(formData, "footerText"),
    currency: text(formData, "currency") || "BYN",
    showPrices: formData.get("showPrices") === "on",
    enableOnlinePayment: formData.get("enableOnlinePayment") === "on",
    mainCtaText: text(formData, "mainCtaText"),
    deliveryText: text(formData, "deliveryText")
  };

  await prisma.siteSettings.upsert({
    where: { key: "site" },
    create: { key: "site", value },
    update: { value }
  });
  await createAdminLog({
    action: "settings.update",
    entityType: "settings",
    entityId: "site",
    message: `${admin.email} изменил настройки сайта`
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function updateOrderStatusAction(id: string, formData: FormData) {
  const admin = await requireAdmin();
  ensureDb();

  const status = text(formData, "status");
  const order = await prisma.order.update({ where: { id }, data: { status } });
  await createAdminLog({
    action: "order.status_update",
    entityType: "order",
    entityId: id,
    message: `${admin.email} изменил статус заказа ${order.orderNumber} на ${status}`
  });

  revalidatePath("/admin/orders");
}
