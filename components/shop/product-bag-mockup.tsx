import { Product } from "@/data/products";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const themes: Record<Product["bagTheme"], { bag: string; ink: string; accent: string; light: string }> = {
  "npk-potato": { bag: "from-[#eaf0dc] via-[#c8d7bd] to-[#8ea177]", ink: "#07381d", accent: "#f5b400", light: "#f8fbef" },
  azofoska: { bag: "from-[#d9eef8] via-[#2e698c] to-[#123f5a]", ink: "#f8fbff", accent: "#f5b400", light: "#eaf7ff" },
  diammofoska: { bag: "from-[#f5f4ee] via-[#c9cbc2] to-[#8f9489]", ink: "#102116", accent: "#f5b400", light: "#ffffff" },
  ammofos: { bag: "from-[#f7ddd1] via-[#d2a28f] to-[#9b6b5c]", ink: "#3b1f18", accent: "#f5b400", light: "#fff1ec" },
  superfosfat: { bag: "from-[#eef8fb] via-[#b6d4df] to-[#7ca7b9]", ink: "#0f3545", accent: "#f5b400", light: "#ffffff" },
  "sulfat-kaliya": { bag: "from-[#f2a392] via-[#c3331f] to-[#7d170e]", ink: "#fff8f2", accent: "#f5b400", light: "#ffe3dd" },
  kalimagneziya: { bag: "from-[#b9f0e7] via-[#0c9b95] to-[#07656a]", ink: "#f1fffb", accent: "#f5b400", light: "#e9fffb" },
  monofosfat: { bag: "from-[#f6bad2] via-[#cc4f86] to-[#87345b]", ink: "#fff7fb", accent: "#f5b400", light: "#ffeaf3" },
  "kalievaya-selitra": { bag: "from-[#ffd891] via-[#f08b22] to-[#b65312]", ink: "#321b07", accent: "#07381d", light: "#fff2d8" },
  "sulfat-ammoniya": { bag: "from-[#eef7f9] via-[#b5cbd1] to-[#829aa1]", ink: "#10242b", accent: "#f5b400", light: "#ffffff" },
  "ammiachnaya-selitra": { bag: "from-[#eaf7ff] via-[#a9d6ec] to-[#6aa2c5]", ink: "#10324c", accent: "#f5b400", light: "#ffffff" },
  karbamid: { bag: "from-[#ffffff] via-[#cfe7f7] to-[#7eb6dd]", ink: "#0e3457", accent: "#f5b400", light: "#ffffff" },
  borofoska: { bag: "from-[#ffe78a] via-[#f2b500] to-[#c78200]", ink: "#332100", accent: "#07381d", light: "#fff5bf" },
  dolomit: { bag: "from-[#f6ead0] via-[#d5b679] to-[#9b7744]", ink: "#322411", accent: "#07381d", light: "#fff7e7" },
  zola: { bag: "from-[#b9b3a4] via-[#575248] to-[#2f2e2a]", ink: "#fff8ea", accent: "#f5b400", light: "#ece7da" }
};

export function ProductBagMockup({
  product,
  size = "md",
  className
}: {
  product: Product;
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
}) {
  const theme = themes[product.bagTheme];
  const sizes = {
    sm: "h-[180px] w-[136px]",
    md: "h-[280px] w-[210px]",
    lg: "h-[440px] w-[330px]",
    hero: "h-[300px] w-[190px]"
  };

  return (
    <div className={cn("relative mx-auto", sizes[size], className)} style={{ color: theme.ink }}>
      <div className="absolute inset-x-[8%] bottom-[-18px] h-8 rounded-full bg-black/25 blur-xl" />
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[18px] bg-gradient-to-br shadow-[0_24px_42px_rgba(37,33,24,.24)]",
          theme.bag
        )}
      >
        <div className="absolute inset-x-0 top-0 h-8 bg-white/24 shadow-inner" />
        <div className="absolute inset-x-0 top-5 h-[1px] bg-black/15" />
        <div className="absolute inset-x-4 top-2 h-2 rounded-full bg-black/10" />
        <div className="absolute bottom-0 left-0 top-0 w-8 bg-gradient-to-r from-black/22 to-transparent" />
        <div className="absolute bottom-0 right-0 top-0 w-8 bg-gradient-to-l from-white/18 to-transparent" />
        <div className="absolute inset-0 opacity-35" style={{
          background:
            "radial-gradient(circle at 20% 12%, rgba(255,255,255,.55), transparent 18%), radial-gradient(circle at 82% 42%, rgba(0,0,0,.16), transparent 22%), repeating-linear-gradient(92deg, rgba(255,255,255,.16) 0 2px, transparent 2px 18px)"
        }} />
        <div className="relative flex h-full flex-col items-center px-5 pb-5 pt-11 text-center">
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="grid h-4 w-4 place-items-center rounded-[5px]" style={{ backgroundColor: theme.accent }}>
              <span className="h-2 w-2 rounded-sm border border-current" />
            </span>
            {siteConfig.brandName}
          </div>
          <div className="mt-8 flex-1">
            <div className={cn("font-black tracking-[-0.06em]", size === "lg" ? "text-7xl" : size === "hero" ? "text-5xl" : size === "sm" ? "text-3xl" : "text-4xl")}>
              {product.bagTitle}
            </div>
            {product.formula ? <div className={cn("mt-1 font-black", size === "lg" ? "text-6xl" : size === "sm" ? "text-2xl" : "text-3xl")}>{product.formula}</div> : null}
            <div className="mx-auto mt-4 max-w-[160px] text-sm font-black uppercase leading-tight">{product.bagSubtitle}</div>
          </div>
          <div className="mb-4 grid w-full grid-cols-3 gap-2">
            {product.elements.slice(0, 3).map((element) => (
              <div key={element.symbol} className="rounded-full border border-current/35 bg-white/12 px-1 py-2 text-[9px] font-bold">
                {element.symbol}
              </div>
            ))}
          </div>
          <div className="text-sm font-black">{product.packageSize}</div>
        </div>
      </div>
    </div>
  );
}

export function ProductVisual({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <div className={cn("relative grid place-items-center rounded-[22px] bg-[#fbf5e9]", compact ? "h-48" : "h-72")}>
      <ProductBagMockup product={product} size={compact ? "sm" : "md"} />
    </div>
  );
}
