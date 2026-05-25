import type { Metadata } from "next";
import { CartPage } from "@/components/shop/cart-page";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Корзина KartoFert: список удобрений, количество, итог и переход к оформлению заказа."
};

export default function CartRoutePage() {
  return (
    <section>
      <CartPage />
    </section>
  );
}
