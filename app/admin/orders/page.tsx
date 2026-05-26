import { ClipboardList } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getOrdersForAdmin } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

const statuses = ["Новый", "В обработке", "Ожидает оплаты", "Оплачен", "Отправлен", "Завершён", "Отменён"];

export default async function AdminOrdersPage() {
  const admin = await requireAdmin();
  const orders = getOrdersForAdmin();

  return (
    <AdminLayout active="orders" title="Заказы" description="Будущая рабочая зона для обработки заказов, статусов и оплат." adminEmail={admin.email}>
      <section className="rounded-[22px] border border-[#173c25]/10 bg-white p-6 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
        {orders.length === 0 ? (
          <div className="grid min-h-[320px] place-items-center text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] bg-[#fff1be] text-[#8c5b00]">
                <ClipboardList className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-[-0.04em] text-[#102116]">Заказы появятся после оформления покупок</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-[#596553]">
                Страница уже готова под номер заказа, клиента, телефон, email, сумму, статус, оплату, дату и действия.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {statuses.map((status) => (
                  <span key={status} className="rounded-full border border-[#173c25]/10 bg-[#fffdf8] px-3 py-1 text-xs font-black text-[#40513f]">
                    {status}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </AdminLayout>
  );
}
