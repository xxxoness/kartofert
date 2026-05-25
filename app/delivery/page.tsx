import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description:
    "Доставка удобрений KartoFert по Беларуси, онлайн-оплата, наложенный платёж и безналичный расчёт для юридических лиц."
};

const deliveryCards = [
  {
    title: "По всей Беларуси",
    text: "Доставляем заказы в любой населённый пункт.",
    image: "/assets/delivery/decor/delivery-decor-location.png"
  },
  {
    title: "Быстрая отправка",
    text: "Отправляем заказы в течение 1–2 рабочих дней.",
    image: "/assets/delivery/decor/delivery-decor-truck.png"
  },
  {
    title: "Надёжная упаковка",
    text: "Товары надёжно упакованы для защиты при перевозке.",
    image: "/assets/delivery/decor/delivery-decor-box.png"
  },
  {
    title: "Отслеживание заказа",
    text: "Уточняйте статус заказа в любой момент.",
    image: "/assets/delivery/decor/delivery-decor-location.png"
  }
];

const paymentCards = [
  {
    title: "Банковской картой",
    text: "Visa, MasterCard, МИР. Онлайн-оплата на сайте.",
    image: "/assets/delivery/decor/delivery-decor-payment-card.png"
  },
  {
    title: "Наложенный платёж",
    text: "Оплата при получении заказа на почте или курьеру.",
    image: "/assets/delivery/decor/delivery-decor-truck.png"
  },
  {
    title: "Безналичный расчёт",
    text: "Для юридических лиц. Выставляем счёт на оплату.",
    image: "/assets/delivery/decor/delivery-decor-payment-card.png"
  }
];

const benefits = [
  {
    title: "Качество продукции",
    text: "Только проверенные удобрения от надёжных производителей.",
    image: "/assets/delivery/decor/delivery-decor-shield.png"
  },
  {
    title: "Забота о клиентах",
    text: "Всегда рядом и готовы помочь с выбором продукции.",
    image: "/assets/delivery/decor/delivery-decor-leaves.png"
  },
  {
    title: "Безопасная оплата",
    text: "Надёжные платёжные решения для вашего спокойствия.",
    image: "/assets/delivery/decor/delivery-decor-payment-card.png"
  },
  {
    title: "Доставка по Беларуси",
    text: "Отправляем заказы по регионам и населённым пунктам.",
    image: "/assets/delivery/decor/delivery-decor-truck.png"
  }
];

const faqs = [
  {
    question: "Сколько занимает доставка?",
    answer: "Обычно заказ отправляется в течение 1–2 рабочих дней после подтверждения."
  },
  {
    question: "Можно ли оплатить картой?",
    answer: "Да, на сайте предусмотрена онлайн-оплата банковской картой."
  },
  {
    question: "Работаете ли с юридическими лицами?",
    answer: "Да, для юридических лиц возможен безналичный расчёт с выставлением счёта."
  },
  {
    question: "Можно ли уточнить статус заказа?",
    answer: "Да, статус заказа можно уточнить после оформления — мы подскажем актуальную информацию по доставке."
  }
];

export default function DeliveryPage() {
  return (
    <main className="overflow-hidden bg-[#fbf7ec] text-[#102116]">
      <section className="container-shell pb-8 pt-7 md:pb-12 md:pt-10">
        <div className="mb-6 flex items-center gap-2 text-sm font-bold text-[#65705f]">
          <Link href="/" className="transition hover:text-[#063b23]">
            Главная
          </Link>
          <ChevronRight className="h-4 w-4 text-[#b9ad8d]" />
          <span className="text-[#102116]">Доставка и оплата</span>
        </div>

        <div className="relative grid min-h-[430px] items-center gap-8 rounded-[30px] border border-[#173c25]/10 bg-[#fffdf7] px-5 py-8 shadow-[0_24px_70px_rgba(45,35,17,.08)] sm:px-8 md:grid-cols-[0.92fr_1.08fr] md:px-10 md:py-10 lg:px-14">
          <div className="relative z-10 max-w-[620px]">
            <span className="inline-flex rounded-[10px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">
              Доставка и оплата
            </span>
            <h1 className="mt-5 text-[42px] font-black leading-[0.96] tracking-[-0.055em] text-[#071a10] md:text-[58px] lg:text-[66px]">
              Доставка и оплата
            </h1>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-7 text-[#3f493a]">
              Продуманные условия доставки и оплаты для вашего удобства.
            </p>
            <p className="mt-3 max-w-xl text-base leading-7 text-[#66705f]">
              Доставляем удобрения по Беларуси и помогаем подобрать удобный способ оплаты.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-[12px] bg-[#063b23] px-6 font-black text-white shadow-[0_14px_34px_rgba(6,59,35,.18)] hover:bg-[#0d5a36] [&_*]:text-white" style={{ color: "#fff" }}>
                <Link href="/products">
                  Перейти в каталог
                  <ArrowRight className="h-5 w-5 text-white" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-[12px] border-[#f5b400] bg-white px-6 font-black text-[#102116] hover:bg-[#fff6d8]">
                <Link href="/calculator">Рассчитать количество</Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[260px] md:min-h-[360px]">
            <div className="absolute inset-y-4 right-0 w-[86%] rounded-[28px] bg-[#f8edcf]" />
            <Image
              src="/assets/delivery/hero/delivery-hero-main.png"
              alt="Доставка удобрений KartoFert"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 52vw"
              className="relative z-10 object-contain object-center drop-shadow-[0_22px_34px_rgba(61,51,24,.18)]"
            />
          </div>
        </div>
      </section>

      <section className="container-shell py-7 md:py-10">
        <div className="relative overflow-hidden rounded-[30px] border border-[#173c25]/10 bg-white p-5 shadow-[0_24px_70px_rgba(45,35,17,.08)] sm:p-7 lg:p-9">
          <div className="grid gap-6 lg:grid-cols-2">
            <InfoColumn title="Доставка" cards={deliveryCards} />
            <InfoColumn title="Оплата" cards={paymentCards} fallbackIcon />
          </div>

          <div className="relative mt-7 overflow-hidden rounded-[24px] border border-[#1f7a45]/12 bg-[#eef7e8] p-5 sm:p-7">
            <Image
              src="/assets/delivery/decor/delivery-decor-shield.png"
              alt=""
              width={130}
              height={130}
              aria-hidden="true"
              className="pointer-events-none absolute -left-4 bottom-0 hidden opacity-90 sm:block"
            />
            <Image
              src="/assets/delivery/decor/delivery-decor-leaves.png"
              alt=""
              width={170}
              height={150}
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 hidden opacity-80 md:block"
            />
            <div className="relative mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#1f7a45]">
                Защита заказа
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#071a10]">
                Надёжно и безопасно
              </h2>
              <p className="mt-3 text-base leading-7 text-[#52604f]">
                Ваши данные защищены, а платежи проходят через проверенные платёжные системы.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-7 md:py-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((item) => (
            <article key={item.title} className="rounded-[22px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_44px_rgba(45,35,17,.06)]">
              <Image src={item.image} alt="" width={58} height={58} aria-hidden="true" className="pointer-events-none h-14 w-14 object-contain" />
              <h3 className="mt-4 text-lg font-black tracking-[-0.025em] text-[#102116]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#64705f]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-7 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">FAQ</span>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#071a10]">
              Частые вопросы
            </h2>
            <p className="mt-3 max-w-md text-base leading-7 text-[#66705f]">
              Короткие ответы на основные вопросы о доставке, оплате и статусе заказа.
            </p>
          </div>
          <div className="grid gap-3">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-[20px] border border-[#173c25]/10 bg-white p-5 shadow-[0_16px_42px_rgba(45,35,17,.05)]">
                <h3 className="flex items-center gap-2 text-base font-black text-[#102116]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1f7a45]" />
                  {item.question}
                </h3>
                <p className="mt-2 pl-7 text-sm leading-6 text-[#64705f]">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell pb-14 pt-7 md:pb-16 md:pt-10">
        <div className="relative overflow-hidden rounded-[28px] border border-[#173c25]/10 bg-[#fffdf7] p-6 shadow-[0_24px_70px_rgba(45,35,17,.08)] sm:p-8 lg:p-10">
          <Image
            src="/assets/delivery/decor/delivery-decor-potato-crate.png"
            alt=""
            width={230}
            height={170}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-4 hidden object-contain opacity-95 md:block"
          />
          <Image
            src="/assets/delivery/decor/delivery-decor-leaves.png"
            alt=""
            width={150}
            height={130}
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-10 hidden rotate-12 opacity-70 lg:block"
          />
          <div className="relative max-w-2xl">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">Следующий шаг</span>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-[#071a10] md:text-4xl">
              Готовы оформить заказ?
            </h2>
            <p className="mt-3 text-base leading-7 text-[#66705f]">
              Перейдите в каталог, выберите удобрения для картофеля и добавьте нужные позиции в корзину.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-[12px] bg-[#063b23] px-6 font-black text-white hover:bg-[#0d5a36] [&_*]:text-white" style={{ color: "#fff" }}>
                <Link href="/products">
                  Перейти в каталог
                  <ArrowRight className="h-5 w-5 text-white" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-[12px] border-[#f5b400] bg-white px-6 font-black text-[#102116] hover:bg-[#fff6d8]">
                <Link href="/calculator">Рассчитать количество</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoColumn({
  title,
  cards,
  fallbackIcon = false
}: {
  title: string;
  cards: Array<{ title: string; text: string; image: string }>;
  fallbackIcon?: boolean;
}) {
  return (
    <div>
      <h2 className="text-3xl font-black tracking-[-0.04em] text-[#071a10]">{title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.map((item, index) => (
          <article
            key={item.title}
            className="group min-h-[156px] rounded-[20px] border border-[#173c25]/10 bg-[#fffdf7] p-4 shadow-[0_14px_34px_rgba(45,35,17,.05)] transition duration-200 hover:-translate-y-0.5 hover:border-[#1f7a45]/24 hover:shadow-[0_18px_44px_rgba(45,35,17,.09)]"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[16px] bg-white shadow-[0_10px_24px_rgba(45,35,17,.07)]">
                {fallbackIcon && index === 2 ? (
                  <FileText className="h-7 w-7 text-[#1f7a45]" />
                ) : (
                  <Image src={item.image} alt="" width={48} height={48} aria-hidden="true" className="pointer-events-none h-12 w-12 object-contain" />
                )}
              </div>
              <div>
                <h3 className="text-base font-black leading-5 text-[#102116]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#64705f]">{item.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
