import { BarChart3 } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getAnalyticsSummary } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminAnalyticsPage() {
  const admin = await requireAdmin();
  const analytics = getAnalyticsSummary();

  return (
    <AdminLayout active="analytics" title="Аналитика" description="Каркас для событий, просмотров, конверсий и ошибок." adminEmail={admin.email}>
      <section className="rounded-[22px] border border-[#173c25]/10 bg-white p-6 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="grid h-14 w-14 place-items-center rounded-[18px] bg-[#eef7e8] text-[#1f7a45]">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[#102116]">Данные ещё не собираются</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#596553]">{analytics.message}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {analytics.items.map((item) => (
            <div key={item} className="rounded-[16px] border border-[#173c25]/10 bg-[#fffdf8] p-4">
              <p className="font-black text-[#102116]">{item}</p>
              <p className="mt-1 text-sm font-semibold text-[#596553]">Ожидает подключения</p>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
