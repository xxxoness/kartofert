import type { Metadata } from "next";
import { Suspense } from "react";
import { Calculator } from "@/components/shop/calculator";

export const metadata: Metadata = {
  title: "Калькулятор питания картофеля",
  description: "Расчёт количества удобрения для картофеля в сотках и гектарах: килограммы, мешки и стоимость."
};

export default function CalculatorPage() {
  return (
    <section className="mx-auto w-[min(1440px,calc(100%_-_32px))] py-8 md:py-10">
      <Suspense fallback={<div className="rounded-[18px] bg-white p-8 text-[#102116]">Загрузка калькулятора...</div>}>
        <Calculator />
      </Suspense>
    </section>
  );
}
