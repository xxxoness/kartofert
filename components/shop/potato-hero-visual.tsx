"use client";

import { Product } from "@/data/products";
import { ProductBagMockup } from "@/components/shop/product-bag-mockup";
import { cn } from "@/lib/utils";

export function PotatoHeroVisual({
  products,
  compact = false,
  className
}: {
  products: Product[];
  compact?: boolean;
  className?: string;
}) {
  const visible = products.slice(0, compact ? 3 : 5);

  return (
    <div className={cn("relative min-h-[320px] overflow-hidden", className)}>
      <LeafCluster className="absolute right-0 top-1 h-40 w-72" />
      <LeafCluster className="absolute left-[12%] top-8 h-32 w-56 -scale-x-100 opacity-90" />
      <div className="absolute bottom-0 left-0 right-0 h-24 rounded-[55%_55%_0_0] bg-[radial-gradient(circle_at_50%_0%,#5a3822_0,#2f1d12_58%,#1c120b_100%)] shadow-[0_-18px_42px_rgba(62,39,22,.18)_inset]" />
      <div className="absolute bottom-3 left-[8%] right-[8%] h-7 rounded-full bg-black/18 blur-xl" />
      <PotatoCluster className="absolute bottom-6 left-2 h-24 w-52" />
      <PotatoCluster className="absolute bottom-7 right-0 h-28 w-64" />
      <div className={cn("absolute left-1/2 flex -translate-x-1/2 items-end justify-center", compact ? "bottom-0 gap-0" : "bottom-12 gap-2")}>
        {visible.map((product, index) => (
          <div
            key={product.slug}
            className={cn(
              "relative transition-transform duration-500",
              index === 2 && !compact ? "z-20" : "z-10",
              compact && index === 1 && "z-20"
            )}
            style={{
              marginLeft: index > 0 ? (compact ? -34 : -70) : 0,
              transform: `rotate(${index % 2 ? 2 : -2}deg) scale(${(index === 2 && !compact) || (compact && index === 1) ? 1.1 : 1})`
            }}
          >
            <ProductBagMockup product={product} size={compact ? "sm" : "hero"} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PotatoCluster({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)} aria-hidden="true">
      {Array.from({ length: 10 }).map((_, index) => (
        <span
          key={index}
          className="absolute rounded-[48%_52%_46%_54%] bg-[radial-gradient(circle_at_34%_28%,#e9c28a_0_10%,#c78f4c_38%,#8f5c2e_100%)] shadow-[inset_-6px_-8px_12px_rgba(74,42,18,.22),0_8px_18px_rgba(45,25,11,.18)]"
          style={{
            width: 34 + (index % 3) * 9,
            height: 28 + (index % 4) * 7,
            left: `${(index * 17) % 82}%`,
            bottom: `${(index * 11) % 36}%`,
            transform: `rotate(${index * 19}deg)`
          }}
        >
          <i className="absolute left-[28%] top-[33%] h-1 w-1 rounded-full bg-[#5a371e]/45" />
          <i className="absolute right-[24%] top-[48%] h-1 w-1 rounded-full bg-[#5a371e]/35" />
        </span>
      ))}
    </div>
  );
}

function LeafCluster({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)} aria-hidden="true">
      {Array.from({ length: 13 }).map((_, index) => (
        <span
          key={index}
          className="absolute rounded-[100%_0_100%_0] bg-[linear-gradient(135deg,#7fad3a,#2d6b20)] shadow-[inset_8px_0_10px_rgba(255,255,255,.18)]"
          style={{
            width: 34 + (index % 4) * 8,
            height: 18 + (index % 3) * 8,
            left: `${(index * 19) % 88}%`,
            top: `${(index * 13) % 70}%`,
            transform: `rotate(${index * 37 - 50}deg)`
          }}
        />
      ))}
    </div>
  );
}
