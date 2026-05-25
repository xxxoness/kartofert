import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calculator, CheckCircle2, ChevronRight } from "lucide-react";
import { ProductFilters } from "@/components/shop/product-filters";

export const metadata: Metadata = {
  title: "Каталог удобрений для картофеля",
  description: "Каталог KartoFert: 15 типов удобрений для картофеля, фильтры, поиск, расчёт количества и заявка."
};

export default async function ProductsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const search = typeof params.search === "string" ? params.search : "";
  const type = typeof params.type === "string" ? params.type : "";

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 grid overflow-hidden rounded-[28px] border border-[#173c25]/10 bg-[#fffdf8] p-5 shadow-[0_18px_48px_rgba(45,35,17,.06)] sm:p-6 lg:grid-cols-[45fr_55fr] lg:items-center lg:gap-8 lg:p-8">
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#66705d]">
            <Link href="/" className="hover:text-[#063b23]">Главная</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#102116]">Каталог</span>
          </div>
          <div>
            <h1 className="max-w-3xl break-words text-[34px] font-black leading-[0.98] tracking-[-0.045em] text-[#071a10] sm:text-[50px]">
              Каталог удобрений для картофеля
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-medium leading-7 text-[#4d5a4e]">
              Выберите удобрение под задачи вашего поля и получите понятный расчёт количества.
            </p>
          </div>
        </div>
        <div className="relative mt-5 h-[220px] overflow-hidden rounded-[24px] bg-[#f7f1e4] lg:mt-0 lg:h-[286px]">
          <Image
            src="/assets/hero/catalog-hero.png"
            alt="Каталог удобрений для картофеля KartoFert"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      <ProductFilters initialSearch={search} initialType={type} />

      <section className="mt-14 rounded-[28px] border border-[#173c25]/10 bg-[#fffdf8] p-6 shadow-[0_18px_48px_rgba(45,35,17,.06)] sm:p-7 lg:mt-16 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
        <div>
          <h2 className="text-[28px] font-black leading-tight tracking-[-0.045em] text-[#102116] sm:text-3xl">Нужна помощь с выбором удобрения?</h2>
          <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-[#596553]">
            Подскажем, какой тип удобрения подойдёт под вашу задачу, площадь и этап выращивания картофеля.
          </p>
          <div className="mt-5 grid gap-2.5 text-sm font-bold text-[#304633] sm:grid-cols-3">
            {["Подбор под задачу", "Расчёт количества", "Уточнение цены и наличия"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-[12px] bg-[#f7f2e8] px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-[#1f7a45]" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
          <Link href="/contacts" className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#063b23] px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(6,59,35,.16)] transition hover:bg-[#0d5a36]">
            Подобрать по задаче
          </Link>
          <Link href="/calculator" className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] border border-[#f5b400] bg-[#fffdf8] px-6 text-sm font-black text-[#8a5a00] transition hover:bg-[#fff4cf]">
            <Calculator className="h-4 w-4" />
            Рассчитать норму
          </Link>
        </div>
      </section>
    </section>
  );
}
