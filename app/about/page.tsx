import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, ChevronRight, Headphones, Leaf, ShieldCheck, Sprout, Target, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "KartoFert — специализированный магазин удобрений для картофеля. Помогаем фермерам и дачникам выбирать питание растений, рассчитывать количество и оформлять заказ."
};

const heroBenefits = [
  {
    icon: Leaf,
    title: "Экспертиза агрономов",
    text: "Опыт и практика в полях"
  },
  {
    icon: ShieldCheck,
    title: "Качество прежде всего",
    text: "Проверенные удобрения от надёжных производителей"
  },
  {
    icon: Sprout,
    title: "Результат на каждом этапе",
    text: "Стабильный урожай и здоровая почва"
  },
  {
    icon: UsersRound,
    title: "Поддержка и консультации",
    text: "Помогаем на всех этапах выращивания"
  }
];

const principles = [
  {
    icon: Leaf,
    title: "Честность",
    text: "Честно рассказываем о составе и действии удобрений."
  },
  {
    icon: Award,
    title: "Качество",
    text: "Работаем только с проверенными производителями."
  },
  {
    icon: ShieldCheck,
    title: "Ответственность",
    text: "Заботимся о почве, растениях и вашем будущем урожае."
  },
  {
    icon: Headphones,
    title: "Поддержка",
    text: "Всегда на связи и готовы помочь с выбором."
  }
];

const technologyPoints = [
  {
    icon: ShieldCheck,
    title: "Отбор производителей",
    text: "Работаем только с надёжными заводами."
  },
  {
    icon: Leaf,
    title: "Забота о почве",
    text: "Сохраняем подходящие решения для будущих урожаев."
  },
  {
    icon: Target,
    title: "Практика в полях",
    text: "Тестируем подходы и делимся опытом."
  },
  {
    icon: Sprout,
    title: "Контроль качества",
    text: "Проверяем состав и безопасность."
  }
];

const technologyPointPositions = [
  "lg:left-0 lg:top-5",
  "lg:right-0 lg:top-5",
  "lg:left-0 lg:bottom-6",
  "lg:right-0 lg:bottom-6"
];

const trustCards = [
  {
    icon: Sprout,
    title: "Специализация на картофеле",
    text: "Мы подбираем удобрения именно под задачи картофеля: посадка, рост, клубнеобразование и хранение."
  },
  {
    icon: Target,
    title: "Понятный выбор",
    text: "Помогаем разобраться, какое удобрение подходит под задачу, площадь и этап выращивания."
  },
  {
    icon: CheckCircle2,
    title: "Практический подход",
    text: "Делаем акцент не на сложных терминах, а на понятных схемах и реальном результате."
  }
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#fbf7ec] text-[#102116]">
      <section className="container-shell pb-6 pt-6 md:pb-8 md:pt-8">
        <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[#65705f]">
          <Link href="/" className="transition hover:text-[#063b23]">
            Главная
          </Link>
          <ChevronRight className="h-4 w-4 text-[#b9ad8d]" />
          <span className="text-[#102116]">О нас</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center xl:gap-8">
          <div>
            <span className="inline-flex rounded-[10px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#8c5b00]">
              О нас
            </span>
            <h1 className="mt-4 max-w-[680px] text-[42px] font-black leading-[0.96] tracking-[-0.058em] text-[#063b23] md:text-[58px] lg:text-[64px]">
              Мы знаем, что нужно картофелю
            </h1>
            <p className="mt-4 max-w-[640px] text-base font-medium leading-7 text-[#3f493a] md:text-lg md:leading-8">
              KartoFert — специализированный магазин удобрений для картофеля. Мы помогаем фермерам и дачникам получать стабильный и качественный урожай с помощью правильного питания растений.
            </p>

            <div className="mt-6 grid w-full gap-5 rounded-[20px] border border-[#173c25]/10 bg-white/82 p-4 shadow-[0_18px_46px_rgba(45,35,17,.06)] sm:grid-cols-2 xl:grid-cols-4">
              {heroBenefits.map(({ icon: Icon, title, text }) => (
                <article key={title} className="min-h-[156px] min-w-0 content-start rounded-[14px] bg-[#fffdf7] px-5 py-5">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#eef7e8] text-[#063b23] shadow-[0_10px_22px_rgba(45,35,17,.05)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-3 text-[15px] font-black leading-[1.25] text-[#071a10]">{title}</h2>
                  <p className="mt-2 text-xs font-semibold leading-5 text-[#5e6858]">{text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative min-h-[310px] overflow-hidden rounded-[28px] border border-[#173c25]/10 bg-white shadow-[0_24px_70px_rgba(45,35,17,.12)] md:min-h-[420px] lg:min-h-[450px]">
            <Image
              src="/assets/about/hero/about-hero-main.png"
              alt="KartoFert в поле картофеля"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section className="container-shell py-3 md:py-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.9fr)]">
          <article className="relative overflow-hidden rounded-[22px] border border-[#f5b400]/28 bg-[#fff7dd] p-5 shadow-[0_18px_46px_rgba(45,35,17,.06)] md:p-6">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f5b400]/18" />
            <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#063b23] shadow-[0_10px_24px_rgba(45,35,17,.08)]">
              <Target className="h-6 w-6" />
            </span>
            <h2 className="relative mt-4 text-2xl font-black tracking-[-0.04em] text-[#063b23]">Наша миссия</h2>
            <p className="relative mt-3 text-sm leading-7 text-[#4f5d50] md:text-base">
              Делать современные удобрения доступными и понятными каждому, чтобы каждый мог вырастить больше качественного картофеля на своей земле.
            </p>
          </article>

          <article className="rounded-[22px] border border-[#173c25]/10 bg-[#fffdf7] p-5 shadow-[0_18px_46px_rgba(45,35,17,.06)] md:p-6">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-[#063b23]">Наши принципы</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(160px,1fr))]">
              {principles.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex min-h-[150px] min-w-0 flex-col rounded-[16px] border border-[#173c25]/8 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef7e8] text-[#063b23]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-[15px] font-black leading-5 text-[#071a10]">{title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#5e6858]">{text}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="container-shell py-3 md:py-4">
        <div className="relative overflow-hidden rounded-[26px] border border-[#173c25]/10 bg-[#fffdf7] shadow-[0_24px_70px_rgba(45,35,17,.08)]">
          <div className="grid gap-5 p-5 md:p-6 lg:grid-cols-[0.78fr_1.1fr_1fr] lg:items-center">
            <div className="relative z-10">
              <h2 className="text-3xl font-black leading-[1.08] tracking-[-0.045em] text-[#063b23] md:text-4xl">
                Технологии питания для высокого урожая
              </h2>
              <p className="mt-3 text-base leading-7 text-[#4f5d50]">
                Мы тщательно отбираем производителей, тестируем удобрения и предлагаем только те решения, которые работают в наших условиях почвы и климата.
              </p>
              <Button asChild className="mt-6 h-12 rounded-[12px] bg-[#f5b400] px-6 font-black text-[#1b1500] shadow-none hover:bg-[#e8a900]">
                <Link href="/products">Перейти в каталог</Link>
              </Button>
            </div>

            <div className="relative min-h-[315px] lg:min-h-[390px]">
              <div className="absolute left-1/2 top-1/2 hidden h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#173c25]/10 bg-[#f7efd9] lg:block" />
              <Image
                src="/assets/about/decor/about-product-pack.png"
                alt="Упаковка удобрения KartoFert"
                width={340}
                height={420}
                className="absolute left-1/2 top-[52%] z-10 h-[265px] w-[230px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_26px_40px_rgba(45,35,17,.16)] lg:h-[300px] lg:w-[260px]"
              />
              <div className="relative z-20 grid gap-3 sm:grid-cols-2 lg:block">
                {technologyPoints.map(({ icon: Icon, title, text }, index) => (
                  <div
                    key={title}
                    className={[
                      "rounded-[16px] border border-[#173c25]/10 bg-white/92 p-3 shadow-[0_14px_34px_rgba(45,35,17,.08)] backdrop-blur lg:absolute lg:w-[196px]",
                      technologyPointPositions[index]
                    ].join(" ")}
                  >
                    <div className="flex gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eef7e8] text-[#063b23]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <h3 className="text-sm font-black text-[#071a10]">{title}</h3>
                        <p className="mt-1 text-xs font-medium leading-5 text-[#5e6858]">{text}</p>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[300px] overflow-hidden rounded-[22px] lg:min-h-[400px]">
              <Image
                src="/assets/about/decor/about-harvest-hands.png"
                alt="Свежий урожай картофеля в руках"
                fill
                sizes="(max-width: 1024px) 100vw, 32vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,247,.58),rgba(255,253,247,0)_44%)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-3 md:py-4">
        <div className="grid gap-4 md:grid-cols-3">
          {trustCards.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-[20px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_46px_rgba(45,35,17,.06)]">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#eef7e8] text-[#063b23]">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-xl font-black tracking-[-0.035em] text-[#071a10]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5e6858]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell pb-12 pt-3 md:pb-14 md:pt-4">
        <div className="rounded-[24px] border border-[#173c25]/10 bg-[#eef7e8] p-5 shadow-[0_20px_54px_rgba(45,35,17,.06)] md:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-3xl gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#dfeeda] text-[#063b23]">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <div>
                <h2 className="text-2xl font-black tracking-[-0.04em] text-[#063b23] md:text-3xl">
                  Нам важно, чтобы у вас всё получилось
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#4f5d50] md:text-base">
                  Если у вас есть вопросы по удобрениям, питанию картофеля или схемам внесения — напишите, мы всегда на связи.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
              <Button asChild className="h-12 rounded-[12px] bg-[#063b23] px-6 font-black text-white hover:bg-[#0d5a36] [&_*]:text-white" style={{ color: "#fff" }}>
                <Link href="/contacts">Написать нам</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-[12px] border-[#173c25]/35 bg-white px-6 font-black text-[#102116] hover:bg-[#fff6d8]">
                <Link href="/knowledge">
                  Перейти в базу знаний
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
