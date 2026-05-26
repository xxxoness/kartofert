import { ClipboardList } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { getOrdersForAdmin } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

const statuses = [
  { value: "new", label: "Новый" },
  { value: "processing", label: "В обработке" },
  { value: "waiting_payment", label: "Ожидает оплаты" },
  { value: "paid", label: "Оплачен" },
  { value: "shipped", label: "Отправлен" },
  { value: "completed", label: "Завершён" },
  { value: "cancelled", label: "Отменён" }
];

function formatMoney(value: unknown, currency = "BYN") {
  if (value == null) return "Цена уточняется";
  const amount = typeof value === "number" ? value : Number(String(value));
  if (!Number.isFinite(amount)) return "Цена уточняется";
  return `${amount.toLocaleString("ru-RU")} ${currency}`;
}

export default async function AdminOrdersPage() {
  const admin = await requireAdmin();
  const orders = await getOrdersForAdmin();

  return (
    <AdminLayout active="orders" title="Заказы" description="Реальные заказы из checkout и управление статусами." adminEmail={admin.email}>
      <section className="rounded-[22px] border border-[#173c25]/10 bg-white p-6 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
        {orders.length === 0 ? (
          <div className="grid min-h-[320px] place-items-center text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] bg-[#fff1be] text-[#8c5b00]">
                <ClipboardList className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-[-0.04em] text-[#102116]">Заказы появятся после оформления покупок</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-[#596553]">
                Здесь будут номер заказа, клиент, телефон, email, сумма, статус оплаты и дата.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {statuses.map((status) => (
                  <span key={status.value} className="rounded-full border border-[#173c25]/10 bg-[#fffdf8] px-3 py-1 text-xs font-black text-[#40513f]">
                    {status.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-separate border-spacing-y-3 text-left">
              <thead className="text-xs font-black uppercase tracking-[0.12em] text-[#6e5b22]">
                <tr>
                  <th className="px-3 py-2">Заказ</th>
                  <th className="px-3 py-2">Клиент</th>
                  <th className="px-3 py-2">Контакты</th>
                  <th className="px-3 py-2">Сумма</th>
                  <th className="px-3 py-2">Оплата</th>
                  <th className="px-3 py-2">Дата</th>
                  <th className="px-3 py-2">Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="rounded-[18px] bg-[#fffdf8] text-sm font-semibold text-[#25372a] shadow-[0_10px_26px_rgba(45,35,17,.04)]">
                    <td className="rounded-l-[18px] px-3 py-4">
                      <p className="font-black text-[#102116]">{order.orderNumber}</p>
                      <p className="mt-1 text-xs text-[#66705f]">{Array.isArray(order.items) ? order.items.length : "JSON"} поз.</p>
                    </td>
                    <td className="px-3 py-4">{order.customerName}</td>
                    <td className="px-3 py-4 text-xs leading-5 text-[#596553]">
                      <p>{order.customerPhone || "Телефон не указан"}</p>
                      <p>{order.customerEmail || "Email не указан"}</p>
                    </td>
                    <td className="px-3 py-4 font-black text-[#102116]">{formatMoney(order.total, order.currency)}</td>
                    <td className="px-3 py-4">
                      <span className="rounded-full border border-[#173c25]/10 bg-white px-3 py-1 text-xs font-black text-[#40513f]">{order.paymentStatus}</span>
                    </td>
                    <td className="px-3 py-4 text-xs text-[#596553]">{order.createdAt.toLocaleDateString("ru-RU")}</td>
                    <td className="rounded-r-[18px] px-3 py-4">
                      <form action={updateOrderStatusAction.bind(null, order.id)} className="flex items-center gap-2">
                        <select name="status" defaultValue={order.status} className="h-10 rounded-[12px] border border-[#173c25]/10 bg-white px-3 text-xs font-black text-[#25372a] outline-none focus:border-[#f5b400]">
                          {statuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                        <button className="h-10 rounded-[12px] bg-[#063b23] px-3 text-xs font-black text-white transition hover:bg-[#0d5a36]">
                          OK
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
