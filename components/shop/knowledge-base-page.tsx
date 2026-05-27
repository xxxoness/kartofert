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
  id?: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  filterCategory: string;
  image: string;
  date: string;
  readTime: string;
  href: string;
  featured?: boolean;
};

function toArticleCard(article: KnowledgeArticle): ArticleCard {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.excerpt,
    category: article.category,
    filterCategory: article.category,
    image: article.coverImage ?? "/assets/images/knowledge-base/articles/kb-article-potato-growth-stage.png",
    date: article.date,
    readTime: article.readTime,
    href: `/knowledge/${article.slug}`,
    featured: article.featured
  };
}

function uniqueCardsBySlug(cards: ArticleCard[]) {
  const seen = new Set<string>();
  return cards.filter((card) => {
    if (seen.has(card.slug)) return false;
    seen.add(card.slug);
    return true;
  });
}

const categories = ["Все статьи", "Посадка", "Питание", "Калий", "Ошибки", "Расчёт", "Хранение"];

const heroBenefits = [
  { icon: Sprout, label: "Экспертиза агрономов" },
  { icon: BookOpenCheck, label: "Актуальные рекомендации" },
  { icon: CheckCircle2, label: "Понятно и по делу" },
  { icon: Calculator, label: "Практика и расчёты" }
];

const articleCards: ArticleCard[] = [
  {
    slug: "kaliy-dlya-kartofelya",
    category: "Питание",
    filterCategory: "Питание",
    title: "Калий для картофеля: роль, источники и признаки дефицита",
    description: "Разбираем, как калий влияет на размер клубней, качество урожая и хранение.",
    image: "/assets/images/knowledge-base/articles/kb-article-potato-leaves-healthy.png",
    date: "12 мая 2026",
    readTime: "7 минут",
    href: "/knowledge/kaliy-dlya-kartofelya"
  },
  {
    slug: "sulfat-ammoniya-dlya-kartofelya",
    category: "Азот",
    filterCategory: "Питание",
    title: "Сульфат аммония: когда и как правильно вносить",
    description: "Когда сульфат аммония полезен, а когда может навредить схеме питания.",
    image: "/assets/images/knowledge-base/articles/kb-article-fertilizer-granules.png",
    date: "10 мая 2026",
    readTime: "6 минут",
    href: "/knowledge/sulfat-ammoniya-dlya-kartofelya"
  },
  {
    slug: "chto-vnesti-pri-posadke-kartofelya",
    category: "Посадка",
    filterCategory: "Посадка",
    title: "Что внести при посадке: NPK, зола или сульфат калия?",
    description: "Сравниваем популярные варианты внесения при посадке и объясняем, что выбрать.",
    image: "/assets/images/knowledge-base/articles/kb-article-potato-sprouting-tubers.png",
    date: "8 мая 2026",
    readTime: "7 минут",
    href: "/knowledge/chto-vnesti-pri-posadke-kartofelya"
  },
  {
    slug: "pochemu-kartofel-uhodit-v-botvu",
    category: "Ошибки",
    filterCategory: "Ошибки",
    title: "Почему картофель уходит в ботву, а клубней мало",
    description: "Частые причины: избыток азота, поздние подкормки и отсутствие калийного баланса.",
    image: "/assets/images/knowledge-base/articles/kb-article-potato-leaf-deficiency.png",
    date: "6 мая 2026",
    readTime: "6 минут",
    href: "/knowledge/pochemu-kartofel-uhodit-v-botvu"
  },
  {
    slug: "kak-rasschitat-udobreniya-na-sotki-i-gektary",
    category: "Расчёт",
    filterCategory: "Расчёт",
    title: "Как рассчитать удобрения для картофеля на сотки и гектары",
    description: "Показываем простую логику расчёта: площадь, норма, килограммы, мешки и стоимость.",
    image: "/assets/images/knowledge-base/tools/kb-tool-fertilizer-calculator.png",
    date: "4 мая 2026",
    readTime: "8 минут",
    href: "/knowledge/kak-rasschitat-udobreniya-na-sotki-i-gektary"
  },
  {
    slug: "kak-podgotovit-klubni-k-hraneniyu",
    category: "Хранение",
    filterCategory: "Хранение",
    title: "Как подготовить клубни к хранению и сохранить качество",
    description: "Что влияет на лёжкость клубней после уборки и как уменьшить потери при хранении.",
    image: "/assets/images/knowledge-base/articles/kb-article-potato-storage-crate.png",
    date: "2 мая 2026",
    readTime: "6 минут",
    href: "/knowledge/kak-podgotovit-klubni-k-hraneniyu"
  }
];

const utilityCards = [
  {
    title: "Популярные руководства",
    text: "Пошаговые гайды и схемы питания картофеля для разных условий и типов почв.",
    image: "/assets/images/knowledge-base/guides/kb-guide-book-cover.png",
    href: "/knowledge",
    cta: "Смотреть руководства",
    icon: BookOpenCheck
  },
  {
    title: "Вопросы и ответы",
    text: "Ответы на частые вопросы по удобрениям, дозировкам и совместимости.",
    image: "/assets/images/knowledge-base/cards/kb-card-qa-support.png",
    href: "/faq",
    cta: "Перейти в раздел",
    icon: HelpCircle
  },
  {
    title: "Помощь с расчётом",
    text: "Подскажем, как оценить потребность удобрений под ваш участок.",
    image: "/assets/images/knowledge-base/tools/kb-tool-fertilizer-calculator.png",
    href: "/contacts",
    cta: "Связаться",
    icon: Calculator
  }
];

export function KnowledgeBasePage({ articles }: { articles?: KnowledgeArticle[] }) {
  const [activeCategory, setActiveCategory] = useState("Все статьи");
  const cards = useMemo(() => uniqueCardsBySlug(articles?.length ? articles.map(toArticleCard) : articleCards), [articles]);
  const activeFeatured = useMemo(() => cards.find((article) => article.featured) ?? null, [cards]);

  const visibleFeatured = Boolean(activeFeatured) && (activeCategory === "Все статьи" || activeFeatured?.filterCategory === activeCategory);
  const filteredArticles = useMemo(() => {
    const source = activeFeatured ? cards.filter((article) => article.slug !== activeFeatured.slug) : cards;
    if (activeCategory === "Все статьи") return source;
    return source.filter((article) => article.filterCategory === activeCategory);
  }, [activeCategory, cards, activeFeatured]);

  return (
    <main className="overflow-hidden bg-[#fbf7ec] text-[#102116]">
      <section className="relative border-b border-[#173c25]/8 bg-[#fffaf0]">
        <div className="container-shell grid min-h-[520px] items-center gap-8 py-10 md:grid-cols-[0.9fr_1.1fr] md:py-12 lg:min-h-[600px]">
          <div className="relative z-10 max-w-[690px]">
            <span className="inline-flex rounded-[10px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#8c5b00]">
              База знаний
            </span>
            <h1 className="mt-5 text-[42px] font-black leading-[0.98] tracking-[-0.058em] text-[#063b23] md:text-[62px] lg:text-[70px]">
              Практические статьи по удобрениям для картофеля
            </h1>
            <p className="mt-5 max-w-[620px] text-base font-medium leading-7 text-[#3f493a] md:text-lg md:leading-8">
              Проверенные рекомендации по питанию картофеля на каждом этапе — от посадки до хранения. Разбираем состав удобрений, схемы внесения, ошибки и реальные результаты.
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
              alt="Практические материалы по питанию картофеля"
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
                {category === "Все статьи" && <Leaf className="h-4 w-4" />}
                {category}
              </button>
            ))}
          </div>
          <button className="inline-flex h-11 w-fit items-center gap-3 rounded-[13px] border border-[#173c25]/10 bg-white px-4 text-sm font-black text-[#25372a] shadow-[0_10px_24px_rgba(45,35,17,.04)]">
            Сначала новые
            <ChevronDown className="h-4 w-4 text-[#6b735f]" />
          </button>
        </div>
      </section>

      <section className="container-shell pb-8 md:pb-12">
        {filteredArticles.length === 0 && !visibleFeatured ? (
          <div className="rounded-[22px] border border-[#173c25]/10 bg-white p-8 text-center shadow-[0_18px_46px_rgba(45,35,17,.06)]">
            <h2 className="text-2xl font-black text-[#071a10]">Материалы скоро появятся</h2>
            <p className="mt-2 text-sm text-[#66705f]">Выберите другую категорию или вернитесь ко всем статьям.</p>
          </div>
        ) : (
          <div className={cn("grid gap-5", visibleFeatured && "xl:grid-cols-[1.05fr_2fr]")}>
            {visibleFeatured && activeFeatured && <FeaturedCard article={activeFeatured} />}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleTile key={article.title} article={article} />
              ))}
            </div>
          </div>
        )}
        <div className="mt-7 flex justify-center">
          <Button variant="outline" className="h-11 rounded-[12px] border-[#173c25]/12 bg-white px-8 font-black text-[#102116] hover:bg-[#fff6d8]">
            Показать ещё статьи
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
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">Подбор схемы</span>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-[#071a10] md:text-4xl">
                Не знаете, с чего начать?
              </h2>
              <p className="mt-3 text-base leading-7 text-[#5b6657]">
                Напишите нам, укажите площадь участка и получите понятную консультацию по питанию картофеля.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
              <Button asChild className="h-12 rounded-[12px] bg-[#063b23] px-6 font-black text-white hover:bg-[#0d5a36] [&_*]:text-white" style={{ color: "#fff" }}>
                <Link href="/contacts">
                  Связаться
                  <ArrowRight className="h-5 w-5 text-white" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-[12px] border-[#f5b400] bg-white px-6 font-black text-[#102116] hover:bg-[#fff6d8]">
                <Link href="/products">Смотреть каталог</Link>
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
          Рекомендуем
        </span>
      </div>
      <div className="p-6">
        <h2 className="text-3xl font-black leading-[1.05] tracking-[-0.045em] text-[#071a10]">{article.title}</h2>
        <p className="mt-4 text-sm leading-7 text-[#5d685a]">{article.description}</p>
        <ArticleMeta article={article} className="mt-5" />
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#063b23]">
          Читать статью
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
            Читать
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
