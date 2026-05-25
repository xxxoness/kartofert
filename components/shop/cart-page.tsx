"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Minus, PackageCheck, Plus, ShoppingCart, Trash2, Truck } from "lucide-react";
import { formatProductPrice, products } from "@/data/products";
import { useCart } from "@/components/shop/cart-provider";
import { Button } from "@/components/ui/button";
import { CheckoutStepper } from "@/components/shop/checkout-stepper";

const recommendationSlugs = ["sulfate-potassium", "kalimagnesia", "superfosfat"];

function productImage(slug: string) {
  return `/assets/products/${slug}/front.png`;
}

export function CartPage() {
  const { lines, total, getProduct, updateQuantity, removeItem, addItem } = useCart();
  const resolved = lines.map((line) => ({ line, product: getProduct(line.slug) })).filter((item) => item.product);
  const bagsCount = resolved.reduce((sum, item) => sum + item.line.quantity, 0);
  const totalWeight = resolved.reduce((sum, item) => sum + item.line.quantity * (item.product?.bagWeight ?? 0), 0);
  const recommendations = recommendationSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is (typeof products)[number] => Boolean(product));

  if (!resolved.length) {
    return (
      <div className="mx-auto w-[min(1280px,calc(100%_-_32px))] py-8 sm:py-10">
        <Breadcrumbs />
        <section className="grid min-h-[420px] place-items-center rounded-[28px] border border-dashed border-[#b7ad96] bg-[#fffdf8] p-8 text-center shadow-[0_18px_48px_rgba(45,35,17,.055)]">
          <div>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-[18px] bg-[#fff1be] text-[#063b23]">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-[34px] font-black tracking-[-0.05em] text-[#102116] sm:text-5xl">Корзина пока пуста</h1>
            <p className="mx-auto mt-3 max-w-xl text-base font-medium leading-7 text-[#65705e]">Добавьте товары из каталога, чтобы оформить заказ.</p>
            <Button asChild className="mt-7 h-12 rounded-[12px] bg-[#063b23] px-7 text-white hover:bg-[#0d5a36]">
              <Link href="/products">Перейти в каталог</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[min(1280px,calc(100%_-_32px))] pb-12 pt-8 sm:pb-14 sm:pt-10">
      <Breadcrumbs />
      <header className="mb-5">
        <h1 className="text-[38px] font-black leading-none tracking-[-0.055em] text-[#102116] sm:text-5xl">Корзина</h1>
        <p className="mt-2 text-base font-semibold text-[#596553]">Проверьте товары перед оформлением заказа</p>
      </header>
      <div className="mb-6">
        <CheckoutStepper active="cart" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <section className="overflow-hidden rounded-[24px] border border-[#173c25]/10 bg-white shadow-[0_18px_48px_rgba(45,35,17,.06)]">
            <div className="hidden grid-cols-[minmax(390px,1fr)_118px_128px_118px_42px] border-b border-[#173c25]/10 px-5 py-3 text-[11px] font-black uppercase tracking-[0.07em] text-[#7c846f] md:grid">
              <span>Товар</span>
              <span>Цена за мешок</span>
              <span className="text-center">Количество</span>
              <span className="text-right">Итого</span>
              <span />
            </div>

            <div className="divide-y divide-[#173c25]/10">
              {resolved.map(({ line, product }) =>
                product ? (
                  <article key={line.slug} className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(390px,1fr)_118px_128px_118px_42px] md:items-center md:px-5">
                    <div className="grid min-w-0 gap-3 sm:grid-cols-[100px_1fr] sm:items-center">
                      <Link href={`/products/${product.slug}`} className="relative h-[104px] overflow-hidden rounded-[15px] bg-[#fbf5e8]">
                        <Image src={productImage(product.slug)} alt={product.name} fill sizes="130px" className="scale-[1.16] object-contain p-1.5" />
                      </Link>
                      <div className="min-w-0">
                        <Link href={`/products/${product.slug}`} className="block">
                          <h2 className="text-lg font-black leading-[1.15] tracking-[-0.035em] text-[#102116] hover:text-[#063b23] sm:text-xl">{product.name}</h2>
                        </Link>
                        <p className="mt-1.5 text-sm font-semibold leading-5 text-[#596553]">{product.packageSize} · {product.category}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black text-[#063b23]">{product.elements.map((element) => element.symbol).slice(0, 5).join(", ")}</span>
                          <span className="rounded-full bg-[#f7f1e3] px-2 py-0.5 text-[11px] font-black text-[#7b6233]">{product.fertilizerType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end justify-between md:block md:self-center">
                      <span className="text-sm font-bold text-[#65705e] md:hidden">Цена за мешок</span>
                      <p className="text-base font-black tracking-[-0.04em] text-[#102116]">{formatProductPrice(product)}</p>
                      <p className="mt-0.5 hidden text-xs font-bold text-[#65705e] md:block">/ мешок</p>
                    </div>

                    <div className="md:flex md:flex-col md:items-center md:self-center">
                      <div className="flex w-fit items-center rounded-full border border-[#d7d0bf] bg-[#fbf8f1] p-0.5">
                        <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-white" onClick={() => updateQuantity(line.slug, Math.max(1, line.quantity - 1))} aria-label="Уменьшить количество">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-black">{line.quantity}</span>
                        <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-white" onClick={() => updateQuantity(line.slug, line.quantity + 1)} aria-label="Увеличить количество">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1.5 text-xs font-bold text-[#65705e]">{line.quantity * product.bagWeight} кг</p>
                    </div>

                    <div className="flex items-end justify-between gap-3 md:block md:self-center md:text-right">
                      <div>
                        <p className="text-right text-base font-black tracking-[-0.04em] text-[#063b23]">{((product.price ?? 0) * line.quantity).toLocaleString("ru-RU")} ₽</p>
                        <p className="mt-1 text-right text-xs font-bold text-[#65705e]">{line.quantity * product.bagWeight} кг</p>
                      </div>
                      <button onClick={() => removeItem(line.slug)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#b34330] transition hover:bg-[#fff0ea] hover:text-[#7d2f20] md:hidden" aria-label={`Удалить ${product.name}`}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Удалить</span>
                      </button>
                    </div>

                    <button onClick={() => removeItem(line.slug)} className="hidden h-9 w-9 shrink-0 items-center justify-center justify-self-end rounded-full text-[#b34330] transition hover:bg-[#fff0ea] hover:text-[#7d2f20] md:inline-flex" aria-label={`Удалить ${product.name}`}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Удалить</span>
                    </button>
                  </article>
                ) : null
              )}
            </div>

            <div className="border-t border-[#173c25]/10 px-4 py-4 md:px-5">
              <div className="flex items-start gap-3 rounded-[16px] bg-[#fff8df] p-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-white text-[#8c5b00]">
                  <Truck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-black text-[#102116]">Доставка по Беларуси</h3>
                  <p className="mt-1 text-sm font-medium leading-6 text-[#596553]">Уточним адрес и удобный способ получения после оформления заказа. Работаем с физическими и юридическими лицами.</p>
                </div>
              </div>
            </div>
          </section>

          <Recommendations recommendations={recommendations} onAdd={addItem} />
        </div>

        <aside className="h-fit rounded-[24px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_48px_rgba(45,35,17,.08)] lg:sticky lg:top-24">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Итого</h2>
          <div className="mt-5 grid gap-3 text-sm font-semibold text-[#59624f]">
            <SummaryRow label="Позиции" value={resolved.length.toString()} />
            <SummaryRow label="Мешков" value={bagsCount.toString()} />
            <SummaryRow label="Общий вес" value={`${totalWeight.toLocaleString("ru-RU")} кг`} />
            <div className="mt-2 border-t border-[#173c25]/10 pt-4">
              <SummaryRow label="Сумма" value={`${total.toLocaleString("ru-RU")} ₽`} strong />
            </div>
          </div>

          <p className="mt-5 rounded-[16px] bg-[#fff3d8] p-4 text-sm font-semibold leading-6 text-[#6b5527]">После оформления мы подготовим заказ к обработке.</p>

          <div className="mt-5 grid gap-3">
            <Button asChild className="h-13 rounded-[13px] bg-[#f5b400] px-5 text-base font-black text-[#1b1500] shadow-none hover:bg-[#e8a900]">
              <Link href="/checkout">Перейти к оформлению</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-[12px] border-[#f5b400] bg-white text-[#8c5b00] shadow-none hover:bg-[#fff4cf]">
              <Link href="/products">Продолжить покупки</Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              ["Безопасное оформление", "Данные используются только для обработки заказа"],
              ["Доставка по Беларуси", "Подберём удобный способ получения"],
              ["Поддержка по заказу", "Поможем уточнить детали при необходимости"]
            ].map(([title, text]) => (
              <div key={title} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-[#fff8df] text-[#8c5b00]">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-black text-[#102116]">{title}</p>
                  <p className="mt-0.5 text-xs font-semibold leading-5 text-[#65705e]">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Breadcrumbs() {
  return (
    <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#66705d]">
      <Link href="/" className="hover:text-[#063b23]">Главная</Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-[#102116]">Корзина</span>
    </nav>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className={strong ? "text-2xl font-black tracking-[-0.05em] text-[#063b23]" : "font-black text-[#102116]"}>{value}</span>
    </div>
  );
}

function Recommendations({ recommendations, onAdd }: { recommendations: typeof products; onAdd: (product: (typeof products)[number]) => void }) {
  return (
    <section className="mt-6">
      <h2 className="mb-4 text-2xl font-black tracking-[-0.045em] text-[#102116]">Может пригодиться</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {recommendations.map((product) => (
          <article key={product.slug} className="grid h-full grid-cols-[118px_1fr] gap-4 rounded-[20px] border border-[#173c25]/10 bg-white p-4 shadow-[0_14px_34px_rgba(45,35,17,.06)]">
            <Link href={`/products/${product.slug}`} className="relative h-[124px] overflow-hidden rounded-[16px] bg-[#fbf5e8]">
              <Image src={productImage(product.slug)} alt={product.name} fill sizes="132px" className="scale-[1.2] object-contain p-1" />
            </Link>
            <div className="flex min-w-0 flex-col">
              <Link href={`/products/${product.slug}`} className="block">
                <h3 className="line-clamp-2 min-h-[42px] text-[17px] font-black leading-tight tracking-[-0.025em] text-[#102116] hover:text-[#063b23]">{product.name}</h3>
              </Link>
              <p className="mt-1 text-xs font-semibold text-[#65705e]">{product.category}</p>
              <p className="mt-1 text-xs font-bold text-[#102116]">{product.packageSize} · {formatProductPrice(product)} / мешок</p>
              <button onClick={() => onAdd(product)} className="mt-auto inline-flex h-10 w-fit items-center gap-2 rounded-[11px] bg-[#fff8df] px-4 text-sm font-black text-[#7d5700] transition hover:bg-[#fff1be]">
                <ShoppingCart className="h-4 w-4" />
                Добавить
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
