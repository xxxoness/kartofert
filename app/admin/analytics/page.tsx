import { BarChart3 } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getAnalyticsSummary } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

const descriptions: Record<string, string> = {
  "Посетители сегодня": "Уникальные посетители за сегодня",
  "Активные сейчас": "Пользователи за последние 5 минут",
  "Просмотры страниц": "Всего просмотров страниц за сегодня",
  "Популярные страницы": "Топ страниц по просмотрам",
  "Популярные товары": "Товары, которые чаще открывали",
  "Просмотры товаров": "Суммарные просмотры карточек товаров",
  "Добавления в корзину": "События добавления товара в корзину",
  "Отправленные формы": "Заявки/формы, отправленные с сайта",
  "Ошибки": "Ошибки, зафиксированные на сайте"
};

function splitMetric(item: string) {
  const [title, ...rest] = item.split(":");
  return {
    title: title.trim(),
    value: rest.join(":").trim() || "0"
  };
}

export default async function AdminAnalyticsPage() {
  const admin = await requireAdmin();
  const analytics = await getAnalyticsSummary();
  const metrics = analytics.items.map(splitMetric);
  const hasData = analytics.enabled && !analytics.items.every((item) => item.includes(": 0") || item.includes("пока нет данных"));

  return (
    <AdminLayout active="analytics" title="Аналитика" description="Внутренние события сайта: просмотры, товары, корзина, формы и ошибки." adminEmail={admin.email}>
      <section className="rounded-[22px] border border-[#173c25]/10 bg-white p-6 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="grid h-14 w-14 place-items-center rounded-[18px] bg-[#eef7e8] text-[#1f7a45]">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[#102116]">
              {analytics.enabled ? "Внутренняя аналитика" : "Данные ещё не собираются"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#596553]">
              {hasData ? "Метрики обновляются по событиям сайта." : "Пока нет данных. Метрики появятся после первых посещений сайта."}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.title} className="rounded-[16px] border border-[#173c25]/10 bg-[#fffdf8] p-4">
              <p className="text-sm font-black text-[#596553]">{metric.title}</p>
              <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#102116]">{metric.value}</p>
              <p className="mt-2 text-sm font-semibold leading-5 text-[#596553]">{descriptions[metric.title] ?? "События сайта"}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs font-semibold text-[#7a8374]">Источник данных: внутренняя аналитика сайта.</p>
      </section>
    </AdminLayout>
  );
}
