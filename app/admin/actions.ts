"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminLog } from "@/lib/admin-logs";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

function ensureStorage() {
  if (!hasSupabaseAdminEnv && !hasDatabaseUrl) {
    throw new Error("База данных не подключена. Добавьте Supabase env или DATABASE_URL.");
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

function arrayFromText(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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

function productPayloadSupabase(formData: FormData) {
  const payload = productPayload(formData);
  const customPriceLabel = nullableText(formData, "priceLabel");
  const priceLabel = customPriceLabel ?? (payload.price == null ? "Цена уточняется" : `${payload.price} ${payload.currency}`);

  return {
    title: payload.title,
    slug: payload.slug,
    short_description: payload.shortDescription,
    description: payload.description,
    category: payload.category,
    nutrients: Array.isArray(payload.nutrients) ? payload.nutrients : arrayFromText(text(formData, "nutrients")),
    growing_stages: arrayFromText(payload.stage),
    price: payload.price,
    price_label: priceLabel,
    price_mode: payload.priceMode,
    currency: payload.currency,
    package_weight: `${payload.packageWeightKg} кг`,
    image_url: payload.image,
    images: payload.images === Prisma.JsonNull ? [] : payload.images,
    is_published: payload.isPublished,
    in_stock: payload.stockStatus !== "out_of_stock",
    sort_order: payload.sortOrder,
    updated_at: new Date().toISOString()
  };
}

export async function createProductAction(formData: FormData) {
  const admin = await requireAdmin();
  ensureStorage();

  if (hasSupabaseAdminEnv) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("products").insert(productPayloadSupabase(formData)).select("*").single();
    if (error) throw new Error(error.message);

    await createAdminLog({
      action: "product.create",
      entityType: "product",
      entityId: data.id,
      message: `${admin.email} создал товар ${data.title}`
    });
    revalidateProductPaths(data.slug);
    redirect("/admin/products");
  }

  const product = await prisma.product.create({ data: productPayload(formData) });
  await createAdminLog({
    action: "product.create",
    entityType: "product",
    entityId: product.id,
    message: `${admin.email} создал товар ${product.title}`
  });
  revalidateProductPaths(product.slug);
  redirect("/admin/products");
}

export async function updateProductAction(id: string, formData: FormData) {
  const admin = await requireAdmin();
  ensureStorage();

  if (hasSupabaseAdminEnv) {
    const supabase = createSupabaseAdminClient();
    const { data: previous } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    const { data, error } = await supabase.from("products").update(productPayloadSupabase(formData)).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);

    await createAdminLog({
      action: previous?.price !== data.price ? "product.price_update" : "product.update",
      entityType: "product",
      entityId: data.id,
      message: `${admin.email} изменил товар ${data.title}`,
      metadata: { previousSlug: previous?.slug, newSlug: data.slug }
    });
    revalidateProductPaths(data.slug, previous?.slug);
    redirect("/admin/products");
  }

  const previous = await prisma.product.findUnique({ where: { id } });
  const product = await prisma.product.update({ where: { id }, data: productPayload(formData) });
  await createAdminLog({
    action: previous?.price?.toString() !== product.price?.toString() ? "product.price_update" : "product.update",
    entityType: "product",
    entityId: product.id,
    message: `${admin.email} изменил товар ${product.title}`,
    metadata: { previousSlug: previous?.slug, newSlug: product.slug }
  });
  revalidateProductPaths(product.slug, previous?.slug);
  redirect("/admin/products");
}

export async function toggleProductPublishedAction(id: string) {
  const admin = await requireAdmin();
  ensureStorage();

  if (hasSupabaseAdminEnv) {
    const supabase = createSupabaseAdminClient();
    const { data: product, error: readError } = await supabase.from("products").select("*").eq("id", id).single();
    if (readError) throw new Error(readError.message);
    const { data: next, error } = await supabase
      .from("products")
      .update({ is_published: !product.is_published, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    await createAdminLog({
      action: next.is_published ? "product.publish" : "product.unpublish",
      entityType: "product",
      entityId: id,
      message: `${admin.email} ${next.is_published ? "опубликовал" : "скрыл"} товар ${next.title}`
    });
    revalidateProductPaths(next.slug);
    return;
  }

  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  const next = await prisma.product.update({ where: { id }, data: { isPublished: !product.isPublished } });
  await createAdminLog({
    action: next.isPublished ? "product.publish" : "product.unpublish",
    entityType: "product",
    entityId: id,
    message: `${admin.email} ${next.isPublished ? "опубликовал" : "скрыл"} товар ${next.title}`
  });
  revalidateProductPaths(next.slug);
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

function articlePayloadSupabase(formData: FormData) {
  const payload = articlePayload(formData);
  return {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    content: payload.content,
    category: payload.category,
    cover_image_url: payload.coverImage,
    read_time: payload.readTime,
    published_at: payload.publishedAt?.toISOString() ?? null,
    status: payload.status,
    is_featured: payload.isFeatured,
    seo_title: payload.seoTitle,
    seo_description: payload.seoDescription,
    updated_at: new Date().toISOString()
  };
}

export async function createArticleAction(formData: FormData) {
  const admin = await requireAdmin();
  ensureStorage();
  const payload = articlePayload(formData);

  if (hasSupabaseAdminEnv) {
    const supabase = createSupabaseAdminClient();
    if (payload.isFeatured) {
      await supabase.from("articles").update({ is_featured: false, updated_at: new Date().toISOString() }).neq("slug", payload.slug);
    }
    const { data, error } = await supabase.from("articles").insert(articlePayloadSupabase(formData)).select("*").single();
    if (error) throw new Error(error.message);
    await createAdminLog({ action: "article.create", entityType: "article", entityId: data.id, message: `${admin.email} создал статью ${data.title}` });
    revalidateArticlePaths(data.slug);
    redirect("/admin/articles");
  }

  if (payload.isFeatured) {
    await prisma.article.updateMany({ data: { isFeatured: false } });
  }
  const article = await prisma.article.create({ data: payload });
  await createAdminLog({ action: "article.create", entityType: "article", entityId: article.id, message: `${admin.email} создал статью ${article.title}` });
  revalidateArticlePaths(article.slug);
  redirect("/admin/articles");
}

export async function updateArticleAction(id: string, formData: FormData) {
  const admin = await requireAdmin();
  ensureStorage();
  const payload = articlePayload(formData);

  if (hasSupabaseAdminEnv) {
    const supabase = createSupabaseAdminClient();
    const { data: previous } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
    if (payload.isFeatured) {
      await supabase.from("articles").update({ is_featured: false, updated_at: new Date().toISOString() }).neq("id", id);
    }
    const { data, error } = await supabase.from("articles").update(articlePayloadSupabase(formData)).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);
    await createAdminLog({
      action: "article.update",
      entityType: "article",
      entityId: data.id,
      message: `${admin.email} изменил статью ${data.title}`,
      metadata: { previousSlug: previous?.slug, newSlug: data.slug, status: data.status }
    });
    revalidateArticlePaths(data.slug, previous?.slug);
    redirect("/admin/articles");
  }

  const previous = await prisma.article.findUnique({ where: { id } });
  if (payload.isFeatured) {
    await prisma.article.updateMany({ where: { id: { not: id } }, data: { isFeatured: false } });
  }
  const article = await prisma.article.update({ where: { id }, data: payload });
  await createAdminLog({
    action: "article.update",
    entityType: "article",
    entityId: article.id,
    message: `${admin.email} изменил статью ${article.title}`,
    metadata: { previousSlug: previous?.slug, newSlug: article.slug, status: article.status }
  });
  revalidateArticlePaths(article.slug, previous?.slug);
  redirect("/admin/articles");
}

export async function updateSettingsAction(formData: FormData) {
  const admin = await requireAdmin();
  ensureStorage();

  const value = {
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    city: text(formData, "city"),
    cityDelivery: text(formData, "city"),
    footerText: text(formData, "footerText"),
    currency: text(formData, "currency") || "BYN",
    showPrices: formData.get("showPrices") === "on",
    enableOnlinePayment: formData.get("enableOnlinePayment") === "on",
    onlinePaymentEnabled: formData.get("enableOnlinePayment") === "on",
    mainCtaText: text(formData, "mainCtaText"),
    mainCta: text(formData, "mainCtaText"),
    deliveryText: text(formData, "deliveryText")
  };

  if (hasSupabaseAdminEnv) {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("site_settings").upsert({ key: "site", value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    await createAdminLog({ action: "settings.update", entityType: "settings", entityId: "site", message: `${admin.email} изменил настройки сайта` });
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return;
  }

  await prisma.siteSettings.upsert({ where: { key: "site" }, create: { key: "site", value }, update: { value } });
  await createAdminLog({ action: "settings.update", entityType: "settings", entityId: "site", message: `${admin.email} изменил настройки сайта` });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function updateOrderStatusAction(id: string, formData: FormData) {
  const admin = await requireAdmin();
  ensureStorage();

  const status = text(formData, "status");
  if (hasSupabaseAdminEnv) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);
    await createAdminLog({
      action: "order.status_update",
      entityType: "order",
      entityId: id,
      message: `${admin.email} изменил статус заказа ${data.order_number ?? data.orderNumber ?? id} на ${status}`
    });
    revalidatePath("/admin/orders");
    return;
  }

  const order = await prisma.order.update({ where: { id }, data: { status } });
  await createAdminLog({
    action: "order.status_update",
    entityType: "order",
    entityId: id,
    message: `${admin.email} изменил статус заказа ${order.orderNumber} на ${status}`
  });
  revalidatePath("/admin/orders");
}

function revalidateProductPaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/catalog");
  revalidatePath("/potato");
  revalidatePath(`/products/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/products/${previousSlug}`);
  revalidatePath("/admin/products");
}

function revalidateArticlePaths(slug: string, previousSlug?: string) {
  revalidatePath("/knowledge");
  revalidatePath(`/knowledge/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/knowledge/${previousSlug}`);
  revalidatePath("/admin/articles");
}
