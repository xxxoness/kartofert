import { prisma, withDatabase } from "@/lib/db";
import { Article, articles as staticArticles } from "@/data/articles";

type DbArticle = Awaited<ReturnType<typeof prisma.article.findFirst>>;

export function dbArticleToArticle(row: NonNullable<DbArticle>): Article {
  const legacy = (row.legacy && typeof row.legacy === "object" ? row.legacy : {}) as Partial<Article>;

  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    readTime: row.readTime ?? legacy.readTime ?? "7 минут",
    date: row.publishedAt ? row.publishedAt.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : legacy.date ?? "",
    excerpt: row.excerpt,
    sections: legacy.sections ?? [{ heading: "Материал", paragraphs: [row.content] }],
    tips: legacy.tips ?? [],
    mistakes: legacy.mistakes ?? [],
    checklist: legacy.checklist ?? [],
    agronomistAdvice: legacy.agronomistAdvice ?? "",
    relatedProductSlugs: legacy.relatedProductSlugs ?? []
  };
}

export async function getArticles() {
  return withDatabase(
    async () => {
      const rows = await prisma.article.findMany({ orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }] });
      return rows.map(dbArticleToArticle);
    },
    staticArticles
  );
}

export async function getPublishedArticles() {
  return withDatabase(
    async () => {
      const rows = await prisma.article.findMany({
        where: { status: "published" },
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }]
      });
      return rows.map(dbArticleToArticle);
    },
    staticArticles
  );
}

export async function getArticleBySlug(slug: string) {
  return withDatabase(
    async () => {
      const row = await prisma.article.findFirst({ where: { slug, status: "published" } });
      return row ? dbArticleToArticle(row) : null;
    },
    staticArticles.find((article) => article.slug === slug) ?? null
  );
}

export async function getAdminArticles() {
  return withDatabase(
    async () => prisma.article.findMany({ orderBy: [{ updatedAt: "desc" }] }),
    staticArticles.map((article, index) => ({
      id: article.slug,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.sections.map((section) => `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}`).join("\n\n"),
      category: article.category,
      coverImage: "/assets/images/knowledge-base/articles/kb-article-potato-growth-stage.png",
      readTime: article.readTime,
      publishedAt: new Date(),
      status: "published",
      isFeatured: index === 0,
      seoTitle: article.title,
      seoDescription: article.excerpt,
      legacy: article,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );
}

export async function getAdminArticleById(id: string) {
  return withDatabase(async () => prisma.article.findUnique({ where: { id } }), null);
}
