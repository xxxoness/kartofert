import { Activity, BarChart3, FileText, Package, ShoppingBag } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getAdminStats } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const stats = getAdminStats();

  return (
    <AdminLayout active="dashboard" title="Панель управления" description="Ключевые разделы сайта и состояние данных." adminEmail={admin.email}>
      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard icon={Package} title="Товары" value={stats.products.total} lines={[`Опубликовано: ${stats.products.published}`, `Скрыто: ${stats.products.hidden}`]} />
        <StatCard icon={ShoppingBag} title="Заказы" value={stats.orders.total} lines={[`Новые: ${stats.orders.new}`, `В обработке: ${stats.orders.processing}`]} />
        <StatCard icon={FileText} title="Статьи" value={stats.articles.total} lines={[`Опубликовано: ${stats.articles.published}`, `Черновики: ${stats.articles.drafts}`]} />
        <StatCard icon={BarChart3} title="Посетители" value="—" lines={[stats.visitors.message]} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-[22px] border border-[#173c25]/10 bg-white p-6 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8c5b00]">Структура</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#102116]">Админка готова к подключению базы</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {["Управление товарами", "Редактор статей", "Заказы и статусы", "Настройки сайта"].map((item) => (
              <div key={item} className="rounded-[16px] border border-[#173c25]/10 bg-[#fffdf8] p-4">
                <p className="font-black text-[#102116]">{item}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#596553]">Раздел подготовлен под реальные данные и дальнейшее сохранение в БД.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-[#173c25]/10 bg-[#eef7e8] p-6 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
          <Activity className="h-9 w-9 text-[#1f7a45]" />
          <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[#102116]">Без фейковых метрик</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#40513f]">
            Пока заказы и аналитика не подключены к серверному хранилищу, админка показывает честные empty states и реальные данные только там, где они уже есть в проекте.
          </p>
        </section>
      </div>
    </AdminLayout>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  lines
}: {
  icon: typeof Package;
  title: string;
  value: number | string;
  lines: string[];
}) {
  return (
    <section className="rounded-[22px] border border-[#173c25]/10 bg-white p-5 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-[#596553]">{title}</p>
          <p className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#102116]">{value}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-[16px] bg-[#fff1be] text-[#8c5b00]">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 grid gap-1 text-sm font-bold text-[#596553]">
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </section>
  );
}
