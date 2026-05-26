import Link from "next/link";
import { createProductAction, updateProductAction } from "@/app/admin/actions";

type ProductFormRow = {
  id?: string;
  slug?: string;
  title?: string;
  shortTitle?: string | null;
  description?: string;
  shortDescription?: string | null;
  category?: string;
  type?: string | null;
  stage?: string | null;
  task?: string | null;
  nutrients?: unknown;
  composition?: unknown;
  specs?: unknown;
  instructions?: unknown;
  image?: string | null;
  images?: unknown;
  packageWeightKg?: number;
  price?: { toString(): string } | number | null;
  currency?: string;
  priceMode?: string;
  priceLabel?: string | null;
  stockStatus?: string;
  stockQty?: number | null;
  isPublished?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

function stringify(value: unknown) {
  if (!value) return "";
  return JSON.stringify(value, null, 2);
}

export function ProductForm({ product }: { product?: ProductFormRow | null }) {
  const action = product?.id ? updateProductAction.bind(null, product.id) : createProductAction;

  return (
    <form action={action} className="grid gap-5 rounded-[22px] border border-[#173c25]/10 bg-white p-6 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Название" name="title" defaultValue={product?.title} required />
        <Field label="Короткое название" name="shortTitle" defaultValue={product?.shortTitle} />
        <Field label="Slug" name="slug" defaultValue={product?.slug} required />
        <Field label="Категория" name="category" defaultValue={product?.category} required />
        <Field label="Тип" name="type" defaultValue={product?.type} />
        <Field label="Этап применения" name="stage" defaultValue={product?.stage} />
        <Field label="Задачи" name="task" defaultValue={product?.task} />
        <Field label="Главное изображение" name="image" defaultValue={product?.image} />
      </div>

      <TextArea label="Краткое описание" name="shortDescription" defaultValue={product?.shortDescription ?? ""} />
      <TextArea label="Описание" name="description" defaultValue={product?.description ?? ""} required />

      <div className="grid gap-4 lg:grid-cols-4">
        <Field label="Цена" name="price" type="number" step="0.01" defaultValue={product?.price?.toString() ?? ""} />
        <Field label="Подпись цены" name="priceLabel" defaultValue={product?.priceLabel ?? ""} />
        <Field label="Валюта" name="currency" defaultValue={product?.currency ?? "BYN"} />
        <Select label="Режим цены" name="priceMode" defaultValue={product?.priceMode ?? "request"} options={[["request", "Цена уточняется"], ["exact", "Точная цена"], ["from", "От цены"]]} />
        <Field label="Вес мешка, кг" name="packageWeightKg" type="number" step="0.1" defaultValue={String(product?.packageWeightKg ?? 25)} />
        <Select label="Наличие" name="stockStatus" defaultValue={product?.stockStatus ?? "in_stock"} options={[["in_stock", "В наличии"], ["low_stock", "Мало"], ["out_of_stock", "Нет в наличии"], ["preorder", "Предзаказ"]]} />
        <Field label="Остаток" name="stockQty" type="number" defaultValue={product?.stockQty?.toString() ?? ""} />
        <Field label="Сортировка" name="sortOrder" type="number" defaultValue={String(product?.sortOrder ?? 0)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea label="Nutrients JSON" name="nutrients" defaultValue={stringify(product?.nutrients)} rows={8} />
        <TextArea label="Images JSON" name="images" defaultValue={stringify(product?.images)} rows={8} />
        <TextArea label="Composition JSON" name="composition" defaultValue={stringify(product?.composition)} rows={8} />
        <TextArea label="Specs JSON" name="specs" defaultValue={stringify(product?.specs)} rows={8} />
        <TextArea label="Instructions JSON" name="instructions" defaultValue={stringify(product?.instructions)} rows={8} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="SEO title" name="seoTitle" defaultValue={product?.seoTitle} />
        <Field label="SEO description" name="seoDescription" defaultValue={product?.seoDescription} />
      </div>

      <div className="flex flex-wrap gap-4">
        <Check name="isPublished" label="Опубликован" defaultChecked={product?.isPublished ?? true} />
        <Check name="isFeatured" label="Популярный" defaultChecked={product?.isFeatured ?? false} />
      </div>

      <div className="flex flex-col gap-3 border-t border-[#173c25]/10 pt-5 sm:flex-row">
        <button className="h-12 rounded-[14px] bg-[#063b23] px-7 text-sm font-black text-white transition hover:bg-[#0d5a36]">Сохранить</button>
        {product?.slug ? (
          <Link href={`/products/${product.slug}`} className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#173c25]/10 bg-white px-7 text-sm font-black text-[#063b23] transition hover:border-[#f5b400]">
            Открыть на сайте
          </Link>
        ) : null}
        <Link href="/admin/products" className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#173c25]/10 bg-white px-7 text-sm font-black text-[#596553] transition hover:border-[#f5b400]">
          Отмена
        </Link>
      </div>
    </form>
  );
}

function Field({ label, name, defaultValue, type = "text", required, step }: { label: string; name: string; defaultValue?: string | null; type?: string; required?: boolean; step?: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#243427]">
      {label}
      <input name={name} type={type} step={step} required={required} defaultValue={defaultValue ?? ""} className="h-12 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 font-semibold outline-none focus:border-[#f5b400]" />
    </label>
  );
}

function TextArea({ label, name, defaultValue, required, rows = 4 }: { label: string; name: string; defaultValue?: string; required?: boolean; rows?: number }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#243427]">
      {label}
      <textarea name={name} required={required} defaultValue={defaultValue ?? ""} rows={rows} className="rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 py-3 font-semibold outline-none focus:border-[#f5b400]" />
    </label>
  );
}

function Select({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: string; options: Array<[string, string]> }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#243427]">
      {label}
      <select name={name} defaultValue={defaultValue} className="h-12 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 font-semibold outline-none focus:border-[#f5b400]">
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 py-3 text-sm font-black text-[#243427]">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 accent-[#063b23]" />
      {label}
    </label>
  );
}
