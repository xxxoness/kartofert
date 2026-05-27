import { prisma, withDatabase } from "@/lib/db";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import { Article, articles as staticArticles } from "@/data/articles";

type DbArticle = Awaited<ReturnType<typeof prisma.article.findFirst>>;
type SupabaseArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image_url?: string | null;
  read_time?: string | null;
  published_at?: string | null;
  status?: string | null;
  is_featured?: boolean | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export function dbArticleToArticle(row: NonNullable<DbArticle>): Article {
  const legacy = (row.legacy && typeof row.legacy === "object" ? row.legacy : {}) as Partial<Article>;

  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    readTime: row.readTime ?? legacy.readTime ?? "7 минут",
    date: row.publishedAt ? row.publishedAt.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : legacy.date ?? "",
    excerpt: row.excerpt,
    content: row.content,
    sections: legacy.sections ?? [],
    tips: legacy.tips ?? [],
    mistakes: legacy.mistakes ?? [],
    checklist: legacy.checklist ?? [],
    agronomistAdvice: legacy.agronomistAdvice ?? "",
    relatedProductSlugs: legacy.relatedProductSlugs ?? []
  };
}

function supabaseArticleToArticle(row: SupabaseArticleRow): Article {
  const legacy = staticArticles.find((article) => article.slug === row.slug);
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    readTime: row.read_time ?? legacy?.readTime ?? "7 минут",
    date: row.published_at
      ? new Date(row.published_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
      : legacy?.date ?? "",
    excerpt: row.excerpt,
    content: row.content,
    sections: legacy?.sections ?? [],
    tips: legacy?.tips ?? [],
    mistakes: legacy?.mistakes ?? [],
    checklist: legacy?.checklist ?? [],
    agronomistAdvice: legacy?.agronomistAdvice ?? "",
    relatedProductSlugs: legacy?.relatedProductSlugs ?? []
  };
}

export async function getArticles() {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("articles").select("*").order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => supabaseArticleToArticle(row as SupabaseArticleRow));
    } catch (error) {
      console.error("[supabase articles]", error);
    }
  }

  return withDatabase(
    async () => {
      const rows = await prisma.article.findMany({ orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }] });
      return rows.map(dbArticleToArticle);
    },
    staticArticles
  );
}

export async function getPublishedArticles() {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("is_featured", { ascending: false })
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => supabaseArticleToArticle(row as SupabaseArticleRow));
    } catch (error) {
      console.error("[supabase articles]", error);
    }
  }

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
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
      if (error) throw error;
      return data ? supabaseArticleToArticle(data as SupabaseArticleRow) : null;
    } catch (error) {
      console.error("[supabase article]", error);
    }
  }

  return withDatabase(
    async () => {
      const row = await prisma.article.findFirst({ where: { slug, status: "published" } });
      return row ? dbArticleToArticle(row) : null;
    },
    staticArticles.find((article) => article.slug === slug) ?? null
  );
}

export async function getAdminArticles() {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("articles").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => supabaseArticleToAdminRow(row as SupabaseArticleRow));
    } catch (error) {
      console.error("[supabase admin articles]", error);
    }
  }

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
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? supabaseArticleToAdminRow(data as SupabaseArticleRow) : null;
    } catch (error) {
      console.error("[supabase admin article]", error);
    }
  }

  return withDatabase(async () => prisma.article.findUnique({ where: { id } }), null);
}

function supabaseArticleToAdminRow(row: SupabaseArticleRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    coverImage: row.cover_image_url,
    readTime: row.read_time,
    publishedAt: row.published_at ? new Date(row.published_at) : null,
    status: row.status ?? "draft",
    isFeatured: row.is_featured ?? false,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    legacy: null,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date()
  };
}
