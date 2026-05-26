import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Gauge,
  Gem,
  Grid2X2,
  Heart,
  Leaf,
  Package,
  ShieldCheck,
  MessageCircle,
  Sprout,
  Wheat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatProductPrice } from "@/data/products";
import { getPublishedProducts } from "@/lib/products";

const heroImage = "/assets/hero/hero-potato-fertilizers.png";
const hasHeroImage = existsSync(join(process.cwd(), "public", heroImage.slice(1)));

const benefits = [
  { icon: Package, label: "15 типов удобрений" },
  { icon: Grid2X2, label: "Сотки и гектары" },
  { icon: Calculator, label: "Цены и расчёт" },
  { icon: Clock3, label: "Заявка за 1 минуту" }
];

const categories = [
  {
    icon: Sprout,
    title: "Комплексные NPK",
    text: "Сбалансированное питание для высокого урожая",
    href: "/products?type=Комплексные NPK"
  },
  {
    icon: Gauge,
    title: "Азотные удобрения",
    text: "Рост ботвы и формирование растений",
    href: "/products?type=Азотные"
  },
  {
    icon: Wheat,
    title: "Фосфорные удобрения",
    text: "Корневая система и развитие клубней",
    href: "/products?type=Фосфорные"
  },
  {
    icon: Gem,
    title: "Калийные удобрения",
    text: "Устойчивость, качество и лёжкость",
    href: "/products?type=Калийные"
  },
  {
    icon: FlaskConical,
    title: "Микроудобрения",
    text: "Бор, магний и другие элементы для качества",
    href: "/products?type=Микроудобрения"
  },
  {
    icon: Leaf,
    title: "Органо-минеральные",
    text: "Плодородие и структура почвы",
    href: "/products?type=Органо-минеральные"
  }
];

const popularSlugs = ["npk-potato", "sulfate-potassium", "kalimagnesia", "ammonium-sulfate", "borofoska"];

const articles = [
  {
    title: "Как выбрать удобрение для картофеля под тип почвы",
    date: "12 мая 2026",
    image: "/assets/articles/potato-planting.jpg",
    href: "/knowledge/kak-vybrat-udobrenie-pod-tip-pochvy"
  },
  {
    title: "Сроки и схемы подкормок картофеля в течение сезона",
    date: "28 апреля 2026",
    image: "/assets/articles/potato-field.jpg",
    href: "/knowledge/sroki-i-shemy-podkormok-kartofelya"
  },
  {
    title: "Признаки дефицита элементов и как их устранить",
    date: "15 апреля 2026",
    image: "/assets/articles/potato-deficiency.jpg",
    href: "/knowledge/priznaki-deficita-elementov"
  }
];

export default async function HomePage() {
  const products = await getPublishedProducts();
  const popularProducts = popularSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is (typeof products)[number] => Boolean(product))
    .map((product) => ({
      name: product.name,
      price: formatProductPrice(product),
      image: `/assets/products/${product.slug}/front.png`,
      href: `/products/${product.slug}`
    }));

  return (
    <main className="overflow-hidden bg-[#FAF7EF]">
      <section className="mx-auto w-full max-w-[1440px] px-4 pb-4 pt-10 sm:px-6 md:pt-12 lg:px-8 lg:pb-7 lg:pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[44fr_56fr] xl:gap-10">
          <div className="min-w-0 max-w-[590px]">
            <h1 className="max-w-[590px] break-words text-[38px] font-black leading-[0.92] tracking-[-0.045em] text-[#071a10] sm:text-[49px] lg:text-[54px] xl:text-[58px]">
              Удобрения для картофеля с понятным расчётом
            </h1>
            <p className="mt-[18px] max-w-[540px] text-[17px] font-medium leading-[1.45] text-[#43513f] sm:text-lg lg:text-[18px]">
              Выбирайте подходящие удобрения под вашу задачу выращивания и точно рассчитывайте количество для участков и хозяйств любого масштаба.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" style={{ color: "#fff" }} className="h-14 w-full rounded-[13px] bg-[#063b23] px-7 text-base font-black text-white shadow-[0_18px_42px_rgba(6,59,35,.2)] hover:bg-[#0d5a36] sm:w-auto sm:px-8 [&_*]:text-white">
                <Link href="/products">
                  Перейти в каталог
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 w-full rounded-[13px] border-[#f2b600] bg-white/80 px-7 text-base font-black text-[#9a6400] shadow-none hover:bg-[#fff4cf] sm:w-auto sm:px-8">
                <Link href="/contacts">
                  Уточнить условия
                  <Calculator className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative -mx-1 min-h-[236px] overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_63%_58%,rgba(245,180,0,.045),transparent_34%),radial-gradient(circle_at_58%_58%,rgba(6,59,35,.035),transparent_44%)] sm:min-h-[305px] lg:ml-0 lg:h-[388px] xl:h-[414px]">
            {hasHeroImage ? (
              <>
                <Image
                  src={heroImage}
                  alt="Упаковки удобрений KartoFert, картофель и зелёные листья"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="scale-[1.045] object-contain object-right mix-blend-multiply drop-shadow-[0_16px_28px_rgba(54,39,17,.11)] sm:scale-[1.035] lg:scale-[1.06]"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(90deg, transparent 0%, rgba(0,0,0,.72) 9%, #000 24%, #000 74%, rgba(0,0,0,.62) 88%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 13%, #000 78%, rgba(0,0,0,.7) 90%, transparent 100%)",
                    WebkitMaskComposite: "source-in",
                    maskImage:
                      "linear-gradient(90deg, transparent 0%, rgba(0,0,0,.72) 9%, #000 24%, #000 74%, rgba(0,0,0,.62) 88%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 13%, #000 78%, rgba(0,0,0,.7) 90%, transparent 100%)",
                    maskComposite: "intersect"
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_50%,#FAF7EF_0%,rgba(250,247,239,.82)_11%,transparent_28%),linear-gradient(90deg,#FAF7EF_0%,rgba(250,247,239,.52)_8%,transparent_25%,transparent_74%,rgba(250,247,239,.42)_92%,#FAF7EF_100%)]" />
              </>
            ) : (
              <div className="flex h-full min-h-[270px] items-center justify-center rounded-[30px] border border-[#173c25]/10 bg-[#fffdf7]/55 p-8 text-center sm:min-h-[350px]">
                <div>
                  <Image src="/assets/brand/logo-mark.svg" alt="" width={72} height={72} className="mx-auto" />
                  <p className="mt-4 max-w-sm text-sm font-bold leading-6 text-[#52604e]">
                    Добавьте файл hero-композиции в /public/assets/hero/hero-potato-fertilizers.png
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-7 grid min-h-[72px] overflow-hidden rounded-[18px] border border-[#173c25]/10 bg-white shadow-[0_14px_34px_rgba(45,35,17,.06)] sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 border-[#173c25]/10 px-4 py-3 lg:border-r last:border-r-0">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef5e8] text-[#1f6b3c]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-black text-[#102116]">{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 py-3 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.title}
                href={category.href}
                className="group min-h-[110px] rounded-[18px] border border-[#173c25]/10 bg-white/92 p-[18px] shadow-[0_12px_30px_rgba(45,35,17,.05)] transition duration-300 hover:-translate-y-0.5 hover:border-[#f2b600]/60 hover:shadow-[0_18px_44px_rgba(45,35,17,.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#edf5e5] text-[#1d7a43]">
                    <Icon className="h-[19px] w-[19px]" />
                  </span>
                  <ArrowRight className="mt-2 h-4 w-4 text-[#bd7a00] transition group-hover:translate-x-1" />
                </div>
                <h3 className="mt-2 text-[17px] font-black leading-[1.15] text-[#102116]">{category.title}</h3>
                <p className="mt-1 text-sm leading-[1.35] text-[#596553]">{category.text}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-2 pt-8 sm:px-6 lg:px-8 xl:pt-10">
        <div className="grid items-start gap-6 xl:grid-cols-[2fr_0.9fr]">
          <div className="self-start rounded-[20px] border border-[#173c25]/10 bg-white p-4 pb-5 shadow-[0_18px_48px_rgba(45,35,17,.07)] sm:p-5 sm:pb-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-[28px] font-black tracking-[-0.045em] text-[#102116] sm:text-3xl">Популярные удобрения</h2>
              <Link href="/products" className="rounded-full border border-[#173c25]/10 px-4 py-2 text-xs font-black text-[#063b23] transition hover:bg-[#f4e9c8]">
                Все товары
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {popularProducts.map((product) => (
                <ProductShelfCard key={product.name} product={product} />
              ))}
            </div>
          </div>

          <aside className="self-start rounded-[20px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_48px_rgba(45,35,17,.07)]">
            <div className="mb-3.5 flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#eef5e8] text-[#063b23]">
                <Calculator className="h-5 w-5" />
              </span>
              <h2 className="text-[25px] font-black tracking-[-0.04em] text-[#102116]">Помощь с расчётом</h2>
            </div>

            <div className="grid gap-2.5">
              <label className="grid gap-1.5 text-sm font-bold text-[#2f3d30]">
                Площадь участка
                <div className="grid grid-cols-[1fr_92px] overflow-hidden rounded-[10px] border border-[#173c25]/10 bg-white shadow-[0_8px_18px_rgba(45,35,17,.035)]">
                  <input aria-label="Площадь участка" readOnly value="25" className="h-12 px-4 font-bold outline-none" />
                  <select aria-label="Единица площади" defaultValue="соток" className="border-l border-[#173c25]/10 px-3 text-sm font-bold outline-none">
                    <option>соток</option>
                    <option>га</option>
                  </select>
                </div>
              </label>

              <label className="grid gap-1.5 text-sm font-bold text-[#2f3d30]">
                Выберите удобрение
                <select defaultValue="NPK 11-9-16 для картофеля" className="h-12 rounded-[10px] border border-[#173c25]/10 bg-white px-4 text-sm font-bold shadow-[0_8px_18px_rgba(45,35,17,.035)] outline-none focus:border-[#f2b600]">
                  <option>NPK 11-9-16 для картофеля</option>
                  <option>Сульфат калия</option>
                  <option>Калимагнезия</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <ResultTile label="Потребность в удобрении" value="44,0 кг" />
                <ResultTile label="Количество мешков" value="2 шт." />
              </div>

              <Button asChild className="mt-0.5 h-12 rounded-[10px] bg-[#f5b400] text-base font-black text-[#1b1500] shadow-none hover:bg-[#e8a900]">
                <Link href="/contacts">
                  <Calculator className="h-5 w-5" />
                  Связаться
                </Link>
              </Button>

              <div className="mt-0.5 flex items-center gap-2 rounded-[12px] border border-[#173c25]/10 bg-[#f7fbf1] px-3.5 py-2.5 text-[13px] font-semibold leading-5 text-[#4e5c4d]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#1f7a45]" />
                Рекомендации по нормам и безопасности уточняются по инструкции производителя.
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-1 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
          <div className="rounded-[20px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_48px_rgba(45,35,17,.07)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-[28px] font-black tracking-[-0.045em] text-[#102116] sm:text-3xl">База знаний</h2>
              <Link href="/knowledge" className="rounded-full border border-[#173c25]/10 px-4 py-2 text-xs font-black text-[#063b23] transition hover:bg-[#f4e9c8]">
                Все статьи
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.title} article={article} />
              ))}
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[20px] border border-[#173c25]/10 bg-[#fff8e8] p-5 shadow-[0_18px_48px_rgba(45,35,17,.07)]">
            <div className="absolute -right-12 -top-10 h-36 w-36 rounded-full bg-[#f5b400]/20 blur-2xl" />
            <div className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-[16px] bg-white text-[#063b23] shadow-[0_12px_26px_rgba(45,35,17,.08)]">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[#102116]">Нужна помощь с выбором?</h2>
              <p className="mt-3 text-sm leading-6 text-[#596553]">
                Подскажем, какой тип удобрения подойдет под вашу почву, площадь и задачу выращивания картофеля.
              </p>
              <div className="mt-4 grid gap-2.5 text-sm font-bold text-[#304633]">
                {["Подбор по почве", "Расчёт мешков", "Уточнение цены"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-[11px] bg-white/70 px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1f7a45]" />
                    {item}
                  </div>
                ))}
              </div>
              <Button asChild className="mt-5 h-11 rounded-[10px] bg-[#063b23] px-6 text-white hover:bg-[#0d5a36]">
                <Link href="/contacts">Задать вопрос</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ProductShelfCard({
  product
}: {
  product: {
    name: string;
    price: string;
    image: string;
    href: string;
  };
}) {
  return (
    <Link
      href={product.href}
      className="group relative grid rounded-[18px] border border-[#173c25]/10 bg-[#fffdf7] p-3.5 shadow-[0_10px_28px_rgba(45,35,17,.05)] transition duration-300 hover:-translate-y-0.5 hover:border-[#f2b600]/60 hover:shadow-[0_16px_34px_rgba(45,35,17,.08)]"
    >
      <button aria-label="Добавить в избранное" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-[#1f6b3c] shadow-[0_8px_18px_rgba(45,35,17,.08)]">
        <Heart className="h-5 w-5" />
      </button>
      <div className="relative h-[212px] rounded-[14px] bg-[linear-gradient(180deg,#fffefb,#f2ead8)]">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 250px" className="scale-[1.18] object-contain p-0.5 transition duration-300 group-hover:scale-[1.23]" />
      </div>
      <div className="grid pt-2.5">
        <h3 className="text-base font-black leading-tight tracking-[-0.025em] text-[#102116]">{product.name}</h3>
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <span className="text-[22px] font-black leading-none text-[#102116]">{product.price}</span>
          <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-[#063b23] text-white">
            <MessageCircle className="h-[18px] w-[18px]" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ResultTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[13px] border border-[#173c25]/10 bg-[#fffdf7] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.9)]">
      <p className="text-xs font-bold leading-5 text-[#66715e]">{label}</p>
      <p className="mt-2 text-[28px] font-black leading-none tracking-[-0.04em] text-[#102116]">{value}</p>
    </div>
  );
}

function ArticleCard({
  article
}: {
  article: {
    title: string;
    date: string;
    image: string;
    href: string;
  };
}) {
  return (
    <Link
      href={article.href}
      className="group grid min-h-[342px] overflow-hidden rounded-[16px] border border-[#173c25]/10 bg-[#fffdf7] shadow-[0_10px_28px_rgba(45,35,17,.05)] transition duration-300 hover:-translate-y-0.5 hover:border-[#f2b600]/60 hover:shadow-[0_16px_34px_rgba(45,35,17,.08)]"
    >
      <div className="relative h-[168px] overflow-hidden">
        <Image src={article.image} alt={article.title} fill sizes="(max-width: 1024px) 100vw, 360px" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
      </div>
      <div className="grid p-5">
        <p className="text-xs font-bold text-[#7c6423]">{article.date}</p>
        <h3 className="mt-2 text-[19px] font-black leading-tight tracking-[-0.03em] text-[#102116]">{article.title}</h3>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-black text-[#1b6b40]">
          Читать статью
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
