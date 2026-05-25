import type { Metadata } from "next";
import { CreditCard, FileText, MapPinned, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description: "Доставка удобрений KartoFert по Беларуси, самовывоз, B2B-счёт и демонстрационная оплата."
};

export default function DeliveryPage() {
  const cards = [
    [Truck, "Доставка по Беларуси", "Минск, Гомель, Брест, Гродно, Витебск, Могилёв и регионы."],
    [MapPinned, "Самовывоз", "Возможен после подтверждения наличия и фасовки менеджером."],
    [FileText, "B2B-счёт", "Для хозяйств и оптовых клиентов подготовим документы и счёт."],
    [CreditCard, "Демо-оплата", "На сайте заявка имитирует оплату, финал подтверждает менеджер."]
  ] as const;

  return (
    <section className="container-shell py-10 md:py-14">
      <div className="max-w-3xl">
        <span className="rounded-[8px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">Доставка и оплата</span>
        <h1 className="mt-5 text-[40px] font-black leading-[1] tracking-[-0.06em] text-[#071a10] md:text-[62px]">
          Поставка удобрений по Беларуси
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#4d5a4e]">
          Для дачников, фермерских хозяйств и оптовых клиентов. Итоговая цена и доставка подтверждаются менеджером.
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([Icon, title, text]) => (
          <div key={title} className="rounded-[18px] border border-[#173c25]/10 bg-white p-6 shadow-[0_18px_48px_rgba(45,35,17,.08)]">
            <Icon className="h-7 w-7 text-[#1f7a45]" />
            <h2 className="mt-4 text-xl font-black text-[#102116]">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5e6858]">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-[18px] bg-[#fff3d8] p-7">
        <h2 className="text-2xl font-black tracking-[-0.035em] text-[#102116]">Как проходит заказ</h2>
        <ol className="mt-5 grid gap-3 md:grid-cols-5">
          {["Вы выбираете товары", "Оформляете заявку", "Менеджер уточняет цены", "Согласуем доставку", "Отгружаем заказ"].map((item, index) => (
            <li key={item} className="rounded-[14px] bg-white/70 p-4 text-sm font-bold text-[#3f493a]">{index + 1}. {item}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
