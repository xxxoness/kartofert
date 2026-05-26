import { Prisma } from "@prisma/client";
import { prisma, withDatabase } from "@/lib/db";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

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
  metadata?: unknown;
}) {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data: row } = await supabase
        .from("analytics_events")
        .insert({
          event_name: data.eventName,
          entity_type: data.entityType,
          entity_id: data.entityId,
          path: data.path,
          metadata: data.metadata as Prisma.InputJsonValue
        })
        .select("*")
        .single();
      return row;
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
          entityId: data.entityId,
          path: data.path,
          metadata: data.metadata as Prisma.InputJsonValue
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
        .gte("created_at", since.toISOString());

      const [pageViews, cartAdds, checkoutStarts, submittedForms, errors] = await Promise.all([
        countEvent("page_view"),
        countEvent("cart_add"),
        countEvent("checkout_start"),
        countEvent("form_submit"),
        countEvent("error")
      ]);

      return {
        enabled: true,
        message: todayEvents ? "Аналитика собирается из analytics_events." : "События пока не поступали.",
        items: [
          `Посетители сегодня: ${todayEvents}`,
          "Активные сейчас: данные появятся после realtime tracking",
          `Просмотры страниц: ${pageViews}`,
          "Популярные страницы: данные появятся после page_view",
          "Популярные товары: данные появятся после событий товаров",
          `Добавления в корзину: ${cartAdds}`,
          `Начатые оформления заказа: ${checkoutStarts}`,
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

    const [todayEvents, pageViews, cartAdds, checkoutStarts, submittedForms, errors] = await Promise.all([
      prisma.analyticsEvent.count({ where: { createdAt: { gte: since } } }),
      prisma.analyticsEvent.count({ where: { eventName: "page_view" } }),
      prisma.analyticsEvent.count({ where: { eventName: "cart_add" } }),
      prisma.analyticsEvent.count({ where: { eventName: "checkout_start" } }),
      prisma.analyticsEvent.count({ where: { eventName: "form_submit" } }),
      prisma.analyticsEvent.count({ where: { eventName: "error" } })
    ]);

    return {
      enabled: true,
      message: todayEvents ? "Аналитика собирается из analytics_events." : "События пока не поступали.",
      items: [
        `Посетители сегодня: ${todayEvents}`,
        "Активные сейчас: данные появятся после realtime tracking",
        `Просмотры страниц: ${pageViews}`,
        "Популярные страницы: данные появятся после page_view",
        "Популярные товары: данные появятся после событий товаров",
        `Добавления в корзину: ${cartAdds}`,
        `Начатые оформления заказа: ${checkoutStarts}`,
        `Отправленные формы: ${submittedForms}`,
        `Ошибки: ${errors}`
      ]
    };
  }, emptySummary);
}
