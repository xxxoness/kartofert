import type { Metadata } from "next";
import { articles } from "@/data/articles";
import { KnowledgeCard } from "@/components/shop/knowledge-card";

export const metadata: Metadata = {
  title: "База знаний",
  description: "Практические статьи KartoFert о покупке, расчёте и применении удобрений для картофеля."
};

export default function KnowledgePage() {
  return (
    <section className="container-shell py-10 md:py-14">
      <div className="max-w-3xl">
        <span className="rounded-[8px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">База знаний</span>
        <h1 className="mt-5 text-[40px] font-black leading-[1] tracking-[-0.06em] text-[#071a10] md:text-[62px]">
          Практические статьи по удобрениям для картофеля
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#4d5a4e]">
          Не короткие заглушки, а понятные материалы о выборе типа удобрения, расчёте количества, ошибках внесения и подготовке заявки.
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <KnowledgeCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
