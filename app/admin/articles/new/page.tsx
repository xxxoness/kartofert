import { AdminLayout } from "@/components/admin/admin-layout";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewAdminArticlePage() {
  const admin = await requireAdmin();

  return (
    <AdminLayout active="articles" title="Новая статья" description="UI-заготовка редактора. Публикация будет сохраняться после подключения базы данных." adminEmail={admin.email}>
      <form className="grid gap-5 rounded-[22px] border border-[#173c25]/10 bg-white p-6 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Заголовок" />
          <Field label="Slug" />
          <Field label="Категория" />
          <Field label="Обложка" />
          <Field label="SEO title" />
          <Field label="SEO description" />
        </div>
        <label className="grid gap-2 text-sm font-black text-[#243427]">
          Краткое описание
          <textarea className="min-h-24 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 py-3 font-semibold outline-none focus:border-[#f5b400]" />
        </label>
        <label className="grid gap-2 text-sm font-black text-[#243427]">
          Content / Markdown
          <textarea className="min-h-64 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 py-3 font-semibold outline-none focus:border-[#f5b400]" />
        </label>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <select className="h-12 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 font-bold outline-none focus:border-[#f5b400] md:w-[260px]">
            <option value="draft">Черновик</option>
            <option value="published">Опубликовано</option>
          </select>
          <button className="h-12 rounded-[14px] bg-[#063b23] px-7 text-sm font-black text-white transition hover:bg-[#0d5a36]">Сохранить статью</button>
        </div>
      </form>
    </AdminLayout>
  );
}

function Field({ label }: { label: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#243427]">
      {label}
      <input className="h-12 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 font-semibold outline-none focus:border-[#f5b400]" />
    </label>
  );
}
