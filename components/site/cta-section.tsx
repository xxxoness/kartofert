import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CTASectionProps = {
  title?: string;
  text?: string;
  catalog?: boolean;
};

export function CTASection({
  title = "Получите программу питания под вашу культуру",
  text = "Опишите культуру, площадь и цель урожайности. Мы предложим продукты, нормы внесения и удобный график поставки по Беларуси.",
  catalog = false
}: CTASectionProps) {
  return (
    <section className="container-shell py-16">
      <div className="grain-layer overflow-hidden rounded-[8px] border border-emerald-200/18 bg-[linear-gradient(135deg,rgba(31,80,52,.92),rgba(9,16,11,.96)_55%,rgba(143,104,47,.48))] p-8 md:p-12">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Badge variant="amber" className="mb-4">
              Консультация агронома
            </Badge>
            <h2 className="text-balance text-3xl font-semibold text-white md:text-5xl">{title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-50/78">{text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button asChild size="lg">
              <Link href="/contacts">
                Получить консультацию
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {catalog ? (
              <Button asChild size="lg" variant="secondary">
                <Link href="/products">
                  <Download className="h-4 w-4" />
                  Скачать каталог
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="secondary">
                <Link href="/contacts">Уточнить условия</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
