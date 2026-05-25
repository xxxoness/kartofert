import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/shop/payment-success";

export const metadata: Metadata = {
  title: "Оплата заказа",
  description: "Оплата заказа и успешное оформление покупки в магазине KartoFert."
};

export default function PaymentSuccessPage() {
  return (
    <section className="mx-auto w-[min(1280px,calc(100%_-_32px))] py-8 md:py-10">
      <PaymentSuccess />
    </section>
  );
}
