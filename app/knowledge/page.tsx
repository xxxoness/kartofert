import type { Metadata } from "next";
import { KnowledgeBasePage } from "@/components/shop/knowledge-base-page";

export const metadata: Metadata = {
  title: "База знаний",
  description:
    "Практические статьи KartoFert по питанию картофеля, схемам внесения, расчётам, ошибкам и хранению урожая."
};

export default function KnowledgePage() {
  return <KnowledgeBasePage />;
}
