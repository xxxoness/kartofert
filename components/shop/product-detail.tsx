"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, ChevronRight, Download, Leaf, PackageCheck, ShieldCheck, ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";
import { Article } from "@/data/articles";
import { calculateFertilizer } from "@/data/calculator-rules";
import { Button } from "@/components/ui/button";
import { ProductBagVisual } from "@/components/shop/product-bag-visual";
import { ProductCard } from "@/components/shop/product-card";
import { useCart } from "@/components/shop/cart-provider";
import { useProductsStore } from "@/components/shop/product-store";
import { addLead } from "@/components/shop/leads-store";
import { trackAnalyticsEvent } from "@/components/site/analytics-tracker";
import { canBuyProduct, formatBuyPrice } from "@/lib/cart-utils";

export function ProductDetail({
  product: initialProduct,
  relatedProducts,
  relatedArticles
}: {
  product: Product;
  relatedProducts: Product[];
  relatedArticles: Article[];
}) {
  const { getProduct } = useProductsStore();
  const { addItem } = useCart();
  const product = getProduct(initialProduct.slug) ?? initialProduct;
  const canBuy = canBuyProduct(product);
  const [norm, setNorm] = useState(product.defaultNorm);
  const [unit, setUnit] = useState(product.normUnit);
  const [area, setArea] = useState(1);
  const [bagWeight, setBagWeight] = useState(product.bagWeight);
  const [sent, setSent] = useState(false);

  const result = useMemo(
    () =>
      calculateFertilizer({
        area,
        areaMode: "hectare",
        norm,
        normUnit: unit,
        bagWeight,
        price: product.price
      }),
    [area, bagWeight, norm, product.price, unit]
  );

  const addRequest = () => {
    if (!canBuy) return;
    addItem(product);
    trackAnalyticsEvent({ eventName: "add_to_cart", productSlug: product.slug, payload: { source: "product_detail" }, requireConsent: false });
    addLead({
      source: "товар",
      name: "Покупатель",
      phone: "уточнить",
      productName: product.name,
      amount: `${result.needKg.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} кг`,
      total: typeof result.cost === "number" ? `${result.cost.toLocaleString("ru-RU")} ₽` : "уточняется",
      comment: "Заявка добавлена со страницы товара"
    });
    setSent(true);
  };

  return (
    <section className="container-shell py-8">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#66705d]">
        <Link href="/" className="hover:text-[#063b23]">Главная</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-[#063b23]">Каталог</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#102116]">{product.name}</span>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.02fr_0.9fr_410px]">
        <div className="grid gap-4 sm:grid-cols-[86px_1fr]">
          <div className="hidden gap-3 sm:grid">
            <Thumb active><ProductBagVisual product={product} size="sm" /></Thumb>
            <Thumb><Granules /></Thumb>
            <Thumb><PotatoMini /></Thumb>
            <Thumb><FieldMini /></Thumb>
            <Thumb><Granules light /></Thumb>
            <Button variant="outline" className="h-auto rounded-[10px] border-[#173c25]/12 bg-white p-3 text-xs font-black text-[#063b23] hover:bg-[#fff7dd]">
              <Download className="h-4 w-4" />
              Скачать паспорт
            </Button>
          </div>
          <div className="relative h-[560px] self-start overflow-hidden rounded-[18px] border border-[#173c25]/10 bg-[linear-gradient(180deg,#fffdf7,#f5eddd)]">
            <LeafBackdrop />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-[radial-gradient(circle_at_50%_0%,#5b3922,#2b1b11)]" />
            <PotatoScatter />
            <div className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2">
              <ProductBagVisual product={product} size="lg" />
            </div>
          </div>
        </div>

        <div>
          <span className="rounded-[8px] bg-[#fff1be] px-3 py-1.5 text-sm font-black text-[#9a6100]">{product.category}</span>
          <h1 className="mt-5 text-[38px] font-black leading-[1] tracking-[-0.06em] text-[#071a10] sm:text-[52px]">
            {product.name}
          </h1>
          <p className="mt-4 text-lg font-semibold text-[#4d5a4e]">{product.shortDescription}</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5b6659]">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {product.elements.map((element) => (
              <div key={element.symbol} className="min-w-[90px] rounded-[12px] border border-[#173c25]/10 bg-white p-4 shadow-[0_10px_24px_rgba(45,35,17,.05)]">
                <p className="text-xl font-black text-[#102116]">{element.symbol}</p>
                <p className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#102116]">{element.value ?? ""}</p>
                <p className="text-xs font-semibold text-[#596553]">{element.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Benefit icon={<PackageCheck className="h-5 w-5" />} title="Основное действие" text={product.mainAction} />
            <Benefit icon={<ShieldCheck className="h-5 w-5" />} title={product.slug === "sulfat-kaliya" || product.slug === "kalimagneziya" ? "Без хлора" : "Для каких задач"} text={product.advantages[0]} />
            <Benefit icon={<Leaf className="h-5 w-5" />} title="Для каких задач" text={product.tasks.join(", ")} />
            <Benefit icon={<Calculator className="h-5 w-5" />} title="Что важно учесть" text={product.important[0]} />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button onClick={addRequest} className="h-13 rounded-[10px] bg-[#063b23] px-8 text-white hover:bg-[#0d5a36]">
              Связаться
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button asChild variant="outline" className="h-13 rounded-[10px] border-[#f5b400] bg-white px-8 text-[#8c5b00] hover:bg-[#fff4cf]">
              <Link href={`/calculator?product=${product.slug}`}>Рассчитать количество</Link>
            </Button>
          </div>
          {sent ? <p className="mt-3 text-sm font-bold text-[#1f7a45]">Товар добавлен в заявку. Менеджер увидит её в админке.</p> : null}
        </div>

        <aside className="h-fit rounded-[18px] border border-[#173c25]/10 bg-white p-5 shadow-[0_16px_42px_rgba(45,35,17,.08)]">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Быстрый расчёт и заказ</h2>
          <div className="mt-5 grid gap-4">
            <CalcField label="Норма внесения">
              <div className="grid grid-cols-[1fr_96px] overflow-hidden rounded-[10px] border border-[#173c25]/10">
                <input value={norm} onChange={(event) => setNorm(Number(event.target.value))} type="number" className="h-11 px-4 font-bold outline-none" />
                <select value={unit} onChange={(event) => setUnit(event.target.value as typeof unit)} className="border-l border-[#173c25]/10 px-2 text-sm font-bold outline-none">
                  <option value="кг/га">кг/га</option>
                  <option value="г/м²">г/м²</option>
                  <option value="кг/сотка">кг/сотка</option>
                </select>
              </div>
              <p className="mt-2 text-xs font-semibold text-[#7a8373]">Рекомендуемая норма: {product.recommendedRange}</p>
            </CalcField>
            <CalcField label="Вес мешка">
              <input value={bagWeight} onChange={(event) => setBagWeight(Number(event.target.value))} type="number" className="h-11 rounded-[10px] border border-[#173c25]/10 px-4 font-bold outline-none" />
            </CalcField>
            <CalcField label="Площадь участка">
              <div className="grid grid-cols-[1fr_76px] overflow-hidden rounded-[10px] border border-[#173c25]/10">
                <input value={area} onChange={(event) => setArea(Number(event.target.value))} type="number" min={0.01} step={0.1} className="h-11 px-4 font-bold outline-none" />
                <span className="grid place-items-center border-l border-[#173c25]/10 text-sm font-bold">га</span>
              </div>
            </CalcField>
            <div className="rounded-[14px] border border-[#173c25]/10 bg-[#f5f8ee] p-4">
              <p className="text-sm font-black text-[#063b23]">Расчётная потребность</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Metric label="Удобрения нужно" value={`${result.needKg.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} кг`} />
                <Metric label="Количество мешков" value={`${result.bags} шт.`} />
              </div>
              <p className="mt-4 text-xs font-semibold text-[#596553]">Цена за мешок: {formatBuyPrice(product)}</p>
              <div className="mt-3 border-t border-[#173c25]/10 pt-3">
                <p className="text-xs font-semibold text-[#596553]">Итого к оплате</p>
                <p className="text-3xl font-black tracking-[-0.05em] text-[#063b23]">
                  {typeof result.cost === "number" ? `${result.cost.toLocaleString("ru-RU")} ₽` : "уточняется"}
                </p>
              </div>
            </div>
            <Button onClick={addRequest} className="h-12 rounded-[9px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
              <ShoppingCart className="h-5 w-5" />
              Связаться
            </Button>
            <button onClick={addRequest} className="text-center text-sm font-black text-[#102116] hover:text-[#063b23]">
              Перейти в контакты
            </button>
            <div className="rounded-[12px] border border-[#173c25]/10 bg-[#fffdf7] p-3 text-sm font-semibold leading-6 text-[#596553]">
              Рекомендации по нормам и безопасности уточняются по инструкции производителя и зависят от культуры, почвы и технологии выращивания.
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        <InfoBlock title="Что это" items={[product.description, ...product.advantages]} />
        <InfoBlock title="Когда применяют" items={[product.application, ...product.stage]} />
        <InfoBlock title="Что важно учесть" items={product.important} />
        <InfoBlock title="Элементы питания" items={product.elements.map((element) => `${element.symbol} — ${element.label}${element.value ? `, ${element.value}` : ""}`)} />
      </div>

      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black tracking-[-0.05em] text-[#102116]">Похожие товары</h2>
          <Link href="/products" className="text-sm font-black text-[#063b23]">Все товары</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black tracking-[-0.05em] text-[#102116]">Полезные статьи</h2>
          <Link href="/knowledge" className="text-sm font-black text-[#063b23]">Все статьи</Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {relatedArticles.map((article) => (
            <Link key={article.slug} href={`/knowledge/${article.slug}`} className="rounded-[16px] border border-[#173c25]/10 bg-white p-5 shadow-[0_12px_32px_rgba(45,35,17,.05)] transition hover:-translate-y-0.5 hover:border-[#f5b400]/60">
              <p className="text-xs font-bold text-[#7c6423]">{article.date}</p>
              <h3 className="mt-2 text-lg font-black leading-tight text-[#102116]">{article.title}</h3>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#1b6b40]">
                Читать статью <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CalcField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#243427]">
      {label}
      {children}
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#596553]">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#102116]">{value}</p>
    </div>
  );
}

function Benefit({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-[14px] border border-[#173c25]/10 bg-white p-4 shadow-[0_10px_24px_rgba(45,35,17,.05)]">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fff1be] text-[#9a6100]">{icon}</span>
        <h3 className="font-black text-[#102116]">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#596553]">{text}</p>
    </div>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[16px] border border-[#173c25]/10 bg-white p-5 shadow-[0_12px_32px_rgba(45,35,17,.05)]">
      <h3 className="text-lg font-black text-[#102116]">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#4f5e4f]">
        {items.slice(0, 4).map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function Thumb({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div className={`grid h-20 w-20 place-items-center overflow-hidden rounded-[10px] border bg-white ${active ? "border-[#f5b400] ring-2 ring-[#f5b400]/30" : "border-[#173c25]/10"}`}>
      {children}
    </div>
  );
}

function Granules({ light = false }: { light?: boolean }) {
  return (
    <div className={`relative h-full w-full ${light ? "bg-[#f6ead0]" : "bg-[#f0eadc]"}`}>
      {Array.from({ length: 28 }).map((_, index) => (
        <span
          key={index}
          className="absolute h-2 w-2 rounded-full bg-[#b38a54]"
          style={{ left: `${(index * 17) % 90}%`, top: `${(index * 23) % 86}%` }}
        />
      ))}
    </div>
  );
}

function PotatoMini() {
  return <div className="h-full w-full bg-[radial-gradient(circle_at_40%_40%,#e9c28a,#9b6534)]" />;
}

function FieldMini() {
  return <div className="h-full w-full bg-[repeating-linear-gradient(92deg,#365b2d_0_8px,#8b5a2b_8px_16px)]" />;
}

function LeafBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-7 h-52">
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="absolute rounded-[100%_0_100%_0] bg-[linear-gradient(135deg,#8bbb42,#276b20)]"
          style={{
            width: 44 + (index % 4) * 8,
            height: 24 + (index % 3) * 8,
            left: `${(index * 19) % 92}%`,
            top: `${(index * 11) % 80}%`,
            transform: `rotate(${index * 31 - 70}deg)`
          }}
        />
      ))}
    </div>
  );
}

function PotatoScatter() {
  return (
    <div aria-hidden="true">
      {Array.from({ length: 14 }).map((_, index) => (
        <span
          key={index}
          className="absolute bottom-12 rounded-[48%_52%_46%_54%] bg-[radial-gradient(circle_at_34%_28%,#e9c28a_0_10%,#c78f4c_38%,#8f5c2e_100%)] shadow-[inset_-6px_-8px_12px_rgba(74,42,18,.22),0_8px_18px_rgba(45,25,11,.18)]"
          style={{
            width: 42 + (index % 3) * 12,
            height: 34 + (index % 4) * 8,
            left: `${(index * 13) % 92}%`,
            transform: `rotate(${index * 19}deg)`
          }}
        />
      ))}
    </div>
  );
}
