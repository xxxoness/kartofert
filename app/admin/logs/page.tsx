import { TerminalSquare } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getAdminLogs } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminLogsPage() {
  const admin = await requireAdmin();
  const logs = await getAdminLogs();

  return (
    <AdminLayout active="logs" title="Логи действий" description="История изменений товаров, статей, заказов и настроек сайта." adminEmail={admin.email}>
      <section className="rounded-[22px] border border-[#173c25]/10 bg-white p-6 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
        {logs.length === 0 ? (
          <div className="grid min-h-[300px] place-items-center text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] bg-[#eef7e8] text-[#1f7a45]">
                <TerminalSquare className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-[-0.04em] text-[#102116]">Логов пока нет</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-[#596553]">
                Здесь будут фиксироваться входы, изменения товаров, публикации статей, обновления цен и настройки сайта.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-separate border-spacing-y-3 text-left">
              <thead className="text-xs font-black uppercase tracking-[0.12em] text-[#6e5b22]">
                <tr>
                  <th className="px-3 py-2">Дата</th>
                  <th className="px-3 py-2">Действие</th>
                  <th className="px-3 py-2">Сущность</th>
                  <th className="px-3 py-2">Сообщение</th>
                  <th className="px-3 py-2">Metadata</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="rounded-[18px] bg-[#fffdf8] text-sm font-semibold text-[#25372a] shadow-[0_10px_26px_rgba(45,35,17,.04)]">
                    <td className="rounded-l-[18px] px-3 py-4 text-xs text-[#596553]">{log.createdAt.toLocaleString("ru-RU")}</td>
                    <td className="px-3 py-4">
                      <span className="rounded-full border border-[#173c25]/10 bg-white px-3 py-1 text-xs font-black text-[#063b23]">{log.action}</span>
                    </td>
                    <td className="px-3 py-4 text-xs text-[#596553]">{log.entityType || "site"} {log.entityId ? `#${log.entityId.slice(0, 6)}` : ""}</td>
                    <td className="px-3 py-4">{log.message || "Без описания"}</td>
                    <td className="rounded-r-[18px] px-3 py-4">
                      <code className="block max-w-[260px] truncate rounded-[10px] bg-white px-3 py-2 text-xs text-[#596553]">
                        {log.metadata ? JSON.stringify(log.metadata) : "-"}
                      </code>
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
