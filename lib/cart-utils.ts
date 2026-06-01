import type { Product } from "@/data/products";

const requestPriceLabels = ["цена уточняется", "по запросу"];

export function canBuyProduct(product?: Partial<Product> | null) {
  if (!product) return false;
  const label = String(product.priceLabel ?? "").toLowerCase();
  const mode = String(product.priceMode ?? "").toLowerCase();

  return (
    product.isPublished !== false &&
    product.inStock !== false &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    product.price > 0 &&
    mode !== "request" &&
    mode !== "hidden" &&
    !requestPriceLabels.some((requestLabel) => label.includes(requestLabel))
  );
}

export function formatBuyPrice(product: Partial<Product>) {
  if (!canBuyProduct(product)) return "Цена уточняется";
  return `${product.price!.toLocaleString("ru-RU")} ${product.currency ?? "BYN"}`;
}

export function productImageUrl(product: Partial<Product>) {
  return product.imageUrl ?? product.image ?? `/assets/products/${product.slug}/front.png`;
}
