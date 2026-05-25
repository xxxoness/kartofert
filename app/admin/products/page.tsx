import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminProductsTable } from "@/components/admin/admin-products-table";

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <AdminProductsTable />
    </AdminLayout>
  );
}
