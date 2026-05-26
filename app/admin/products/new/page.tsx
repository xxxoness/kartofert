import { AdminLayout } from "@/components/admin/admin-layout";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewProductPage() {
  const admin = await requireAdmin();

  return (
    <AdminLayout active="products" title="Новый товар" description="Создание товара в базе данных." adminEmail={admin.email}>
      <ProductForm />
    </AdminLayout>
  );
}
