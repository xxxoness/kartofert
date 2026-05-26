import { Prisma } from "@prisma/client";
import { prisma, withDatabase } from "@/lib/db";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

type AnalyticsRow = {
  event_name: string;
  path?: string | null;
  product_slug?: string | null;
  entity_id?: string | null;
  payload?: unknown;
  metadata?: unknown;
  created_at?: string | null;
};

const emptySummary = {
  enabled: false,
  message: "Аналитика начнёт собираться после подключения tracking endpoint.",
  items: [
    "Посетители сегодня",
    "Активные сейчас",
    "Просмотры страниц",
    "Популярные страницы",
    "Популярные товары",
    "Добавления в корзину",
    "Начатые оформления заказа",
    "Отправленные формы",
    "Ошибки"
  ]
};

export async function createAnalyticsEvent(data: {
  eventName: string;
  entityType?: string;
  entityId?: string;
  path?: string;
  productSlug?: string;
  payload?: unknown;
  metadata?: unknown;
}) {
  const payload = stripPersonalData(data.payload ?? data.metadata);
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const insertPayload = {
        event_name: data.eventName,
        entity_type: data.entityType,
        entity_id: data.entityId ?? data.productSlug,
        path: cleanPath(data.path),
        product_slug: data.productSlug,
        payload,
        metadata: payload as Prisma.InputJsonValue
      };

      const { data: row, error } = await supabase
        .from("analytics_events")
        .insert(insertPayload)
        .select("*")
        .single();
      if (!error) return row;

      const fallbackPayload = {
        event_name: data.eventName,
        entity_type: data.entityType ?? (data.productSlug ? "product" : undefined),
        entity_id: data.entityId ?? data.productSlug,
        path: cleanPath(data.path),
        metadata: { ...(payload && typeof payload === "object" ? payload : {}), product_slug: data.productSlug } as Prisma.InputJsonValue
      };
      const { data: fallbackRow, error: fallbackError } = await supabase.from("analytics_events").insert(fallbackPayload).select("*").single();
      if (fallbackError) throw fallbackError;
      return fallbackRow;
    } catch (error) {
      console.error("[supabase analytics]", error);
      return null;
    }
  }

  return withDatabase(
    async () =>
      prisma.analyticsEvent.create({
        data: {
          eventName: data.eventName,
          entityType: data.entityType,
          entityId: data.entityId ?? data.productSlug,
          path: cleanPath(data.path),
          metadata: { ...(payload && typeof payload === "object" ? payload : {}), productSlug: data.productSlug } as Prisma.InputJsonValue
        }
      }),
    null
  );
}

export async function getAnalyticsSummary() {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const since = new Date();
      since.setHours(0, 0, 0, 0);
      const activeSince = new Date(Date.now() - 5 * 60 * 1000);

      const countEvent = async (eventName?: string) => {
        let query = supabase.from("analytics_events").select("id", { count: "exact", head: true });
        if (eventName) query = query.eq("event_name", eventName);
        const { count, error } = await query;
        if (error) throw error;
        return count ?? 0;
      };

      const { count: todayEvents = 0 } = await supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_name", "page_view")
        .gte("created_at", since.toISOString());

      const { count: activeNow = 0 } = await supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_name", "page_view")
        .gte("created_at", activeSince.toISOString());

      const [pageViews, productViews, cartAdds, submittedForms, errors] = await Promise.all([
        countEvent("page_view"),
        countEvent("product_view"),
        countEvent("add_to_cart"),
        countEvent("contact_form_submit"),
        countEvent("error")
      ]);
      const { data: rows, error: rowsError } = await supabase
        .from("analytics_events")
        .select("event_name,path,product_slug,entity_id,payload,metadata,created_at")
        .in("event_name", ["page_view", "product_view"])
        .order("created_at", { ascending: false })
        .limit(1000);
      if (rowsError) throw rowsError;

      const popularPages = topBy((rows ?? []).filter((row) => row.event_name === "page_view"), (row) => cleanPath(row.path) ?? "/");
      const popularProducts = topBy(
        (rows ?? []).filter((row) => row.event_name === "product_view"),
        (row) => normalizeProductSlug(row as AnalyticsRow)
      );

      return {
        enabled: true,
        message: todayEvents ? "Внутренняя аналитика собирается в Supabase analytics_events." : "События пока не поступали. Примите cookie и откройте несколько страниц.",
        items: [
          `Посетители сегодня: ${todayEvents}`,
          `Активные сейчас: ${activeNow ?? 0}`,
          `Просмотры страниц: ${pageViews}`,
          `Популярные страницы: ${popularPages || "пока нет данных"}`,
          `Популярные товары: ${popularProducts || "пока нет данных"}`,
          `Просмотры товаров: ${productViews}`,
          `Добавления в корзину: ${cartAdds}`,
          `Отправленные формы: ${submittedForms}`,
          `Ошибки: ${errors}`
        ]
      };
    } catch (error) {
      console.error("[supabase analytics summary]", error);
    }
  }

  return withDatabase(async () => {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    const activeSince = new Date(Date.now() - 5 * 60 * 1000);

    const [todayEvents, activeNow, pageViews, productViews, cartAdds, submittedForms, errors, rows] = await Promise.all([
      prisma.analyticsEvent.count({ where: { eventName: "page_view", createdAt: { gte: since } } }),
      prisma.analyticsEvent.count({ where: { eventName: "page_view", createdAt: { gte: activeSince } } }),
      prisma.analyticsEvent.count({ where: { eventName: "page_view" } }),
      prisma.analyticsEvent.count({ where: { eventName: "product_view" } }),
      prisma.analyticsEvent.count({ where: { eventName: "add_to_cart" } }),
      prisma.analyticsEvent.count({ where: { eventName: "contact_form_submit" } }),
      prisma.analyticsEvent.count({ where: { eventName: "error" } }),
      prisma.analyticsEvent.findMany({
        where: { eventName: { in: ["page_view", "product_view"] } },
        orderBy: { createdAt: "desc" },
        take: 1000
      })
    ]);
    const popularPages = topBy(rows.filter((row) => row.eventName === "page_view"), (row) => cleanPath(row.path) ?? "/");
    const popularProducts = topBy(rows.filter((row) => row.eventName === "product_view"), (row) => row.entityId ?? "");

    return {
      enabled: true,
      message: todayEvents ? "Внутренняя аналитика собирается в analytics_events." : "События пока не поступали. Примите cookie и откройте несколько страниц.",
      items: [
        `Посетители сегодня: ${todayEvents}`,
        `Активные сейчас: ${activeNow}`,
        `Просмотры страниц: ${pageViews}`,
        `Популярные страницы: ${popularPages || "пока нет данных"}`,
        `Популярные товары: ${popularProducts || "пока нет данных"}`,
        `Просмотры товаров: ${productViews}`,
        `Добавления в корзину: ${cartAdds}`,
        `Отправленные формы: ${submittedForms}`,
        `Ошибки: ${errors}`
      ]
    };
  }, emptySummary);
}

function cleanPath(path?: string | null) {
  if (!path) return undefined;
  try {
    const url = path.startsWith("http") ? new URL(path) : new URL(path, "https://kartofert.dpdns.org");
    return `${url.pathname}${url.search}`;
  } catch {
    return path.slice(0, 240);
  }
}

function stripPersonalData(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const blocked = new Set(["name", "email", "phone", "tel", "message", "comment", "customerName", "customerEmail", "customerPhone"]);
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([key]) => !blocked.has(key)));
}

function normalizeProductSlug(row: AnalyticsRow) {
  if (row.product_slug) return row.product_slug;
  if (row.entity_id) return row.entity_id;
  const payload = row.payload ?? row.metadata;
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const value = (payload as Record<string, unknown>).product_slug ?? (payload as Record<string, unknown>).productSlug;
    return typeof value === "string" ? value : "";
  }
  return "";
}

function topBy<T>(rows: T[], getKey: (row: T) => string | undefined) {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const key = getKey(row);
    if (!key) return;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, count]) => `${key} (${count})`)
    .join(", ");
}
