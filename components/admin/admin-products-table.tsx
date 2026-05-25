"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useProductsStore } from "@/components/shop/product-store";

export function AdminProductsTable() {
  const { products, saveProduct } = useProductsStore();
  const [rows, setRows] = useState<Product[]>(products);
  const [savedSlug, setSavedSlug] = useState("");

  useEffect(() => {
    setRows(products);
  }, [products]);

  const update = (slug: string, patch: Partial<Product>) => {
    setRows((current) => current.map((product) => (product.slug === slug ? { ...product, ...patch } : product)));
  };

  const save = (product: Product) => {
    saveProduct(product);
    setSavedSlug(product.slug);
    window.setTimeout(() => setSavedSlug(""), 1400);
  };

  return (
    <div className="rounded-[16px] border border-[#173c25]/10 bg-white shadow-[0_12px_32px_rgba(45,35,17,.05)]">
      <div className="border-b border-[#173c25]/10 p-5">
        <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Товары каталога</h2>
        <p className="mt-2 text-sm font-semibold text-[#596553]">
          Изменения сохраняются в localStorage и сразу отображаются на сайте, включая калькулятор и карточки.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full border-collapse text-sm">
          <thead className="bg-[#fbf7ec] text-left text-xs font-black uppercase tracking-[0.08em] text-[#6e5b22]">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Цена</th>
              <th className="px-4 py-3">Вес</th>
              <th className="px-4 py-3">Категория</th>
              <th className="px-4 py-3">Элементы</th>
              <th className="px-4 py-3">Наличие</th>
              <th className="px-4 py-3">Норма</th>
              <th className="px-4 py-3">Описание</th>
              <th className="px-4 py-3">Действие</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.slug} className="border-t border-[#173c25]/10 align-top">
                <td className="px-4 py-3">
                  <input value={product.name} onChange={(event) => update(product.slug, { name: event.target.value })} className="h-10 w-56 rounded-[10px] border border-[#173c25]/10 px-3 font-bold outline-none focus:border-[#f5b400]" />
                </td>
                <td className="px-4 py-3">
                  <input value={product.price ?? ""} onChange={(event) => update(product.slug, { price: Number(event.target.value) })} type="number" className="h-10 w-20 rounded-[10px] border border-[#173c25]/10 px-3 font-bold outline-none focus:border-[#f5b400]" />
                </td>
                <td className="px-4 py-3">
                  <input value={product.bagWeight} onChange={(event) => update(product.slug, { bagWeight: Number(event.target.value), packageSize: `${Number(event.target.value)} кг` })} type="number" className="h-10 w-20 rounded-[10px] border border-[#173c25]/10 px-3 font-bold outline-none focus:border-[#f5b400]" />
                </td>
                <td className="px-4 py-3">
                  <input value={product.category} onChange={(event) => update(product.slug, { category: event.target.value })} className="h-10 w-44 rounded-[10px] border border-[#173c25]/10 px-3 font-bold outline-none focus:border-[#f5b400]" />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={product.elements.map((element) => `${element.symbol}${element.value ? ` ${element.value}` : ""}`).join(", ")}
                    onChange={(event) => update(product.slug, { elements: parseElements(event.target.value) })}
                    className="h-10 w-52 rounded-[10px] border border-[#173c25]/10 px-3 font-bold outline-none focus:border-[#f5b400]"
                  />
                </td>
                <td className="px-4 py-3">
                  <select value={product.inStock ? "yes" : "no"} onChange={(event) => update(product.slug, { inStock: event.target.value === "yes" })} className="h-10 rounded-[10px] border border-[#173c25]/10 px-3 font-bold outline-none focus:border-[#f5b400]">
                    <option value="yes">В наличии</option>
                    <option value="no">Под заказ</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <input value={product.defaultNorm} onChange={(event) => update(product.slug, { defaultNorm: Number(event.target.value) })} type="number" className="h-10 w-20 rounded-[10px] border border-[#173c25]/10 px-3 font-bold outline-none focus:border-[#f5b400]" />
                    <select value={product.normUnit} onChange={(event) => update(product.slug, { normUnit: event.target.value as Product["normUnit"] })} className="h-10 rounded-[10px] border border-[#173c25]/10 px-3 font-bold outline-none focus:border-[#f5b400]">
                      <option value="кг/га">кг/га</option>
                      <option value="г/м²">г/м²</option>
                      <option value="кг/сотка">кг/сотка</option>
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <textarea value={product.shortDescription} onChange={(event) => update(product.slug, { shortDescription: event.target.value })} className="h-20 w-64 resize-none rounded-[10px] border border-[#173c25]/10 px-3 py-2 font-semibold outline-none focus:border-[#f5b400]" />
                </td>
                <td className="px-4 py-3">
                  <Button onClick={() => save(product)} className="h-10 rounded-[9px] bg-[#063b23] text-white hover:bg-[#0d5a36]">
                    <Save className="h-4 w-4" />
                    {savedSlug === product.slug ? "Сохранено" : "Сохранить"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function parseElements(value: string): Product["elements"] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [symbol, ...rest] = item.split(/\s+/);
      return { symbol, label: symbol, value: rest.join(" ") || undefined };
    });
}
