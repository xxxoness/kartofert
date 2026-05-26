import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ArticleForm } from "@/components/admin/article-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminArticleById } from "@/lib/articles";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const article = await getAdminArticleById(id);

  if (!article) notFound();

  return (
    <AdminLayout active="articles" title="Редактирование статьи" description="Изменение текста, статуса публикации, обложки и SEO." adminEmail={admin.email}>
      <ArticleForm article={article} />
    </AdminLayout>
  );
}
