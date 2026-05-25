"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Product, formatProductPrice } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ProductBagMockup } from "@/components/shop/product-bag-mockup";
import { useCart } from "@/components/shop/cart-provider";
import { useProductsStore } from "@/components/shop/product-store";

export function ProductCard({ product: initialProduct }: { product: Product }) {
  const { getProduct } = useProductsStore();
  const { addItem } = useCart();
  const product = getProduct(initialProduct.slug) ?? initialProduct;
  const elementLine = product.elements
    .slice(0, 4)
    .map((element) => `${element.symbol}${element.value ? ` ${element.value}` : ""}`)
    .join("  •  ");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-[#173c25]/10 bg-white shadow-[0_16px_42px_rgba(45,35,17,.06)] transition duration-300 hover:-translate-y-1 hover:border-[#f5b400]/55 hover:shadow-[0_24px_70px_rgba(45,35,17,.12)]">
      <button
        className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/88 text-[#1e5a37] shadow-[0_8px_24px_rgba(28,38,25,.1)] transition hover:bg-[#fff1be] hover:text-[#063b23]"
        aria-label="Добавить в избранное"
      >
        <Heart className="h-5 w-5" />
      </button>

      <Link href={`/products/${product.slug}`} className="grid min-h-[280px] place-items-end bg-gradient-to-b from-[#fffdf7] to-[#f7f1e5] px-5 pt-7">
        <ProductBagMockup product={product} size="md" className="transition duration-300 group-hover:scale-[1.035]" />
      </Link>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <span className="w-fit rounded-[6px] bg-[#eff2e6] px-2 py-1 text-xs font-bold text-[#56624c]">{product.fertilizerType}</span>
        <Link href={`/products/${product.slug}`} className="mt-3">
          <h3 className="min-h-12 text-[19px] font-black leading-[1.18] tracking-[-0.035em] text-[#102116] transition group-hover:text-[#063b23]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 min-h-5 text-sm font-semibold text-[#4d5a4e]">{elementLine || product.category}</p>
        <p className="mt-2 text-sm font-bold text-[#102116]">{product.packageSize}</p>

        <div className="mt-auto pt-4">
          <div className="mb-4 flex items-end justify-between gap-3">
            <p className="text-[22px] font-black tracking-[-0.04em] text-[#071a10]">{formatProductPrice(product)}</p>
            <button
              onClick={() => addItem(product)}
              className="grid h-9 w-9 place-items-center rounded-[9px] bg-[#063b23] text-white transition hover:bg-[#0d5a36]"
              aria-label="Добавить в корзину"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" className="h-10 rounded-[8px] border-[#1c4a2e]/45 bg-white text-[#063b23] hover:bg-[#f1f5ea]">
              <Link href={`/products/${product.slug}`}>Подробнее</Link>
            </Button>
            <Button asChild className="h-10 rounded-[8px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
              <Link href={`/calculator?product=${product.slug}`}>Рассчитать</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
