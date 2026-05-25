import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, PackageSearch, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shop/logo";

export const metadata: Metadata = {
  title: "О магазине",
  description: "KartoFert — интернет-магазин удобрений для картофеля с каталогом, расчётом количества и заявкой."
};

export default function AboutPage() {
  const items = [
    [PackageSearch, "Понятный каталог", "15 типов удобрений для картофеля без лишнего шума."],
    [Calculator, "Расчёт количества", "Сотки, гектары, килограммы, мешки и стоимость."],
    [Truck, "Доставка по Беларуси", "Согласование поставки для участка и хозяйства."],
    [ShieldCheck, "Честное предупреждение", "Нормы сверяются с инструкцией производителя и условиями почвы."]
  ] as const;

  return (
    <section className="container-shell py-10 md:py-14">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Logo />
          <h1 className="mt-8 text-[40px] font-black leading-[1] tracking-[-0.06em] text-[#071a10] md:text-[62px]">
            KartoFert — магазин удобрений для картофеля
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#4d5a4e]">
            Мы не лаборатория и не завод. Сайт помогает выбрать тип удобрения, понять назначение, рассчитать количество и оставить заявку менеджеру.
          </p>
          <Button asChild className="mt-7 rounded-[10px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
            <Link href="/products">Открыть каталог</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(([Icon, title, text]) => (
            <div key={title} className="rounded-[18px] border border-[#173c25]/10 bg-white p-6 shadow-[0_18px_48px_rgba(45,35,17,.08)]">
              <Icon className="h-7 w-7 text-[#1f7a45]" />
              <h2 className="mt-4 text-xl font-black text-[#102116]">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#5e6858]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
