"use client";

import { FormEvent, ReactElement, cloneElement, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminArticle, readAdminArticles, saveAdminArticles } from "@/components/admin/admin-articles-table";
import { Button } from "@/components/ui/button";

export default function NewAdminArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Картофель");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<AdminArticle["status"]>("черновик");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: AdminArticle = {
      title,
      slug: slug || title.toLowerCase().replaceAll(" ", "-"),
      category,
      excerpt,
      content,
      status
    };
    saveAdminArticles([next, ...readAdminArticles()]);
    router.push("/admin/articles");
  };

  return (
    <AdminLayout>
      <form onSubmit={submit} className="grid gap-5 rounded-[16px] border border-[#173c25]/10 bg-white p-5 shadow-[0_12px_32px_rgba(45,35,17,.05)]">
        <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Новая статья</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Заголовок"><input required value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
          <Field label="Slug"><input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="primer-stati" /></Field>
          <Field label="Категория"><input value={category} onChange={(event) => setCategory(event.target.value)} /></Field>
          <Field label="Краткое описание"><input value={excerpt} onChange={(event) => setExcerpt(event.target.value)} /></Field>
        </div>
        <label className="grid gap-2 text-sm font-black text-[#243427]">
          Контент
          <textarea required value={content} onChange={(event) => setContent(event.target.value)} className="min-h-56 rounded-[12px] border border-[#173c25]/10 px-4 py-3 font-semibold outline-none focus:border-[#f5b400]" />
        </label>
        <label className="grid gap-2 text-sm font-black text-[#243427] md:max-w-xs">
          Статус
          <select value={status} onChange={(event) => setStatus(event.target.value as AdminArticle["status"])} className="h-12 rounded-[12px] border border-[#173c25]/10 px-4 font-bold outline-none focus:border-[#f5b400]">
            <option value="черновик">Черновик</option>
            <option value="опубликовано">Опубликовано</option>
          </select>
        </label>
        <Button className="h-12 w-fit rounded-[10px] bg-[#063b23] px-8 text-white hover:bg-[#0d5a36]">Сохранить статью</Button>
      </form>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: ReactElement<{ className?: string }> }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#243427]">
      {label}
      {cloneElement(children, {
        className: "h-12 rounded-[12px] border border-[#173c25]/10 px-4 font-semibold outline-none focus:border-[#f5b400]"
      })}
    </label>
  );
}
