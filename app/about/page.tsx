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

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#fbf7ec] text-[#102116]">
      <section className="container-shell pb-8 pt-7 md:pb-10 md:pt-10">
        <div className="mb-6 flex items-center gap-2 text-sm font-bold text-[#65705f]">
          <Link href="/" className="transition hover:text-[#063b23]">
            Главная
          </Link>
          <ChevronRight className="h-4 w-4 text-[#b9ad8d]" />
          <span className="text-[#102116]">О нас</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-[10px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#8c5b00]">
              О нас
            </span>
            <h1 className="mt-5 max-w-[680px] text-[42px] font-black leading-[0.98] tracking-[-0.058em] text-[#063b23] md:text-[60px] lg:text-[68px]">
              Мы знаем, что нужно картофелю
            </h1>
            <p className="mt-5 max-w-[640px] text-base font-medium leading-7 text-[#3f493a] md:text-lg md:leading-8">
              KartoFert — специализированный магазин удобрений для картофеля. Мы помогаем фермерам и дачникам получать стабильный и качественный урожай с помощью правильного питания растений.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {heroBenefits.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-[18px] border border-transparent bg-transparent p-0">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#eef7e8] text-[#063b23] shadow-[0_12px_26px_rgba(45,35,17,.06)]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="mt-4 text-base font-black leading-5 text-[#071a10]">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5e6858]">{text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative min-h-[330px] overflow-hidden rounded-[28px] border border-[#173c25]/10 bg-white shadow-[0_24px_70px_rgba(45,35,17,.12)] md:min-h-[460px] lg:min-h-[510px]">
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

      <section className="container-shell py-5 md:py-7">
        <div className="grid gap-4 lg:grid-cols-[0.72fr_1.58fr]">
          <article className="rounded-[22px] border border-[#173c25]/10 bg-[#fffdf7] p-6 shadow-[0_18px_46px_rgba(45,35,17,.06)] md:p-8">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-[#063b23]">Наша миссия</h2>
            <p className="mt-4 text-sm leading-7 text-[#4f5d50] md:text-base">
              Делать современные удобрения доступными и понятными каждому, чтобы каждый мог вырастить больше качественного картофеля на своей земле.
            </p>
          </article>

          <article className="rounded-[22px] border border-[#173c25]/10 bg-[#fffdf7] p-6 shadow-[0_18px_46px_rgba(45,35,17,.06)] md:p-8">
            <h2 className="text-center text-2xl font-black tracking-[-0.04em] text-[#063b23] lg:text-left">Наши принципы</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {principles.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-3 xl:border-l xl:border-[#173c25]/10 xl:pl-5 first:xl:border-l-0 first:xl:pl-0">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#eef7e8] text-[#063b23]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#071a10]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#5e6858]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="container-shell py-5 md:py-7">
        <div className="relative overflow-hidden rounded-[26px] border border-[#173c25]/10 bg-[#fffdf7] shadow-[0_24px_70px_rgba(45,35,17,.08)]">
          <div className="grid gap-5 p-6 md:p-8 lg:grid-cols-[0.82fr_1.04fr_0.95fr] lg:items-center">
            <div className="relative z-10">
              <h2 className="text-3xl font-black leading-[1.08] tracking-[-0.045em] text-[#063b23] md:text-4xl">
                Технологии питания для высокого урожая
              </h2>
              <p className="mt-4 text-base leading-7 text-[#4f5d50]">
                Мы тщательно отбираем производителей, тестируем удобрения и предлагаем только те решения, которые работают в наших условиях почвы и климата.
              </p>
              <Button asChild className="mt-6 h-12 rounded-[12px] bg-[#f5b400] px-6 font-black text-[#1b1500] shadow-none hover:bg-[#e8a900]">
                <Link href="/products">Перейти в каталог</Link>
              </Button>
            </div>

            <div className="relative min-h-[330px]">
              <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#173c25]/10 bg-[#f7efd9]" />
              <Image
                src="/assets/about/decor/about-product-pack.png"
                alt="Упаковка удобрения KartoFert"
                width={340}
                height={420}
                className="absolute left-1/2 top-1/2 z-10 h-[300px] w-[260px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_26px_40px_rgba(45,35,17,.16)]"
              />
              <div className="relative z-20 grid gap-3 sm:grid-cols-2">
                {technologyPoints.map(({ icon: Icon, title, text }, index) => (
                  <div
                    key={title}
                    className={[
                      "rounded-[18px] border border-[#173c25]/10 bg-white/90 p-4 shadow-[0_14px_34px_rgba(45,35,17,.08)] backdrop-blur",
                      index === 1 ? "sm:translate-y-8" : "",
                      index === 2 ? "sm:-translate-y-2" : "",
                      index === 3 ? "sm:translate-y-6" : ""
                    ].join(" ")}
                  >
                    <div className="flex gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef7e8] text-[#063b23]">
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

            <div className="relative min-h-[270px] overflow-hidden rounded-[22px] lg:min-h-[360px]">
              <Image
                src="/assets/about/decor/about-harvest-hands.png"
                alt="Свежий урожай картофеля в руках"
                fill
                sizes="(max-width: 1024px) 100vw, 32vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,247,.72),rgba(255,253,247,0)_48%)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell pb-14 pt-5 md:pb-16 md:pt-7">
        <div className="rounded-[24px] border border-[#173c25]/10 bg-[#eef7e8] p-6 shadow-[0_20px_54px_rgba(45,35,17,.06)] md:p-8">
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
