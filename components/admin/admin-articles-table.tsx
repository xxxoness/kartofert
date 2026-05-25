"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { articles } from "@/data/articles";
import { Button } from "@/components/ui/button";

export type AdminArticle = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  status: "черновик" | "опубликовано";
};

export const adminArticlesKey = "kartofert-articles";

export function readAdminArticles(): AdminArticle[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(adminArticlesKey);
  if (!raw) {
    return articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.sections.map((section) => `${section.heading}\n${section.paragraphs.join("\n\n")}`).join("\n\n"),
      status: "опубликовано"
    }));
  }
  return JSON.parse(raw) as AdminArticle[];
}

export function saveAdminArticles(items: AdminArticle[]) {
  window.localStorage.setItem(adminArticlesKey, JSON.stringify(items));
}

export function AdminArticlesTable() {
  const [items, setItems] = useState<AdminArticle[]>([]);

  useEffect(() => {
    const loaded = readAdminArticles();
    setItems(loaded);
    saveAdminArticles(loaded);
  }, []);

  const updateStatus = (slug: string, status: AdminArticle["status"]) => {
    const next = items.map((item) => (item.slug === slug ? { ...item, status } : item));
    setItems(next);
    saveAdminArticles(next);
  };

  const remove = (slug: string) => {
    const next = items.filter((item) => item.slug !== slug);
    setItems(next);
    saveAdminArticles(next);
  };

  return (
    <div className="rounded-[16px] border border-[#173c25]/10 bg-white shadow-[0_12px_32px_rgba(45,35,17,.05)]">
      <div className="flex flex-col gap-3 border-b border-[#173c25]/10 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Статьи</h2>
          <p className="mt-2 text-sm font-semibold text-[#596553]">Список материалов базы знаний. Новые статьи сохраняются локально.</p>
        </div>
        <Button asChild className="rounded-[10px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
          <Link href="/admin/articles/new">
            <Plus className="h-4 w-4" />
            Новая статья
          </Link>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[840px] w-full text-sm">
          <thead className="bg-[#fbf7ec] text-left text-xs font-black uppercase tracking-[0.08em] text-[#6e5b22]">
            <tr>
              <th className="px-4 py-3">Заголовок</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Категория</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Действие</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug} className="border-t border-[#173c25]/10">
                <td className="px-4 py-3 font-black text-[#102116]">{item.title}</td>
                <td className="px-4 py-3 text-[#596553]">{item.slug}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">
                  <select value={item.status} onChange={(event) => updateStatus(item.slug, event.target.value as AdminArticle["status"])} className="h-10 rounded-[10px] border border-[#173c25]/10 px-3 font-bold outline-none focus:border-[#f5b400]">
                    <option value="опубликовано">Опубликовано</option>
                    <option value="черновик">Черновик</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(item.slug)} className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#fff1e8] text-[#8c3d22] transition hover:bg-[#ffd8c7]" aria-label="Удалить статью">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
