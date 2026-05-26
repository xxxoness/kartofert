"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Calculator, CheckCircle2, ChevronDown, Clock3, HelpCircle, Leaf, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article } from "@/data/articles";
import { cn } from "@/lib/utils";

type KnowledgeArticle = Article & {
  coverImage?: string;
  featured?: boolean;
};

type ArticleCard = {
  title: string;
  description: string;
  category: string;
  filterCategory: string;
  image: string;
  date: string;
  readTime: string;
  href: string;
};

function toArticleCard(article: KnowledgeArticle): ArticleCard {
  return {
    title: article.title,
    description: article.excerpt,
    category: article.category,
    filterCategory: article.category,
    image: article.coverImage ?? "/assets/images/knowledge-base/articles/kb-article-potato-growth-stage.png",
    date: article.date,
    readTime: article.readTime,
    href: `/knowledge/${article.slug}`
  };
}

const categories = ["Р’СЃРµ СЃС‚Р°С‚СЊРё", "РџРѕСЃР°РґРєР°", "РџРёС‚Р°РЅРёРµ", "РљР°Р»РёР№", "РћС€РёР±РєРё", "Р Р°СЃС‡С‘С‚", "РҐСЂР°РЅРµРЅРёРµ"];

const heroBenefits = [
  { icon: Sprout, label: "Р­РєСЃРїРµСЂС‚РёР·Р° Р°РіСЂРѕРЅРѕРјРѕРІ" },
  { icon: BookOpenCheck, label: "РђРєС‚СѓР°Р»СЊРЅС‹Рµ СЂРµРєРѕРјРµРЅРґР°С†РёРё" },
  { icon: CheckCircle2, label: "РџРѕРЅСЏС‚РЅРѕ Рё РїРѕ РґРµР»Сѓ" },
  { icon: Calculator, label: "РџСЂР°РєС‚РёРєР° Рё СЂР°СЃС‡С‘С‚С‹" }
];

const featuredArticle: ArticleCard = {
  category: "Р РµРєРѕРјРµРЅРґСѓРµРј",
  filterCategory: "РџРёС‚Р°РЅРёРµ",
  title: "Р’РµСЃРµРЅРЅСЏСЏ СЃС…РµРјР° РїРёС‚Р°РЅРёСЏ РєР°СЂС‚РѕС„РµР»СЏ РѕС‚ РїРѕСЃР°РґРєРё РґРѕ С†РІРµС‚РµРЅРёСЏ",
  description:
    "РџРѕС€Р°РіРѕРІР°СЏ СЃС…РµРјР° РІРЅРµСЃРµРЅРёСЏ СѓРґРѕР±СЂРµРЅРёР№ РїРѕ С„Р°Р·Р°Рј СЂРѕСЃС‚Р°: РєР°РєРёРµ СЌР»РµРјРµРЅС‚С‹ РІР°Р¶РЅС‹ РЅР° СЃС‚Р°СЂС‚Рµ, Р° РєР°РєРёРµ вЂ” РІ РїРµСЂРёРѕРґ Р±СѓС‚РѕРЅРёР·Р°С†РёРё Рё С†РІРµС‚РµРЅРёСЏ.",
  image: "/assets/images/knowledge-base/articles/kb-article-potato-growth-stage.png",
  date: "16 РјР°СЏ 2026",
  readTime: "9 РјРёРЅСѓС‚",
  href: "/knowledge/kakie-udobreniya-nuzhny-kartofelyu-vesnoy"
};

const articleCards: ArticleCard[] = [
  {
    category: "РџРёС‚Р°РЅРёРµ",
    filterCategory: "РџРёС‚Р°РЅРёРµ",
    title: "РљР°Р»РёР№ РґР»СЏ РєР°СЂС‚РѕС„РµР»СЏ: СЂРѕР»СЊ, РёСЃС‚РѕС‡РЅРёРєРё Рё РїСЂРёР·РЅР°РєРё РґРµС„РёС†РёС‚Р°",
    description: "Р Р°Р·Р±РёСЂР°РµРј, РєР°Рє РєР°Р»РёР№ РІР»РёСЏРµС‚ РЅР° СЂР°Р·РјРµСЂ РєР»СѓР±РЅРµР№, РєР°С‡РµСЃС‚РІРѕ СѓСЂРѕР¶Р°СЏ Рё С…СЂР°РЅРµРЅРёРµ.",
    image: "/assets/images/knowledge-base/articles/kb-article-potato-leaves-healthy.png",
    date: "12 РјР°СЏ 2026",
    readTime: "7 РјРёРЅСѓС‚",
    href: "/knowledge/kaliy-dlya-kartofelya"
  },
  {
    category: "РђР·РѕС‚",
    filterCategory: "РџРёС‚Р°РЅРёРµ",
    title: "РЎСѓР»СЊС„Р°С‚ Р°РјРјРѕРЅРёСЏ: РєРѕРіРґР° Рё РєР°Рє РїСЂР°РІРёР»СЊРЅРѕ РІРЅРѕСЃРёС‚СЊ",
    description: "РљРѕРіРґР° СЃСѓР»СЊС„Р°С‚ Р°РјРјРѕРЅРёСЏ РїРѕР»РµР·РµРЅ, Р° РєРѕРіРґР° РјРѕР¶РµС‚ РЅР°РІСЂРµРґРёС‚СЊ СЃС…РµРјРµ РїРёС‚Р°РЅРёСЏ.",
    image: "/assets/images/knowledge-base/articles/kb-article-fertilizer-granules.png",
    date: "10 РјР°СЏ 2026",
    readTime: "6 РјРёРЅСѓС‚",
    href: "/knowledge/sulfat-ammoniya-dlya-kartofelya"
  },
  {
    category: "РџРѕСЃР°РґРєР°",
    filterCategory: "РџРѕСЃР°РґРєР°",
    title: "Р§С‚Рѕ РІРЅРµСЃС‚Рё РїСЂРё РїРѕСЃР°РґРєРµ: NPK, Р·РѕР»Р° РёР»Рё СЃСѓР»СЊС„Р°С‚ РєР°Р»РёСЏ?",
    description: "РЎСЂР°РІРЅРёРІР°РµРј РїРѕРїСѓР»СЏСЂРЅС‹Рµ РІР°СЂРёР°РЅС‚С‹ РІРЅРµСЃРµРЅРёСЏ РїСЂРё РїРѕСЃР°РґРєРµ Рё РѕР±СЉСЏСЃРЅСЏРµРј, С‡С‚Рѕ РІС‹Р±СЂР°С‚СЊ.",
    image: "/assets/images/knowledge-base/articles/kb-article-potato-sprouting-tubers.png",
    date: "8 РјР°СЏ 2026",
    readTime: "7 РјРёРЅСѓС‚",
    href: "/knowledge/chto-vnesti-pri-posadke-kartofelya"
  },
  {
    category: "РћС€РёР±РєРё",
    filterCategory: "РћС€РёР±РєРё",
    title: "РџРѕС‡РµРјСѓ РєР°СЂС‚РѕС„РµР»СЊ СѓС…РѕРґРёС‚ РІ Р±РѕС‚РІСѓ, Р° РєР»СѓР±РЅРµР№ РјР°Р»Рѕ",
    description: "Р§Р°СЃС‚С‹Рµ РїСЂРёС‡РёРЅС‹: РёР·Р±С‹С‚РѕРє Р°Р·РѕС‚Р°, РїРѕР·РґРЅРёРµ РїРѕРґРєРѕСЂРјРєРё Рё РѕС‚СЃСѓС‚СЃС‚РІРёРµ РєР°Р»РёР№РЅРѕРіРѕ Р±Р°Р»Р°РЅСЃР°.",
    image: "/assets/images/knowledge-base/articles/kb-article-potato-leaf-deficiency.png",
    date: "6 РјР°СЏ 2026",
    readTime: "6 РјРёРЅСѓС‚",
    href: "/knowledge/pochemu-kartofel-uhodit-v-botvu"
  },
  {
    category: "Р Р°СЃС‡С‘С‚",
    filterCategory: "Р Р°СЃС‡С‘С‚",
    title: "РљР°Рє СЂР°СЃСЃС‡РёС‚Р°С‚СЊ СѓРґРѕР±СЂРµРЅРёСЏ РґР»СЏ РєР°СЂС‚РѕС„РµР»СЏ РЅР° СЃРѕС‚РєРё Рё РіРµРєС‚Р°СЂС‹",
    description: "РџРѕРєР°Р·С‹РІР°РµРј РїСЂРѕСЃС‚СѓСЋ Р»РѕРіРёРєСѓ СЂР°СЃС‡С‘С‚Р°: РїР»РѕС‰Р°РґСЊ, РЅРѕСЂРјР°, РєРёР»РѕРіСЂР°РјРјС‹, РјРµС€РєРё Рё СЃС‚РѕРёРјРѕСЃС‚СЊ.",
    image: "/assets/images/knowledge-base/tools/kb-tool-fertilizer-calculator.png",
    date: "4 РјР°СЏ 2026",
    readTime: "8 РјРёРЅСѓС‚",
    href: "/knowledge/kak-rasschitat-udobreniya-na-sotki-i-gektary"
  },
  {
    category: "РҐСЂР°РЅРµРЅРёРµ",
    filterCategory: "РҐСЂР°РЅРµРЅРёРµ",
    title: "РљР°Рє РїРѕРґРіРѕС‚РѕРІРёС‚СЊ РєР»СѓР±РЅРё Рє С…СЂР°РЅРµРЅРёСЋ Рё СЃРѕС…СЂР°РЅРёС‚СЊ РєР°С‡РµСЃС‚РІРѕ",
    description: "Р§С‚Рѕ РІР»РёСЏРµС‚ РЅР° Р»С‘Р¶РєРѕСЃС‚СЊ РєР»СѓР±РЅРµР№ РїРѕСЃР»Рµ СѓР±РѕСЂРєРё Рё РєР°Рє СѓРјРµРЅСЊС€РёС‚СЊ РїРѕС‚РµСЂРё РїСЂРё С…СЂР°РЅРµРЅРёРё.",
    image: "/assets/images/knowledge-base/articles/kb-article-potato-storage-crate.png",
    date: "2 РјР°СЏ 2026",
    readTime: "6 РјРёРЅСѓС‚",
    href: "/knowledge/kak-podgotovit-klubni-k-hraneniyu"
  }
];

const utilityCards = [
  {
    title: "РџРѕРїСѓР»СЏСЂРЅС‹Рµ СЂСѓРєРѕРІРѕРґСЃС‚РІР°",
    text: "РџРѕС€Р°РіРѕРІС‹Рµ РіР°Р№РґС‹ Рё СЃС…РµРјС‹ РїРёС‚Р°РЅРёСЏ РєР°СЂС‚РѕС„РµР»СЏ РґР»СЏ СЂР°Р·РЅС‹С… СѓСЃР»РѕРІРёР№ Рё С‚РёРїРѕРІ РїРѕС‡РІ.",
    image: "/assets/images/knowledge-base/guides/kb-guide-book-cover.png",
    href: "/knowledge",
    cta: "РЎРјРѕС‚СЂРµС‚СЊ СЂСѓРєРѕРІРѕРґСЃС‚РІР°",
    icon: BookOpenCheck
  },
  {
    title: "Р’РѕРїСЂРѕСЃС‹ Рё РѕС‚РІРµС‚С‹",
    text: "РћС‚РІРµС‚С‹ РЅР° С‡Р°СЃС‚С‹Рµ РІРѕРїСЂРѕСЃС‹ РїРѕ СѓРґРѕР±СЂРµРЅРёСЏРј, РґРѕР·РёСЂРѕРІРєР°Рј Рё СЃРѕРІРјРµСЃС‚РёРјРѕСЃС‚Рё.",
    image: "/assets/images/knowledge-base/cards/kb-card-qa-support.png",
    href: "/faq",
    cta: "РџРµСЂРµР№С‚Рё РІ СЂР°Р·РґРµР»",
    icon: HelpCircle
  },
  {
    title: "РљР°Р»СЊРєСѓР»СЏС‚РѕСЂ СѓРґРѕР±СЂРµРЅРёР№",
    text: "Р Р°СЃСЃС‡РёС‚Р°Р№С‚Рµ РЅРѕСЂРјСѓ РІРЅРµСЃРµРЅРёСЏ СѓРґРѕР±СЂРµРЅРёР№ РїРѕРґ РІР°С€ СѓС‡Р°СЃС‚РѕРє Р·Р° РїР°СЂСѓ РјРёРЅСѓС‚.",
    image: "/assets/images/knowledge-base/tools/kb-tool-fertilizer-calculator.png",
    href: "/calculator",
    cta: "Р Р°СЃСЃС‡РёС‚Р°С‚СЊ РЅРѕСЂРјСѓ",
    icon: Calculator
  }
];

export function KnowledgeBasePage({ articles }: { articles?: KnowledgeArticle[] }) {
  const [activeCategory, setActiveCategory] = useState("Р’СЃРµ СЃС‚Р°С‚СЊРё");
  const cards = useMemo(() => (articles?.length ? articles.map(toArticleCard) : articleCards), [articles]);
  const featured = useMemo(() => (articles?.length ? articles.find((article) => article.featured) : null), [articles]);
  const activeFeatured = featured ? toArticleCard(featured) : featuredArticle;

  const visibleFeatured = activeCategory === "Р’СЃРµ СЃС‚Р°С‚СЊРё" || activeFeatured.filterCategory === activeCategory;
  const filteredArticles = useMemo(() => {
    const source = cards.filter((article) => article.href !== activeFeatured.href);
    if (activeCategory === "Р’СЃРµ СЃС‚Р°С‚СЊРё") return source;
    return source.filter((article) => article.filterCategory === activeCategory);
  }, [activeCategory, cards, activeFeatured.href]);

  return (
    <main className="overflow-hidden bg-[#fbf7ec] text-[#102116]">
      <section className="relative border-b border-[#173c25]/8 bg-[#fffaf0]">
        <div className="container-shell grid min-h-[520px] items-center gap-8 py-10 md:grid-cols-[0.9fr_1.1fr] md:py-12 lg:min-h-[600px]">
          <div className="relative z-10 max-w-[690px]">
            <span className="inline-flex rounded-[10px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#8c5b00]">
              Р‘Р°Р·Р° Р·РЅР°РЅРёР№
            </span>
            <h1 className="mt-5 text-[42px] font-black leading-[0.98] tracking-[-0.058em] text-[#063b23] md:text-[62px] lg:text-[70px]">
              РџСЂР°РєС‚РёС‡РµСЃРєРёРµ СЃС‚Р°С‚СЊРё РїРѕ СѓРґРѕР±СЂРµРЅРёСЏРј РґР»СЏ РєР°СЂС‚РѕС„РµР»СЏ
            </h1>
            <p className="mt-5 max-w-[620px] text-base font-medium leading-7 text-[#3f493a] md:text-lg md:leading-8">
              РџСЂРѕРІРµСЂРµРЅРЅС‹Рµ СЂРµРєРѕРјРµРЅРґР°С†РёРё РїРѕ РїРёС‚Р°РЅРёСЋ РєР°СЂС‚РѕС„РµР»СЏ РЅР° РєР°Р¶РґРѕРј СЌС‚Р°РїРµ вЂ” РѕС‚ РїРѕСЃР°РґРєРё РґРѕ С…СЂР°РЅРµРЅРёСЏ. Р Р°Р·Р±РёСЂР°РµРј СЃРѕСЃС‚Р°РІ СѓРґРѕР±СЂРµРЅРёР№, СЃС…РµРјС‹ РІРЅРµСЃРµРЅРёСЏ, РѕС€РёР±РєРё Рё СЂРµР°Р»СЊРЅС‹Рµ СЂРµР·СѓР»СЊС‚Р°С‚С‹.
            </p>
            <div className="mt-7 grid max-w-[620px] gap-2 rounded-[16px] border border-[#173c25]/10 bg-white/88 p-3 shadow-[0_18px_46px_rgba(45,35,17,.07)] sm:grid-cols-2 lg:grid-cols-4">
              {heroBenefits.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-[12px] bg-[#fffdf7] px-3 py-3 text-xs font-black leading-4 text-[#173c25]">
                  <Icon className="h-5 w-5 shrink-0 text-[#1f7a45]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[300px] md:min-h-[520px]">
            <div className="absolute inset-y-0 -right-[12%] w-[118%] rounded-l-[44px] bg-[#f4ead2]" />
            <Image
              src="/assets/images/knowledge-base/hero/kb-hero-main.png"
              alt="РџСЂР°РєС‚РёС‡РµСЃРєРёРµ РјР°С‚РµСЂРёР°Р»С‹ РїРѕ РїРёС‚Р°РЅРёСЋ РєР°СЂС‚РѕС„РµР»СЏ"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover object-center md:object-[58%_50%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#fffaf0_0%,rgba(255,250,240,.78)_18%,rgba(255,250,240,.22)_45%,rgba(255,250,240,0)_72%)] md:-left-[18%]" />
          </div>
        </div>
      </section>

      <section className="container-shell py-6 md:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "flex h-11 shrink-0 items-center gap-2 rounded-[13px] border px-4 text-sm font-black shadow-[0_10px_24px_rgba(45,35,17,.04)] transition",
                  activeCategory === category
                    ? "border-[#063b23] bg-[#063b23] text-white"
                    : "border-[#173c25]/10 bg-white text-[#25372a] hover:border-[#f5b400]/70 hover:bg-[#fff9e8]"
                )}
              >
                {category === "Р’СЃРµ СЃС‚Р°С‚СЊРё" && <Leaf className="h-4 w-4" />}
                {category}
              </button>
            ))}
          </div>
          <button className="inline-flex h-11 w-fit items-center gap-3 rounded-[13px] border border-[#173c25]/10 bg-white px-4 text-sm font-black text-[#25372a] shadow-[0_10px_24px_rgba(45,35,17,.04)]">
            РЎРЅР°С‡Р°Р»Р° РЅРѕРІС‹Рµ
            <ChevronDown className="h-4 w-4 text-[#6b735f]" />
          </button>
        </div>
      </section>

      <section className="container-shell pb-8 md:pb-12">
        {filteredArticles.length === 0 && !visibleFeatured ? (
          <div className="rounded-[22px] border border-[#173c25]/10 bg-white p-8 text-center shadow-[0_18px_46px_rgba(45,35,17,.06)]">
            <h2 className="text-2xl font-black text-[#071a10]">РњР°С‚РµСЂРёР°Р»С‹ СЃРєРѕСЂРѕ РїРѕСЏРІСЏС‚СЃСЏ</h2>
            <p className="mt-2 text-sm text-[#66705f]">Р’С‹Р±РµСЂРёС‚Рµ РґСЂСѓРіСѓСЋ РєР°С‚РµРіРѕСЂРёСЋ РёР»Рё РІРµСЂРЅРёС‚РµСЃСЊ РєРѕ РІСЃРµРј СЃС‚Р°С‚СЊСЏРј.</p>
          </div>
        ) : (
          <div className={cn("grid gap-5", visibleFeatured && "xl:grid-cols-[1.05fr_2fr]")}>
            {visibleFeatured && <FeaturedCard article={activeFeatured} />}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleTile key={article.title} article={article} />
              ))}
            </div>
          </div>
        )}
        <div className="mt-7 flex justify-center">
          <Button variant="outline" className="h-11 rounded-[12px] border-[#173c25]/12 bg-white px-8 font-black text-[#102116] hover:bg-[#fff6d8]">
            РџРѕРєР°Р·Р°С‚СЊ РµС‰С‘ СЃС‚Р°С‚СЊРё
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="container-shell py-8 md:py-10">
        <div className="grid overflow-hidden rounded-[24px] border border-[#173c25]/10 bg-white shadow-[0_22px_58px_rgba(45,35,17,.08)] lg:grid-cols-3">
          {utilityCards.map(({ icon: Icon, ...card }) => (
            <Link key={card.title} href={card.href} className="group relative min-h-[190px] overflow-hidden border-b border-[#173c25]/10 p-6 transition hover:bg-[#fff9e8] lg:border-b-0 lg:border-r last:lg:border-r-0">
              <div className="relative z-10 max-w-[260px]">
                <Icon className="h-6 w-6 text-[#1f7a45]" />
                <h3 className="mt-4 text-xl font-black tracking-[-0.035em] text-[#071a10]">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5d685a]">{card.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-white px-4 py-2 text-sm font-black text-[#063b23] shadow-[0_10px_24px_rgba(45,35,17,.06)]">
                  {card.cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
              <Image src={card.image} alt="" width={150} height={130} aria-hidden="true" className="pointer-events-none absolute bottom-2 right-3 h-[120px] w-[140px] object-contain opacity-95 transition group-hover:scale-105" />
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell pb-14 pt-6 md:pb-16 md:pt-8">
        <div className="rounded-[28px] border border-[#173c25]/10 bg-[#eef7e8] p-6 shadow-[0_20px_54px_rgba(45,35,17,.06)] md:p-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">РџРѕРґР±РѕСЂ СЃС…РµРјС‹</span>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-[#071a10] md:text-4xl">
                РќРµ Р·РЅР°РµС‚Рµ, СЃ С‡РµРіРѕ РЅР°С‡Р°С‚СЊ?
              </h2>
              <p className="mt-3 text-base leading-7 text-[#5b6657]">
                РџРµСЂРµР№РґРёС‚Рµ РІ РєР°Р»СЊРєСѓР»СЏС‚РѕСЂ, СѓРєР°Р¶РёС‚Рµ РїР»РѕС‰Р°РґСЊ СѓС‡Р°СЃС‚РєР° Рё РїРѕР»СѓС‡РёС‚Рµ РїРѕРЅСЏС‚РЅСѓСЋ СЃС…РµРјСѓ РїРёС‚Р°РЅРёСЏ РєР°СЂС‚РѕС„РµР»СЏ.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
              <Button asChild className="h-12 rounded-[12px] bg-[#063b23] px-6 font-black text-white hover:bg-[#0d5a36] [&_*]:text-white" style={{ color: "#fff" }}>
                <Link href="/calculator">
                  РџРµСЂРµР№С‚Рё РІ РєР°Р»СЊРєСѓР»СЏС‚РѕСЂ
                  <ArrowRight className="h-5 w-5 text-white" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-[12px] border-[#f5b400] bg-white px-6 font-black text-[#102116] hover:bg-[#fff6d8]">
                <Link href="/products">РЎРјРѕС‚СЂРµС‚СЊ РєР°С‚Р°Р»РѕРі</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeaturedCard({ article }: { article: ArticleCard }) {
  return (
    <Link href={article.href} className="group overflow-hidden rounded-[22px] border border-[#173c25]/10 bg-white shadow-[0_22px_58px_rgba(45,35,17,.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(45,35,17,.12)]">
      <div className="relative h-[360px] overflow-hidden">
        <Image src={article.image} alt={article.title} fill sizes="(max-width: 1280px) 100vw, 36vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-5 top-5 rounded-[10px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-[#8c5b00]">
          Р РµРєРѕРјРµРЅРґСѓРµРј
        </span>
      </div>
      <div className="p-6">
        <h2 className="text-3xl font-black leading-[1.05] tracking-[-0.045em] text-[#071a10]">{article.title}</h2>
        <p className="mt-4 text-sm leading-7 text-[#5d685a]">{article.description}</p>
        <ArticleMeta article={article} className="mt-5" />
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#063b23]">
          Р§РёС‚Р°С‚СЊ СЃС‚Р°С‚СЊСЋ
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function ArticleTile({ article }: { article: ArticleCard }) {
  return (
    <Link href={article.href} className="group flex min-h-[360px] flex-col overflow-hidden rounded-[18px] border border-[#173c25]/10 bg-white shadow-[0_16px_42px_rgba(45,35,17,.06)] transition hover:-translate-y-1 hover:border-[#f5b400]/70 hover:shadow-[0_20px_52px_rgba(45,35,17,.1)]">
      <div className="relative h-[160px] overflow-hidden">
        <Image src={article.image} alt={article.title} fill sizes="(max-width: 768px) 100vw, 28vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute bottom-3 left-3 rounded-[9px] bg-[#fff1be] px-3 py-1 text-xs font-black text-[#8c5b00]">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-3 text-xl font-black leading-[1.15] tracking-[-0.035em] text-[#071a10]">{article.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#5d685a]">{article.description}</p>
        <div className="mt-auto pt-5">
          <ArticleMeta article={article} />
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#063b23]">
            Р§РёС‚Р°С‚СЊ
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArticleMeta({ article, className }: { article: ArticleCard; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 text-xs font-bold text-[#7a8374]", className)}>
      <span>{article.date}</span>
      <span className="inline-flex items-center gap-1">
        <Clock3 className="h-3.5 w-3.5" />
        {article.readTime}
      </span>
    </div>
  );
}
