import { TerminalSquare } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getAdminLogs } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminLogsPage() {
  const admin = await requireAdmin();
  const logs = getAdminLogs();

  return (
    <AdminLayout active="logs" title="Логи действий" description="История входов и изменений появится после подключения серверного журнала." adminEmail={admin.email}>
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
        ) : null}
      </section>
    </AdminLayout>
  );
}
