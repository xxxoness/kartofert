import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты KartoFert и форма заявки на подбор удобрений для картофеля."
};

export default function ContactsPage() {
  const cards = [
    [Phone, "Телефон", siteConfig.phone],
    [Mail, "Электронная почта", siteConfig.email],
    [MessageCircle, "Telegram", siteConfig.telegram],
    [MapPin, "Адрес", siteConfig.address]
  ] as const;

  return (
    <section className="container-shell py-10 md:py-14">
      <div className="max-w-3xl">
        <span className="rounded-[8px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">Контакты</span>
        <h1 className="mt-5 text-[40px] font-black leading-[1] tracking-[-0.06em] text-[#071a10] md:text-[62px]">
          Получите консультацию или уточните заказ
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#4d5a4e]">
          Напишите культуру, площадь, фасовку и город. Менеджер поможет собрать заказ.
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="grid gap-4">
          {cards.map(([Icon, label, value]) => (
            <div key={label} className="rounded-[18px] border border-[#173c25]/10 bg-white p-5 shadow-[0_14px_36px_rgba(45,35,17,.06)]">
              <Icon className="h-6 w-6 text-[#1f7a45]" />
              <p className="mt-3 text-sm font-bold text-[#7a8373]">{label}</p>
              <p className="mt-1 text-xl font-black text-[#102116]">{value}</p>
            </div>
          ))}
          <div className="min-h-52 rounded-[18px] border border-[#173c25]/10 bg-[linear-gradient(135deg,#eef4e6,#fff8e8)] p-5 shadow-[0_14px_36px_rgba(45,35,17,.06)]">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#8c5b00]">Карта</p>
            <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#102116]">Доставка по Беларуси</p>
            <p className="mt-2 text-sm leading-6 text-[#596553]">Минск, Гомель, Брест, Гродно, Витебск, Могилёв и регионы.</p>
          </div>
        </div>
        <div className="rounded-[18px] border border-[#173c25]/10 bg-white p-6 shadow-[0_18px_48px_rgba(45,35,17,.08)]">
          <h2 className="mb-6 text-2xl font-black tracking-[-0.035em] text-[#102116]">Форма консультации</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
