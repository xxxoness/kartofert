"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/data/products";
import { useProductsStore } from "@/components/shop/product-store";
import { canBuyProduct, productImageUrl } from "@/lib/cart-utils";

export type CartLine = {
  id?: string;
  slug: string;
  name?: string;
  image?: string;
  price?: number;
  currency?: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  getProduct: (slug: string) => Product | undefined;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "kartofert-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const { products } = useProductsStore();

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) setLines(JSON.parse(saved) as CartLine[]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const getProduct = (slug: string) => products.find((product) => product.slug === slug);
    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: lines.reduce((sum, line) => {
        const product = getProduct(line.slug);
        if (!canBuyProduct(product)) return sum;
        return sum + (product?.price ?? 0) * line.quantity;
      }, 0),
      addItem(product) {
        if (!canBuyProduct(product)) return;
        setLines((current) => {
          const existing = current.find((line) => line.slug === product.slug);
          if (existing) {
            return current.map((line) => (line.slug === product.slug ? { ...line, quantity: line.quantity + 1 } : line));
          }
          return [
            ...current,
            {
              id: product.id,
              slug: product.slug,
              name: product.name,
              image: productImageUrl(product),
              price: product.price,
              currency: product.currency ?? "BYN",
              quantity: 1
            }
          ];
        });
      },
      removeItem(slug) {
        setLines((current) => current.filter((line) => line.slug !== slug));
      },
      updateQuantity(slug, quantity) {
        setLines((current) =>
          current.map((line) => (line.slug === slug ? { ...line, quantity: Math.max(1, quantity) } : line))
        );
      },
      clearCart() {
        setLines([]);
      },
      getProduct
    };
  }, [lines, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart должен использоваться внутри CartProvider");
  return context;
}
