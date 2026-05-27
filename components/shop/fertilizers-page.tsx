"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, PackageCheck, Ruler, Sprout, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { formatBuyPrice } from "@/lib/cart-utils";
import { useProductsStore } from "@/components/shop/product-store";

type StageKey = "soil" | "planting" | "vegetation" | "tubers" | "before-harvest";

type StageConfig = {
  key: StageKey;
  title: string;
  description: string;
  image: string;
  hint: string;
  slugs: string[];
};

const stages: StageConfig[] = [
  {
    key: "soil",
    title: "Подготовка почвы",
    description: "Улучшение структуры и плодородия почвы",
    image: "/assets/fertilizers/decor/fertilizers-decor-shovel-soil.png",
    hint: "На подготовке почвы важно создать базовый питательный фон и скорректировать состояние участка до посадки.",
    slugs: ["npk-potato", "diammofoska", "superfosfat", "dolomite-flour"]
  },
  {
    key: "planting",
    title: "Посадка",
    description: "Стартовое питание и развитие корней",
    image: "/assets/fertilizers/decor/fertilizers-decor-potato-sprout.png",
    hint: "При посадке выбирают стартовые составы, которые помогают картофелю пройти начало роста без перегруза.",
    slugs: ["diammofoska", "npk-potato", "superfosfat", "ammofos"]
  },
  {
    key: "vegetation",
    title: "Вегетация",
    description: "Рост ботвы и развитие растения",
    image: "/assets/fertilizers/decor/fertilizers-decor-plant-soil.png",
    hint: "В период вегетации акцент делают на росте растения и аккуратной поддержке азотного питания.",
    slugs: ["ammonium-nitrate", "ammonium-sulfate", "potassium-nitrate", "npk-potato"]
  },
  {
    key: "tubers",
    title: "Клубнеобразование",
    description: "Формирование клубней и их налив",
    image: "/assets/fertilizers/decor/fertilizers-decor-potato-pile.png",
    hint: "На этапе клубнеобразования чаще смотрят в сторону калия, магния и микроэлементов для качества клубней.",
    slugs: ["kalimagnesia", "sulfate-potassium", "potassium-nitrate", "borofoska"]
  },
  {
    key: "before-harvest",
    title: "Перед уборкой",
    description: "Улучшение качества и лёжкости",
    image: "/assets/fertilizers/decor/fertilizers-decor-potato-crate.png",
    hint: "Перед уборкой важно не перегружать посадки азотом и держать фокус на качестве и хранении урожая.",
    slugs: ["sulfate-potassium", "kalimagnesia", "wood-ash", "monopotassium-phosphate"]
  }
];

const fallbackPopular = ["npk-potato", "kalimagnesia", "diammofoska", "sulfate-potassium"];

function productImage(slug: string) {
  return `/assets/products/${slug}/front.png`;
}

export function FertilizersPage() {
  const [activeStage, setActiveStage] = useState<StageKey>("planting");
  const { products } = useProductsStore();
  const selectedStage = stages.find((stage) => stage.key === activeStage) ?? stages[0];

  const recommendedProducts = useMemo(() => {
    const selected = selectedStage.slugs
      .map((slug) => products.find((product) => product.slug === slug))
      .filter((product): product is Product => Boolean(product));

    if (selected.length >= 4) return selected.slice(0, 4);

    const fallback = fallbackPopular
      .map((slug) => products.find((product) => product.slug === slug))
      .filter((product): product is Product => Boolean(product));

    return [...selected, ...fallback.filter((product) => !selected.some((item) => item.slug === product.slug))].slice(0, 4);
  }, [products, selectedStage]);

  return (
    <section className="overflow-hidden">
      <div className="container-shell py-4 md:py-6">
        <Hero />

        <section className="mt-4 rounded-[26px] border border-[#173c25]/10 bg-[#fffdf8]/68 p-3 shadow-[0_14px_40px_rgba(45,35,17,.045)] md:p-4">
          <StageSelector activeStage={activeStage} onChange={setActiveStage} />
          <RecommendedProducts products={recommendedProducts} stage={selectedStage} />
        </section>

        <HelpCta stage={selectedStage} />
        <Benefits />
      </div>
    </section>
  );
}

function Hero() {
  return (
    <div className="relative grid min-h-[330px] gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(500px,1.1fr)] lg:items-center">
      <div className="relative z-10 py-2 md:py-3">
        <span className="inline-flex rounded-[10px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#8c5b00]">
          Для картофеля
        </span>
        <h1 className="mt-3 max-w-3xl text-[38px] font-black leading-[0.94] tracking-[-0.06em] text-[#071a10] sm:text-[50px] lg:text-[58px]">
          Удобрения для картофеля по этапам выращивания
        </h1>
        <p className="mt-3 max-w-xl text-[16px] font-medium leading-[1.55] text-[#4d5a4e] sm:text-[17px]">
          Выберите задачу — мы подскажем, какие удобрения подойдут лучше всего.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-[52px] rounded-[13px] bg-[#063b23] px-7 text-white shadow-[0_18px_40px_rgba(6,59,35,.18)] hover:bg-[#0d5a36] [&_*]:text-white">
            <Link href="/products" className="text-white" style={{ color: "#fff" }}>
              Перейти в каталог <ArrowRight className="h-5 w-5 text-white" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-[52px] rounded-[13px] border-[#f5b400] bg-[#fffdf8] px-7 text-[#8c5b00] shadow-none hover:bg-[#fff4cf]">
            <Link href="/contacts">Уточнить условия</Link>
          </Button>
        </div>
      </div>

      <div className="relative z-10 -mx-3 min-h-[240px] lg:-mr-10 lg:ml-0 lg:min-h-[340px]">
        <div className="pointer-events-none absolute inset-x-12 bottom-5 h-20 rounded-full bg-[#d9c59c]/24 blur-2xl" />
        <Image
          src="/assets/fertilizers/hero/fertilizers-hero-main.png"
          alt="Удобрения KartoFert для картофеля"
          width={900}
          height={640}
          priority
          className="relative z-10 ml-auto h-auto max-h-[360px] w-full object-contain drop-shadow-[0_18px_34px_rgba(58,43,20,.12)] lg:max-h-[430px]"
        />
      </div>
    </div>
  );
}

function StageSelector({ activeStage, onChange }: { activeStage: StageKey; onChange: (stage: StageKey) => void }) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8c5b00]">Быстрый подбор</p>
          <h2 className="mt-1 text-[28px] font-black tracking-[-0.05em] text-[#102116]">Выберите этап выращивания</h2>
        </div>
      </div>

      <div className="-mx-3 flex gap-3 overflow-x-auto px-3 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
        {stages.map((stage) => {
          const active = stage.key === activeStage;
          return (
            <button
              key={stage.key}
              type="button"
              onClick={() => onChange(stage.key)}
              className={`group min-h-[158px] min-w-[184px] rounded-[18px] border p-2.5 text-left shadow-[0_12px_30px_rgba(45,35,17,.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(45,35,17,.07)] lg:min-w-0 ${
                active ? "border-[#1f7a45]/45 bg-[#f1f8eb]" : "border-[#173c25]/10 bg-white hover:border-[#f5b400]"
              }`}
            >
              <span className="relative grid h-[68px] place-items-center overflow-hidden rounded-[15px] bg-[#fbf7ec]">
                <Image src={stage.image} alt="" width={132} height={108} aria-hidden="true" className="pointer-events-none h-auto max-h-[62px] w-auto object-contain transition duration-300 group-hover:scale-105" />
              </span>
              <span className="mt-2 flex items-start gap-2">
                <span className="min-w-0">
                  <span className="block text-[15px] font-black leading-tight text-[#102116]">{stage.title}</span>
                  <span className="mt-1 block text-[12.5px] font-semibold leading-[1.35] text-[#596553]">{stage.description}</span>
                </span>
                {active ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1f7a45]" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RecommendedProducts({ products, stage }: { products: Product[]; stage: StageConfig }) {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8c5b00]">Рекомендации</p>
          <h2 className="mt-1 text-2xl font-black tracking-[-0.045em] text-[#102116] md:text-[27px]">Популярные удобрения для картофеля</h2>
          <p className="mt-1 max-w-3xl text-sm font-semibold leading-[1.55] text-[#596553]">{stage.hint}</p>
        </div>
        <Button asChild variant="outline" className="h-10 rounded-[11px] border-[#173c25]/15 bg-white text-[#063b23] shadow-none hover:bg-[#f7f1e5]">
          <Link href="/products">Смотреть все</Link>
        </Button>
      </div>

      <div className="mt-3 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <StageProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}

function StageProductCard({ product }: { product: Product }) {
  const elements = product.elements.map((element) => element.symbol).join(", ");

  return (
    <article className="group flex h-full min-h-[318px] flex-col rounded-[18px] border border-[#173c25]/10 bg-white p-3 shadow-[0_12px_34px_rgba(45,35,17,.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(45,35,17,.085)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-[132px] rounded-[16px] bg-[#f8f3e7]">
          <Image
            src={productImage(product.slug)}
            alt={product.name}
            fill
            sizes="260px"
            className="object-contain p-1.5 transition duration-300 group-hover:-translate-y-1"
          />
        </div>
        <div className="mt-2.5">
          <span className="rounded-full bg-[#eef6e9] px-2.5 py-1 text-[11px] font-black text-[#063b23]">{product.category}</span>
          <h3 className="mt-2 line-clamp-2 min-h-[38px] text-base font-black leading-tight text-[#102116]">{product.name}</h3>
          <p className="mt-1 line-clamp-1 text-sm font-bold text-[#65705e]">{elements}</p>
          <p className="mt-0.5 text-sm font-semibold text-[#7a8373]">{product.packageSize}</p>
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-2.5 pt-2.5">
        <div className="min-w-[66px]">
          <p className="text-xl font-black tracking-[-0.04em] text-[#102116]">{formatBuyPrice(product)}</p>
          <p className="text-[11px] font-semibold text-[#7a8373]">за мешок</p>
        </div>
        <div className="flex min-w-0 gap-2">
          <Button asChild variant="outline" className="h-10 rounded-[11px] border-[#063b23]/25 bg-white px-3 text-xs font-black text-[#063b23] shadow-none hover:bg-[#f3faed]">
            <Link href={`/products/${product.slug}`}>Подробнее</Link>
          </Button>
          <Button asChild className="h-10 w-10 shrink-0 rounded-[11px] bg-[#063b23] p-0 text-white shadow-none hover:bg-[#0d5a36]" aria-label={`Связаться по товару ${product.name}`}>
            <Link href="/contacts">
              <MessageCircle className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function HelpCta({ stage }: { stage: StageConfig }) {
  return (
    <section className="relative mt-4 overflow-hidden rounded-[22px] border border-[#173c25]/10 bg-[#fffdf8] p-4 shadow-[0_12px_34px_rgba(45,35,17,.04)] md:p-5">
      <Image
        src="/assets/fertilizers/decor/fertilizers-decor-potato-crate.png"
        alt=""
        width={220}
        height={160}
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 bottom-0 hidden h-auto w-28 opacity-35 md:block"
      />
      <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8c5b00]">Подбор по этапу: {stage.title}</p>
          <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#102116]">Не знаете, что выбрать?</h2>
          <p className="mt-1.5 text-sm font-semibold leading-6 text-[#596553]">
            Напишите нам — поможем подобрать удобрения под задачу, площадь и этап выращивания.
          </p>
        </div>
        <Button asChild className="h-11 rounded-[12px] bg-[#f5b400] px-6 text-[#1b1500] shadow-none hover:bg-[#e8a900]">
          <Link href="/contacts">
            Связаться <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: PackageCheck, title: "Качество и эффективность", text: "Проверенные удобрения" },
    { icon: Ruler, title: "Точная дозировка", text: "Под вашу задачу" },
    { icon: WalletCards, title: "Экономия времени и денег", text: "Правильный выбор с первого раза" },
    { icon: Sprout, title: "Поддержка агронома", text: "Поможем с подбором" }
  ];

  return (
    <section className="mt-4 grid gap-3 rounded-[20px] border border-[#173c25]/10 bg-white/72 p-3 shadow-[0_12px_34px_rgba(45,35,17,.045)] sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#fff1be] text-[#063b23]">
            <item.icon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-black text-[#102116]">{item.title}</span>
            <span className="block text-xs font-semibold text-[#65705e]">{item.text}</span>
          </span>
        </div>
      ))}
    </section>
  );
}
