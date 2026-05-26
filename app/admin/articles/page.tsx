import Link from "next/link";
import { Eye, FilePlus2, Pencil } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getArticlesForAdmin } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminArticlesPage() {
  const admin = await requireAdmin();
  const articles = await getArticlesForAdmin();

  return (
    <AdminLayout active="articles" title="Статьи" description="Материалы базы знаний и заготовка редактора." adminEmail={admin.email}>
      <section className="overflow-hidden rounded-[22px] border border-[#173c25]/10 bg-white shadow-[0_16px_42px_rgba(45,35,17,.06)]">
        <div className="flex flex-col gap-3 border-b border-[#173c25]/10 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Статьи</h2>
            <p className="mt-1 text-sm font-semibold text-[#596553]">Список подтягивается из текущих данных базы знаний.</p>
          </div>
          <Link href="/admin/articles/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#063b23] px-5 text-sm font-black text-white transition hover:bg-[#0d5a36]">
            <FilePlus2 className="h-4 w-4" />
            Создать статью
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead className="bg-[#fbf7ec] text-xs font-black uppercase tracking-[0.12em] text-[#6b765f]">
              <tr>
                <th className="px-5 py-4">Обложка</th>
                <th className="px-5 py-4">Заголовок</th>
                <th className="px-5 py-4">Slug</th>
                <th className="px-5 py-4">Категория</th>
                <th className="px-5 py-4">Статус</th>
                <th className="px-5 py-4">Дата</th>
                <th className="px-5 py-4">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#173c25]/10">
              {articles.map((article) => (
                <tr key={article.slug} className="transition hover:bg-[#fffdf8]">
                  <td className="px-5 py-4">
                    <img src={article.image} alt="" className="h-14 w-20 rounded-[12px] object-cover" />
                  </td>
                  <td className="px-5 py-4">
                    <p className="max-w-[320px] font-black text-[#102116]">{article.title}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs font-bold text-[#596553]">{article.slug}</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#40513f]">{article.category}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#eef7e8] px-3 py-1 text-xs font-black text-[#1f7a45]">Опубликована</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-[#40513f]">{article.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/articles/${article.id}/edit`} className="grid h-10 w-10 place-items-center rounded-[12px] border border-[#173c25]/10 text-[#063b23] transition hover:border-[#f5b400]" title="Редактировать">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Link href={`/knowledge/${article.slug}`} className="grid h-10 w-10 place-items-center rounded-[12px] border border-[#173c25]/10 text-[#063b23] transition hover:border-[#f5b400]" title="Открыть на сайте">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
