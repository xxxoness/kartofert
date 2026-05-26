import Link from "next/link";
import { createArticleAction, updateArticleAction } from "@/app/admin/actions";

type ArticleFormRow = {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  coverImage?: string | null;
  readTime?: string | null;
  publishedAt?: Date | null;
  status?: string;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export function ArticleForm({ article }: { article?: ArticleFormRow | null }) {
  const action = article?.id ? updateArticleAction.bind(null, article.id) : createArticleAction;

  return (
    <form action={action} className="grid gap-5 rounded-[22px] border border-[#173c25]/10 bg-white p-6 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Заголовок" name="title" defaultValue={article?.title} required />
        <Field label="Slug" name="slug" defaultValue={article?.slug} required />
        <Field label="Категория" name="category" defaultValue={article?.category} required />
        <Field label="Обложка" name="coverImage" defaultValue={article?.coverImage} />
        <Field label="Время чтения" name="readTime" defaultValue={article?.readTime} />
        <Select label="Статус" name="status" defaultValue={article?.status ?? "draft"} options={[["draft", "Черновик"], ["published", "Опубликовано"]]} />
      </div>

      <TextArea label="Краткое описание" name="excerpt" defaultValue={article?.excerpt} required rows={4} />
      <TextArea label="Content / Markdown" name="content" defaultValue={article?.content} required rows={14} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="SEO title" name="seoTitle" defaultValue={article?.seoTitle} />
        <Field label="SEO description" name="seoDescription" defaultValue={article?.seoDescription} />
      </div>

      <label className="flex items-center gap-2 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 py-3 text-sm font-black text-[#243427]">
        <input name="isFeatured" type="checkbox" defaultChecked={article?.isFeatured ?? false} className="h-4 w-4 accent-[#063b23]" />
        Рекомендуемая статья
      </label>

      <div className="flex flex-col gap-3 border-t border-[#173c25]/10 pt-5 sm:flex-row">
        <button className="h-12 rounded-[14px] bg-[#063b23] px-7 text-sm font-black text-white transition hover:bg-[#0d5a36]">Сохранить</button>
        {article?.slug ? (
          <Link href={`/knowledge/${article.slug}`} className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#173c25]/10 bg-white px-7 text-sm font-black text-[#063b23] transition hover:border-[#f5b400]">
            Открыть на сайте
          </Link>
        ) : null}
        <Link href="/admin/articles" className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#173c25]/10 bg-white px-7 text-sm font-black text-[#596553] transition hover:border-[#f5b400]">
          Отмена
        </Link>
      </div>
    </form>
  );
}

function Field({ label, name, defaultValue, required }: { label: string; name: string; defaultValue?: string | null; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#243427]">
      {label}
      <input name={name} required={required} defaultValue={defaultValue ?? ""} className="h-12 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 font-semibold outline-none focus:border-[#f5b400]" />
    </label>
  );
}

function TextArea({ label, name, defaultValue, required, rows }: { label: string; name: string; defaultValue?: string | null; required?: boolean; rows: number }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#243427]">
      {label}
      <textarea name={name} rows={rows} required={required} defaultValue={defaultValue ?? ""} className="rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 py-3 font-semibold outline-none focus:border-[#f5b400]" />
    </label>
  );
}

function Select({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: string; options: Array<[string, string]> }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#243427]">
      {label}
      <select name={name} defaultValue={defaultValue} className="h-12 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 font-semibold outline-none focus:border-[#f5b400]">
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
