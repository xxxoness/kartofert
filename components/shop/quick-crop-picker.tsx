"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";

export function QuickCropPicker() {
  return (
    <div className="min-w-0 rounded-[18px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_48px_rgba(45,35,17,.08)]">
      <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Подбор по культуре</h2>
      <p className="mt-2 text-sm leading-6 text-[#596553]">Сейчас каталог сфокусирован на картофеле.</p>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {products.slice(0, 3).map((product) => (
          <Link key={product.slug} href={`/products/${product.slug}`} className="rounded-[14px] bg-[#fbf8f1] p-4 transition hover:bg-[#edf4e6]">
            <p className="text-xs font-black uppercase text-[#8a662a]">{product.category}</p>
            <h3 className="mt-2 font-black leading-tight text-[#102116]">{product.name}</h3>
            <p className="mt-2 text-sm text-[#66705f]">{product.packageSize}</p>
          </Link>
        ))}
      </div>
      <Link href="/products" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#063b23]">
        Смотреть все товары
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
