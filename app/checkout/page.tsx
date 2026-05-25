import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CheckoutForm } from "@/components/shop/checkout-form";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Оформление заказа и переход к оплате в интернет-магазине KartoFert."
};

export default function CheckoutPage() {
  return (
    <section className="mx-auto w-[min(1280px,calc(100%_-_32px))] py-8 md:py-10">
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#66705d]">
        <Link href="/" className="hover:text-[#063b23]">Главная</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/cart" className="hover:text-[#063b23]">Корзина</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#102116]">Оформление заказа</span>
      </nav>

      <div className="mb-6 max-w-3xl">
        <h1 className="text-[38px] font-black leading-none tracking-[-0.055em] text-[#071a10] md:text-[54px]">Оформление заказа</h1>
        <p className="mt-3 text-lg leading-8 text-[#4d5a4e]">Проверьте товары, укажите данные доставки и перейдите к оплате.</p>
      </div>

      <CheckoutForm />
    </section>
  );
}
