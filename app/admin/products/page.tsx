import Link from "next/link";
import { Eye, Pencil, ToggleRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getProductsForAdmin } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  const products = getProductsForAdmin();

  return (
    <AdminLayout active="products" title="Товары" description="Реальные товары каталога. Сохранение изменений будет подключено через базу данных." adminEmail={admin.email}>
      <section className="overflow-hidden rounded-[22px] border border-[#173c25]/10 bg-white shadow-[0_16px_42px_rgba(45,35,17,.06)]">
        <div className="flex flex-col gap-3 border-b border-[#173c25]/10 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Таблица товаров</h2>
            <p className="mt-1 text-sm font-semibold text-[#596553]">Источник: единый productsData сайта.</p>
          </div>
          <span className="w-fit rounded-full bg-[#eef7e8] px-4 py-2 text-sm font-black text-[#1f7a45]">{products.length} товаров</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead className="bg-[#fbf7ec] text-xs font-black uppercase tracking-[0.12em] text-[#6b765f]">
              <tr>
                <th className="px-5 py-4">Фото</th>
                <th className="px-5 py-4">Название</th>
                <th className="px-5 py-4">Slug</th>
                <th className="px-5 py-4">Категория</th>
                <th className="px-5 py-4">Цена</th>
                <th className="px-5 py-4">Наличие</th>
                <th className="px-5 py-4">Статус</th>
                <th className="px-5 py-4">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#173c25]/10">
              {products.map((product) => (
                <tr key={product.slug} className="transition hover:bg-[#fffdf8]">
                  <td className="px-5 py-4">
                    <div className="grid h-16 w-16 place-items-center rounded-[14px] bg-[#fbf7ec]">
                      <img src={product.image} alt="" className="max-h-14 max-w-12 object-contain" />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="max-w-[260px] font-black text-[#102116]">{product.name}</p>
                    <p className="mt-1 text-xs font-bold text-[#6b765f]">{product.elements}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs font-bold text-[#596553]">{product.slug}</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#40513f]">{product.category}</td>
                  <td className="px-5 py-4 font-black text-[#102116]">{product.price ?? "—"} ₽</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#40513f]">{product.availability}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#eef7e8] px-3 py-1 text-xs font-black text-[#1f7a45]">Опубликован</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="grid h-10 w-10 place-items-center rounded-[12px] border border-[#173c25]/10 text-[#063b23] transition hover:border-[#f5b400]" title="Редактировать">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <Link href={`/products/${product.slug}`} className="grid h-10 w-10 place-items-center rounded-[12px] border border-[#173c25]/10 text-[#063b23] transition hover:border-[#f5b400]" title="Открыть на сайте">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button className="grid h-10 w-10 place-items-center rounded-[12px] border border-[#173c25]/10 text-[#063b23] transition hover:border-[#f5b400]" title="Скрыть или показать">
                        <ToggleRight className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
