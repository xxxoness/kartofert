import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Article } from "@/data/articles";

export function KnowledgeCard({ article }: { article: Article }) {
  return (
    <Link href={`/knowledge/${article.slug}`} className="group overflow-hidden rounded-[18px] border border-[#173c25]/10 bg-white shadow-[0_16px_42px_rgba(45,35,17,.06)] transition hover:-translate-y-1 hover:border-[#f5b400]/60">
      <div className="relative h-40 bg-[#eef4e6]">
        <div className="absolute inset-x-0 bottom-0 h-14 bg-[radial-gradient(circle_at_50%_0%,#5b3922,#2b1b11)]" />
        <div className="absolute bottom-9 left-8 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_34%_28%,#e9c28a,#9b6534)] shadow-lg" />
        <div className="absolute right-10 top-7 h-24 w-36 rounded-[100%_0_100%_0] bg-[linear-gradient(135deg,#86b842,#2f7424)] rotate-[-18deg]" />
      </div>
      <div className="p-6">
        <span className="rounded-[8px] bg-[#fff1be] px-3 py-1 text-xs font-black text-[#8c5b00]">{article.category}</span>
        <h3 className="mt-5 text-2xl font-black leading-tight tracking-[-0.04em] text-[#102116]">{article.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#5e6858]">{article.excerpt}</p>
        <div className="mt-6 flex items-center justify-between text-sm font-bold text-[#8a9281]">
          <span>{article.date}</span>
          <span>{article.readTime}</span>
        </div>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#1b6b40]">
          Читать
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
