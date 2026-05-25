"use client";

import { ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/shop/cart-provider";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  className,
  label = "В корзину"
}: {
  product: Product;
  className?: string;
  label?: string;
}) {
  const { addItem } = useCart();
  return (
    <Button onClick={() => addItem(product)} className={cn("bg-[#063b23] text-white hover:bg-[#0d5a36]", className)}>
      <ShoppingCart className="h-4 w-4" />
      {label}
    </Button>
  );
}
