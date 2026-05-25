"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, ShieldCheck } from "lucide-react";
import { products as baseProducts } from "@/data/products";
import { calculateFertilizer } from "@/data/calculator-rules";
import { Button } from "@/components/ui/button";
import { useProductsStore } from "@/components/shop/product-store";

export function CalculatorPreview() {
  const { products } = useProductsStore();
  const items = products.length ? products : baseProducts;
  const [area, setArea] = useState(25);
  const [productSlug, setProductSlug] = useState("npk-potato");
  const product = items.find((item) => item.slug === productSlug) ?? items[0];

  const result = useMemo(
    () =>
      calculateFertilizer({
        area,
        areaMode: "sotka",
        norm: product.defaultNorm,
        normUnit: product.normUnit,
        bagWeight: product.bagWeight,
        price: product.price
      }),
    [area, product]
  );

  return (
    <aside className="rounded-[18px] border border-[#173c25]/10 bg-white p-5 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#f4e9c8] text-[#063b23]">
          <Calculator className="h-5 w-5" />
        </span>
        <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Калькулятор расчёта</h2>
      </div>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-[#243427]">
          Площадь участка
          <div className="flex overflow-hidden rounded-[10px] border border-[#173c25]/12 bg-white">
            <input
              type="number"
              min={1}
              value={area}
              onChange={(event) => setArea(Number(event.target.value))}
              className="h-11 min-w-0 flex-1 px-4 text-lg font-black outline-none"
            />
            <span className="grid w-24 place-items-center border-l border-[#173c25]/10 text-sm font-bold text-[#4d5a4e]">соток</span>
          </div>
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#243427]">
          Выберите удобрение
          <select
            value={productSlug}
            onChange={(event) => setProductSlug(event.target.value)}
            className="h-11 rounded-[10px] border border-[#173c25]/12 bg-white px-4 text-sm font-bold text-[#102116] outline-none focus:border-[#f5b400]"
          >
            {items.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.shortName} — {item.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Потребность" value={`${result.needKg.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} кг`} />
          <Metric label="Количество мешков" value={`${result.bags} шт.`} />
        </div>
        <Button asChild className="h-12 rounded-[9px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
          <Link href={`/calculator?product=${product.slug}`}>Рассчитать количество</Link>
        </Button>
        <p className="flex items-center justify-center gap-2 text-xs font-semibold text-[#506050]">
          <ShieldCheck className="h-4 w-4 text-[#1f7a45]" />
          Рекомендации по нормам и безопасности
        </p>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-[#173c25]/10 bg-[#fffaf0] p-4">
      <p className="text-xs font-bold text-[#596553]">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#102116]">{value}</p>
    </div>
  );
}
