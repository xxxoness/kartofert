"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product, products as baseProducts } from "@/data/products";

export const productStorageKey = "kartofert-products";
const productStorageEvent = "kartofert-products-updated";

const ProductsContext = createContext<Product[] | null>(null);

export type ProductOverride = Partial<Product> & { slug: string };

function readOverrides(): ProductOverride[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(productStorageKey);
    return raw ? (JSON.parse(raw) as ProductOverride[]) : [];
  } catch {
    return [];
  }
}

export function mergeProducts(overrides: ProductOverride[], sourceProducts: Product[] = baseProducts) {
  return sourceProducts.map((product) => {
    const override = overrides.find((item) => item.slug === product.slug);
    return override ? ({ ...product, ...override, slug: product.slug } as Product) : product;
  });
}

export function getStoredProducts() {
  return mergeProducts(readOverrides());
}

export function saveProductOverride(product: Product) {
  if (typeof window === "undefined") return;
  const overrides = readOverrides();
  const next = overrides.filter((item) => item.slug !== product.slug);
  next.push({
    slug: product.slug,
    name: product.name,
    shortName: product.shortName,
    category: product.category,
    fertilizerType: product.fertilizerType,
    typeGroup: product.typeGroup,
    elements: product.elements,
    price: product.price,
    packageSize: product.packageSize,
    bagWeight: product.bagWeight,
    shortDescription: product.shortDescription,
    description: product.description,
    defaultNorm: product.defaultNorm,
    normUnit: product.normUnit,
    recommendedRange: product.recommendedRange,
    inStock: product.inStock
  });
  window.localStorage.setItem(productStorageKey, JSON.stringify(next));
  window.dispatchEvent(new Event(productStorageEvent));
}

export function ProductsProvider({ children, initialProducts }: { children: React.ReactNode; initialProducts: Product[] }) {
  return <ProductsContext.Provider value={initialProducts}>{children}</ProductsContext.Provider>;
}

export function useProductsStore() {
  const contextProducts = useContext(ProductsContext);
  const sourceProducts = contextProducts?.length ? contextProducts : baseProducts;
  const [overrides, setOverrides] = useState<ProductOverride[]>([]);

  useEffect(() => {
    const refresh = () => setOverrides(readOverrides());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(productStorageEvent, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(productStorageEvent, refresh);
    };
  }, []);

  const products = useMemo(() => mergeProducts(overrides, sourceProducts), [overrides, sourceProducts]);

  return {
    products,
    getProduct: (slug: string) => products.find((product) => product.slug === slug),
    saveProduct: (product: Product) => {
      saveProductOverride(product);
      setOverrides(readOverrides());
    }
  };
}
