import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, findArticle } from "@/data/articles";
import { ArticleLayout } from "@/components/shop/article-layout";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function KnowledgeArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();
  return <ArticleLayout article={article} />;
}
