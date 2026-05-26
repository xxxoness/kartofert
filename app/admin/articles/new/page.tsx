import { AdminLayout } from "@/components/admin/admin-layout";
import { ArticleForm } from "@/components/admin/article-form";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewAdminArticlePage() {
  const admin = await requireAdmin();

  return (
    <AdminLayout active="articles" title="Новая статья" description="Создание статьи базы знаний." adminEmail={admin.email}>
      <ArticleForm />
    </AdminLayout>
  );
}
