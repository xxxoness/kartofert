import Link from "next/link";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { navItems, productCategories } from "@/data/categories";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shop/logo";

export function Footer() {
  return (
    <footer className="border-t border-[#173c25]/10 bg-[#fbf7ec] py-10 text-[#102116]">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.85fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#596553]">
              KartoFert — удобный магазин удобрений для картофеля. Каталог, расчёт количества, корзина и оформление заказа без лишней сложности.
            </p>
            <Button asChild className="mt-5 rounded-[10px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
              <Link href="/products">Перейти в каталог</Link>
            </Button>
          </div>
          <FooterColumn title="Каталог">
            {productCategories.map((item) => (
              <Link key={item.title} href={item.href}>
                {item.title}
              </Link>
            ))}
          </FooterColumn>
          <FooterColumn title="Покупателям">
            <Link href="/calculator">Калькулятор</Link>
            <Link href="/cart">Корзина</Link>
            <Link href="/checkout">Оформление заказа</Link>
            <Link href="/delivery">Доставка и оплата</Link>
            <Link href="/faq">Вопросы и ответы</Link>
          </FooterColumn>
          <FooterColumn title="Компания">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </FooterColumn>
          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.12em] text-[#6e5b22]">Контакты</h3>
            <div className="grid gap-3 text-sm font-semibold text-[#4f5e4f]">
              <a href={`tel:${siteConfig.phone.replaceAll(" ", "")}`} className="flex items-center gap-2 transition hover:text-[#063b23]">
                <Phone className="h-4 w-4 text-[#1f7a45]" />
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 transition hover:text-[#063b23]">
                <Mail className="h-4 w-4 text-[#1f7a45]" />
                {siteConfig.email}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#1f7a45]" />
                {siteConfig.address}
              </span>
            </div>
            <div className="mt-5 rounded-[14px] border border-[#173c25]/10 bg-white p-3">
              <p className="text-xs font-bold text-[#596553]">Подписка на сезонные подсказки</p>
              <div className="mt-3 flex gap-2">
                <input
                  aria-label="Электронная почта для подписки"
                  placeholder="Ваша почта"
                  className="h-10 min-w-0 flex-1 rounded-[9px] border border-[#173c25]/10 px-3 text-sm outline-none focus:border-[#f5b400]"
                />
                <button className="grid h-10 w-10 place-items-center rounded-[9px] bg-[#063b23] text-white" aria-label="Подписаться">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-9 flex flex-col gap-3 border-t border-[#173c25]/10 pt-5 text-xs font-semibold text-[#6d7468] md:flex-row md:items-center md:justify-between">
          <p>© 2026 KartoFert. Интернет-магазин удобрений для картофеля.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/faq" className="hover:text-[#063b23]">Вопросы и ответы</Link>
            <Link href="/delivery" className="hover:text-[#063b23]">Условия доставки</Link>
            <Link href="/contacts" className="hover:text-[#063b23]">Связаться с нами</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-black uppercase tracking-[0.12em] text-[#6e5b22]">{title}</h3>
      <div className="grid gap-2 text-sm font-semibold text-[#4f5e4f] [&_a]:transition [&_a:hover]:text-[#063b23]">
        {children}
      </div>
    </div>
  );
}
