import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProductById } from "@/lib/products";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) notFound();

  return (
    <AdminLayout active="products" title="Редактирование товара" description="Изменение цены, наличия, описаний, состава и SEO." adminEmail={admin.email}>
      <ProductForm product={product} />
    </AdminLayout>
  );
}
