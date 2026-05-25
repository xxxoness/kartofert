import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminArticlesTable } from "@/components/admin/admin-articles-table";

export default function AdminArticlesPage() {
  return (
    <AdminLayout>
      <AdminArticlesTable />
    </AdminLayout>
  );
}
