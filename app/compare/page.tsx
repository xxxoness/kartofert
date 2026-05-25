import type { Metadata } from "next";
import Link from "next/link";
import { products, formatProductPrice } from "@/data/products";
import { ProductBagVisual } from "@/components/shop/product-bag-visual";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Сравнение товаров",
  description: "Сравнение удобрений KartoFert по составу, норме, этапу применения и цене."
};

export default function ComparePage() {
  const compared = products.slice(0, 5);
  const rows: [string, (product: (typeof products)[number]) => string][] = [
    ["Категория", (product) => product.category],
    ["Элементы", (product) => product.elements.map((element) => `${element.symbol}${element.value ? ` ${element.value}` : ""}`).join(", ")],
    ["Норма", (product) => product.recommendedRange],
    ["Этап", (product) => product.stage.join(", ")],
    ["Фасовка", (product) => product.packageSize],
    ["Цена", (product) => formatProductPrice(product)]
  ];

  return (
    <section className="container-shell py-10">
      <div className="mb-8 max-w-3xl">
        <span className="rounded-[8px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">Сравнение</span>
        <h1 className="mt-5 text-[40px] font-black leading-[1] tracking-[-0.06em] text-[#071a10] md:text-[62px]">
          Сравнение удобрений
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#4d5a4e]">Сравните популярные типы удобрений по назначению, элементам питания и цене.</p>
      </div>
      <div className="overflow-x-auto rounded-[18px] border border-[#173c25]/10 bg-white shadow-[0_18px_48px_rgba(45,35,17,.08)]">
        <table className="min-w-[980px] w-full border-collapse">
          <thead>
            <tr className="border-b border-[#173c25]/10">
              <th className="w-44 p-4 text-left text-sm font-black text-[#102116]">Параметр</th>
              {compared.map((product) => (
                <th key={product.slug} className="p-4 text-left align-top">
                  <ProductBagVisual product={product} size="sm" />
                  <h2 className="mt-3 text-base font-black leading-tight text-[#102116]">{product.name}</h2>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, render]) => (
              <tr key={label} className="border-b border-[#173c25]/10 last:border-b-0">
                <td className="p-4 text-sm font-black text-[#102116]">{label}</td>
                {compared.map((product) => (
                  <td key={product.slug} className="p-4 text-sm font-semibold leading-6 text-[#596553]">{render(product)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 rounded-[18px] border border-[#173c25]/10 bg-[#fff8e8] p-6">
        <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Какой продукт выбрать?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#596553]">
          Для базовой схемы начните с комплексного NPK. Для качества клубней смотрите калийные продукты. Для корректировки почвы выбирайте улучшители только с учётом pH и инструкции.
        </p>
        <Button asChild className="mt-5 rounded-[10px] bg-[#063b23] text-white hover:bg-[#0d5a36]">
          <Link href="/products">Вернуться в каталог</Link>
        </Button>
      </div>
    </section>
  );
}
