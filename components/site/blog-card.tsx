import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BlogCard({ article }: { article: { slug: string; title: string; date: string; category: string; excerpt: string; readTime: string } }) {
  return (
    <Link href={`/blog/${article.slug}`} className="group rounded-[8px] border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:border-emerald-200/24">
      <Badge>{article.category}</Badge>
      <h3 className="mt-5 text-2xl font-semibold text-white transition group-hover:text-emerald-100">{article.title}</h3>
      <p className="mt-3 text-sm leading-7 text-stone-300">{article.excerpt}</p>
      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-stone-400">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {article.date}
        </span>
        <span>{article.readTime}</span>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-100">
        Читать статью
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
