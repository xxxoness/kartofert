import type { Metadata } from "next";
import { KnowledgeBasePage } from "@/components/shop/knowledge-base-page";
import { getPublishedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "База знаний",
  description:
    "Практические статьи KartoFert по питанию картофеля, схемам внесения, расчётам, ошибкам и хранению урожая."
};

export default async function KnowledgePage() {
  const articles = await getPublishedArticles();
  return <KnowledgeBasePage articles={articles} />;
}
