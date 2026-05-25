import { ShieldCheck, Truck, WalletCards } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export function TrustSection() {
  return (
    <section className="container-shell py-16">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="dark-panel rounded-[30px] p-8 md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#d9b56a]">Почему доверяют</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] md:text-5xl">Мы не притворяемся производителем. Мы помогаем купить правильно.</h2>
          <div className="mt-8 grid gap-4">
            {[
              [ShieldCheck, "Честные карточки", "Если цена или норма не подтверждена, мы так и пишем."],
              [Truck, "Доставка по Беларуси", "Согласуем город, фасовку и объем до подтверждения заказа."],
              [WalletCards, "Опт и розница", "Одинаково понятная покупка для дачи и фермерского хозяйства."]
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="flex gap-4 rounded-[18px] bg-white/8 p-4">
                <Icon className="h-6 w-6 shrink-0 text-[#d9b56a]" />
                <div>
                  <h3 className="font-bold">{title as string}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/72">{text as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          {testimonials.map((item) => (
            <div key={item.name} className="rounded-[24px] border border-[#29351f]/10 bg-white p-6 shadow-[0_16px_42px_rgba(57,47,28,.07)]">
              <p className="text-base leading-7 text-[#3d4938]">“{item.text}”</p>
              <p className="mt-4 text-sm font-black text-[#8a662a]">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
