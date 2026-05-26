"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, Clock, Headphones, Lock, Mail, MapPin, Phone, Send, ShieldCheck, Sprout, Trophy, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { addLead } from "@/components/shop/leads-store";

const contactItems = [
  {
    icon: Phone,
    title: siteConfig.phone,
    text: "Пн–Пт: с 9:00 до 18:00"
  },
  {
    icon: Mail,
    title: siteConfig.email,
    text: "Ответим в течение дня"
  },
  {
    icon: MapPin,
    title: "Минск и вся Беларусь",
    text: "Доставка по всей Беларуси"
  },
  {
    icon: Clock,
    title: "В течение дня",
    text: "Обычно отвечаем быстрее"
  }
];

const benefits = [
  {
    icon: Sprout,
    title: "Опыт агрономов",
    text: "Консультируем по питанию и защите картофеля"
  },
  {
    icon: Trophy,
    title: "Проверенные удобрения",
    text: "Работаем только с надёжными производителями"
  },
  {
    icon: Headphones,
    title: "Поддержка на всех этапах",
    text: "Помогаем от посадки до хранения урожая"
  },
  {
    icon: Truck,
    title: "Быстрая доставка",
    text: "Доставляем по Минску и всей Беларуси"
  }
];

const helpTopics = [
  {
    title: "Подобрать удобрение",
    text: "Подскажем подходящий состав под вашу задачу и этап выращивания."
  },
  {
    title: "Рассчитать количество",
    text: "Поможем понять, сколько мешков понадобится на участок."
  },
  {
    title: "Уточнить доставку",
    text: "Расскажем сроки и условия доставки по Беларуси."
  },
  {
    title: "Помочь с заказом",
    text: "Ответим на вопросы по корзине, оплате и оформлению."
  }
];

const faqs = [
  {
    question: "Как быстро вы отвечаете?",
    answer: "Обычно отвечаем в течение дня. В рабочее время стараемся отвечать быстрее."
  },
  {
    question: "Можно ли получить консультацию перед покупкой?",
    answer: "Да, мы поможем подобрать удобрение, рассчитать количество и выбрать подходящую схему питания."
  },
  {
    question: "Как осуществляется доставка?",
    answer: "Доставляем по Минску и всей Беларуси. Подробности можно уточнить при оформлении заказа."
  },
  {
    question: "Можно ли связаться по e-mail?",
    answer: `Да, напишите нам на ${siteConfig.email} — мы ответим в течение дня.`
  }
];

const subjects = ["Подбор удобрения", "Расчёт количества", "Доставка", "Оплата", "Помощь с заказом", "Другое"];
const inputClass =
  "h-14 w-full rounded-[14px] border border-[#173c25]/10 bg-white px-5 text-base font-semibold text-[#102116] outline-none transition placeholder:text-[#7d8777] focus:border-[#f5b400] focus:ring-4 focus:ring-[#f5b400]/20";

export function ContactsPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const subject = String(form.get("subject") ?? "");
    const message = String(form.get("message") ?? "");
    const privacyAccepted = form.get("privacy") === "on";

    if (name.trim().length < 2 || !email.includes("@") || subject.trim().length < 2 || message.trim().length < 8) {
      setError("Заполните имя, e-mail, тему обращения и сообщение.");
      return;
    }
    if (!privacyAccepted) {
      setError("Подтвердите согласие на обработку персональных данных.");
      return;
    }

    addLead({
      source: "форма",
      name,
      phone,
      email,
      productName: subject,
      amount: "",
      comment: message
    });
    setError("");
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <main className="overflow-hidden bg-[#fbf7ec] text-[#102116]">
      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden border-b border-[#173c25]/10">
        <Image
          src="/assets/hero/contacts-hero-bg.png"
          alt=""
          fill
          priority
          aria-hidden="true"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,247,.98)_0%,rgba(255,253,247,.94)_25%,rgba(255,253,247,.72)_48%,rgba(255,253,247,.28)_78%,rgba(255,253,247,.14)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(0deg,#fbf7ec_0%,rgba(251,247,236,0)_100%)]" />

        <div className="container-shell relative z-10 py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start xl:gap-12">
            <div className="pt-1 lg:pt-8">
              <div className="mb-8 flex items-center gap-2 text-sm font-bold text-[#65705f]">
                <Link href="/" className="transition hover:text-[#063b23]">
                  Главная
                </Link>
                <ChevronRight className="h-4 w-4 text-[#b9ad8d]" />
                <span className="text-[#102116]">Контакты</span>
              </div>
              <h1 className="text-[52px] font-black leading-[0.95] tracking-[-0.06em] text-[#063b23] md:text-[78px] lg:text-[86px]">
                Свяжитесь с нами
              </h1>
              <p className="mt-6 max-w-xl text-xl font-medium leading-8 text-[#1f2f25]">
                Поможем подобрать удобрения, рассчитать количество и оформить заказ. Мы всегда на связи!
              </p>

              <div className="mt-10 grid gap-5">
                {contactItems.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-center gap-5">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[16px] bg-[#eef7e8] text-[#063b23] shadow-[0_12px_28px_rgba(45,35,17,.08)]">
                      <Icon className="h-7 w-7" />
                    </span>
                    <span>
                      <strong className="block text-xl font-black leading-6 text-[#071a10]">{title}</strong>
                      <span className="mt-1 block text-base font-medium text-[#4f5d50]">{text}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#173c25]/10 bg-white/94 p-5 shadow-[0_28px_80px_rgba(45,35,17,.16)] backdrop-blur md:p-8 lg:mt-8">
              <h2 className="text-3xl font-black tracking-[-0.045em] text-[#071a10]">Напишите нам</h2>
              {sent ? (
                <div className="mt-7 rounded-[18px] border border-[#c8dfb8] bg-[#edf4e6] p-8 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-[#1f7a45]" />
                  <h3 className="mt-4 text-2xl font-black text-[#102116]">Спасибо!</h3>
                  <p className="mt-3 text-[#5e6858]">Мы получили ваше сообщение и скоро свяжемся с вами.</p>
                  <Button className="mt-6 rounded-[12px] bg-[#063b23] text-white hover:bg-[#0d5a36]" onClick={() => setSent(false)}>
                    Отправить ещё одно сообщение
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-7 grid gap-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <input name="name" aria-label="Ваше имя" placeholder="Ваше имя *" className={inputClass} />
                    <input name="email" type="email" aria-label="Ваш e-mail" placeholder="Ваш e-mail *" className={inputClass} />
                  </div>
                  <input name="phone" aria-label="Телефон" placeholder="Телефон" className={inputClass} />
                  <select name="subject" aria-label="Тема обращения" defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      Тема обращения *
                    </option>
                    {subjects.map((subject) => (
                      <option key={subject}>{subject}</option>
                    ))}
                  </select>
                  <textarea name="message" aria-label="Сообщение" placeholder="Сообщение *" className="min-h-[150px] resize-none rounded-[14px] border border-[#173c25]/10 bg-white px-5 py-4 text-base font-semibold text-[#102116] outline-none transition placeholder:text-[#7d8777] focus:border-[#f5b400] focus:ring-4 focus:ring-[#f5b400]/20" />
                  <label className="flex gap-3 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] p-4 text-sm font-semibold leading-6 text-[#4f5d50]">
                    <input name="privacy" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-[#063b23]" />
                    <span>
                      Я соглашаюсь на обработку персональных данных и ознакомлен(а) с{" "}
                      <Link href="/policy" className="font-black text-[#063b23] underline">
                        Политикой обработки персональных данных
                      </Link>{" "}
                      и{" "}
                      <Link href="/terms" className="font-black text-[#063b23] underline">
                        Условиями заказа и продажи
                      </Link>
                      .
                    </span>
                  </label>
                  {error ? <p className="rounded-[12px] bg-[#fff1e8] px-4 py-3 text-sm font-bold text-[#8c3d22]">{error}</p> : null}
                  <Button type="submit" className="h-14 w-full rounded-[13px] bg-[#063b23] text-base font-black text-white hover:bg-[#0d5a36] md:w-fit md:px-8 [&_*]:text-white" style={{ color: "#fff" }}>
                    Отправить сообщение
                    <Send className="h-5 w-5 text-white" />
                  </Button>
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#6b735f]">
                    <Lock className="h-4 w-4 text-[#7b8375]" />
                    Ваши данные в безопасности и не передаются третьим лицам.
                  </p>
                </form>
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-[22px] border border-[#173c25]/10 bg-white/94 p-5 shadow-[0_20px_54px_rgba(45,35,17,.11)] backdrop-blur">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#eef7e8] text-[#063b23]">
                  <Icon className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-lg font-black tracking-[-0.02em] text-[#071a10]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#5e6858]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-8 md:py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">Темы обращений</span>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#071a10]">С чем можем помочь?</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-[#66705f]">Выберите тему — мы быстрее ответим на ваш вопрос.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {helpTopics.map((topic) => (
            <article key={topic.title} className="rounded-[20px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_46px_rgba(45,35,17,.06)]">
              <CheckCircle2 className="h-6 w-6 text-[#1f7a45]" />
              <h3 className="mt-4 text-xl font-black tracking-[-0.035em] text-[#071a10]">{topic.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5e6858]">{topic.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">FAQ</span>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#071a10]">Часто задаваемые вопросы</h2>
          </div>
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-[18px] border border-[#173c25]/10 bg-white p-5 shadow-[0_16px_42px_rgba(45,35,17,.05)]">
                <h3 className="text-lg font-black text-[#071a10]">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5e6858]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell pb-14 pt-6 md:pb-16 md:pt-8">
        <div className="rounded-[28px] border border-[#173c25]/10 bg-[#eef7e8] p-6 shadow-[0_20px_54px_rgba(45,35,17,.06)] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black tracking-[-0.045em] text-[#071a10]">Не нашли ответ на свой вопрос?</h2>
              <p className="mt-3 text-base leading-7 text-[#5b6657]">Напишите нам любым удобным способом — мы всегда рады помочь.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
              <Button asChild className="h-12 rounded-[12px] bg-[#063b23] px-6 font-black text-white hover:bg-[#0d5a36] [&_*]:text-white" style={{ color: "#fff" }}>
                <Link href="/products">
                  Перейти в каталог
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
