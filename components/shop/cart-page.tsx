"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/shop/cart-provider";
import { createCheckoutOrder } from "@/app/checkout/actions";
import { trackAnalyticsEvent } from "@/components/site/analytics-tracker";
import { canBuyProduct, formatBuyPrice, productImageUrl } from "@/lib/cart-utils";

type FormErrors = Partial<Record<"name" | "phone" | "consent" | "submit", string>>;

export function CartPage() {
  const { lines, total, getProduct, updateQuantity, removeItem, clearCart } = useCart();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const product = getProduct(line.slug);
          return product ? { line, product, available: canBuyProduct(product) } : null;
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [lines, getProduct]
  );

  const purchasable = items.filter((item) => item.available);
  const totalQuantity = purchasable.reduce((sum, item) => sum + item.line.quantity, 0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors: FormErrors = {};
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const comment = String(form.get("comment") ?? "").trim();

    if (!name) nextErrors.name = "Укажите имя.";
    if (!phone) nextErrors.phone = "Укажите телефон.";
    if (form.get("consent") !== "on") nextErrors.consent = "Нужно согласие на обработку персональных данных.";
    if (!purchasable.length) nextErrors.submit = "В корзине нет товаров с подтверждённой ценой.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    const orderNumber = `KF-${Date.now().toString().slice(-6)}`;
    const orderItems = purchasable.map(({ line, product }) => ({
      productId: product.id ?? product.slug,
      slug: product.slug,
      name: product.name,
      image: productImageUrl(product),
      price: product.price,
      currency: product.currency ?? "BYN",
      quantity: line.quantity,
      lineTotal: product.price! * line.quantity
    }));

    const saved = await createCheckoutOrder({
      orderNumber,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      comment,
      items: orderItems,
      subtotal: total,
      total,
      currency: "BYN"
    });

    setLoading(false);
    if (!saved) {
      setErrors({ submit: "Не удалось отправить заказ. Попробуйте ещё раз или свяжитесь с нами через контакты." });
      return;
    }

    trackAnalyticsEvent({ eventName: "checkout_submit", payload: { source: "cart", itemsCount: orderItems.length, total }, requireConsent: false });
    clearCart();
    setSuccess(orderNumber);
  }

  if (success) {
    return (
      <main className="mx-auto w-[min(1160px,calc(100%_-_32px))] py-10">
        <section className="rounded-[28px] border border-[#173c25]/10 bg-white p-8 text-center shadow-[0_18px_48px_rgba(45,35,17,.06)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-[18px] bg-[#eef7e8] text-[#1f7a45]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-[#102116]">Заказ отправлен</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-[#596553]">
            Мы свяжемся с вами для подтверждения цены, наличия, доставки и оплаты.
          </p>
          <p className="mt-4 text-sm font-black text-[#063b23]">Номер заказа: {success}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-[12px] bg-[#f5b400] px-7 text-[#1b1500] hover:bg-[#e8a900]">
              <Link href="/products">Вернуться в каталог</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-[12px] border-[#173c25]/15 bg-white px-7 text-[#063b23]">
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="mx-auto w-[min(1160px,calc(100%_-_32px))] py-10">
        <section className="grid min-h-[420px] place-items-center rounded-[28px] border border-dashed border-[#b7ad96] bg-[#fffdf8] p-8 text-center shadow-[0_18px_48px_rgba(45,35,17,.055)]">
          <div>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-[18px] bg-[#fff1be] text-[#063b23]">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-[34px] font-black tracking-[-0.05em] text-[#102116] sm:text-5xl">Корзина пуста</h1>
            <p className="mx-auto mt-3 max-w-xl text-base font-medium leading-7 text-[#65705e]">Добавьте товары с подтверждённой ценой, чтобы отправить заказ.</p>
            <Button asChild className="mt-7 h-12 rounded-[12px] bg-[#063b23] px-7 text-white hover:bg-[#0d5a36]">
              <Link href="/products">Перейти в каталог</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[min(1280px,calc(100%_-_32px))] py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-[38px] font-black leading-none tracking-[-0.055em] text-[#102116] sm:text-5xl">Корзина</h1>
        <p className="mt-2 text-base font-semibold text-[#596553]">Проверьте товары и отправьте заказ на подтверждение.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
        <section className="overflow-hidden rounded-[24px] border border-[#173c25]/10 bg-white shadow-[0_18px_48px_rgba(45,35,17,.06)]">
          <div className="divide-y divide-[#173c25]/10">
            {items.map(({ line, product, available }) => (
              <article key={line.slug} className="grid gap-4 p-4 md:grid-cols-[96px_1fr_150px_120px_44px] md:items-center">
                <Link href={`/products/${product.slug}`} className="relative h-24 overflow-hidden rounded-[15px] bg-[#fbf5e8]">
                  <Image src={productImageUrl(product)} alt={product.name} fill sizes="120px" className="object-contain p-2" />
                </Link>
                <div>
                  <Link href={`/products/${product.slug}`} className="text-lg font-black leading-tight text-[#102116] hover:text-[#063b23]">
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-[#596553]">{product.packageSize} · {product.category}</p>
                  {!available ? <p className="mt-2 text-sm font-bold text-[#b34330]">Товар больше недоступен для заказа</p> : null}
                </div>
                <p className="font-black text-[#102116]">{formatBuyPrice(product)}</p>
                <div className="flex w-fit items-center rounded-full border border-[#d7d0bf] bg-[#fbf8f1] p-0.5">
                  <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-white" onClick={() => trackQuantity(line.slug, Math.max(1, line.quantity - 1), updateQuantity)}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-black">{line.quantity}</span>
                  <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-white" onClick={() => trackQuantity(line.slug, line.quantity + 1, updateQuantity)}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={() => { removeItem(line.slug); trackAnalyticsEvent({ eventName: "remove_from_cart", productSlug: line.slug, requireConsent: false }); }} className="grid h-10 w-10 place-items-center rounded-full text-[#b34330] transition hover:bg-[#fff0ea]">
                  <Trash2 className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-[24px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_48px_rgba(45,35,17,.08)] lg:sticky lg:top-24">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Оформление заказа</h2>
          <div className="mt-4 grid gap-3 border-b border-[#173c25]/10 pb-4 text-sm font-semibold text-[#59624f]">
            <SummaryRow label="Позиций" value={purchasable.length.toString()} />
            <SummaryRow label="Количество" value={totalQuantity.toString()} />
            <SummaryRow label="Сумма" value={`${total.toLocaleString("ru-RU")} BYN`} strong />
          </div>

          <form onSubmit={submit} className="mt-5 grid gap-4">
            <Field label="Имя" error={errors.name}>
              <input name="name" className="field-input" />
            </Field>
            <Field label="Телефон *" error={errors.phone}>
              <input name="phone" className="field-input" placeholder="+375 ..." />
            </Field>
            <Field label="Email">
              <input name="email" type="email" className="field-input" />
            </Field>
            <Field label="Комментарий">
              <textarea name="comment" className="min-h-24 rounded-[12px] border border-[#173c25]/10 bg-white px-4 py-3 font-semibold text-[#102116] outline-none focus:border-[#f5b400]" />
            </Field>
            <label className="flex gap-3 rounded-[14px] bg-[#fff8df] p-3 text-xs font-semibold leading-5 text-[#4f5e4f]">
              <input name="consent" type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#063b23]" />
              <span>
                Я соглашаюсь на обработку персональных данных и ознакомлен(а) с{" "}
                <Link href="/policy" className="font-black text-[#063b23] underline">Политикой обработки персональных данных</Link>{" "}
                и{" "}
                <Link href="/terms" className="font-black text-[#063b23] underline">Условиями заказа и продажи</Link>.
              </span>
            </label>
            {errors.consent ? <p className="text-xs font-bold text-[#b34330]">{errors.consent}</p> : null}
            {errors.submit ? <p className="rounded-[12px] bg-[#fff0ea] p-3 text-sm font-bold text-[#b34330]">{errors.submit}</p> : null}
            <Button disabled={loading || !purchasable.length} className="h-12 rounded-[13px] bg-[#f5b400] text-base font-black text-[#1b1500] shadow-none hover:bg-[#e8a900] disabled:bg-[#d8d0bf]">
              {loading ? "Отправляем..." : "Отправить заказ"}
            </Button>
          </form>
        </aside>
      </div>
    </main>
  );
}

function trackQuantity(slug: string, quantity: number, updateQuantity: (slug: string, quantity: number) => void) {
  updateQuantity(slug, quantity);
  trackAnalyticsEvent({ eventName: "cart_quantity_change", productSlug: slug, payload: { quantity }, requireConsent: false });
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#384334]">
      {label}
      {children}
      {error ? <span className="text-xs font-bold text-[#b34330]">{error}</span> : null}
    </label>
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
