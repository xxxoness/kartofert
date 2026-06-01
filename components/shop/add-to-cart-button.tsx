"use client";

import { ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/shop/cart-provider";
import { trackAnalyticsEvent } from "@/components/site/analytics-tracker";
import { canBuyProduct } from "@/lib/cart-utils";
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
  if (!canBuyProduct(product)) return null;

  return (
    <Button
      onClick={() => {
        addItem(product);
        void trackAnalyticsEvent({
          eventName: "add_to_cart",
          productSlug: product.slug,
          payload: {
            product_id: product.id ?? product.slug,
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity: 1,
            total: product.price ?? 0,
            source: "product_button"
          },
          requireConsent: false
        });
      }}
      className={cn("bg-[#063b23] text-white hover:bg-[#0d5a36]", className)}
    >
      <ShoppingCart className="h-4 w-4" />
      {label}
    </Button>
  );
}
