"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, Loader2, PackageCheck, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { formatProductPrice } from "@/data/products";
import { useCart } from "@/components/shop/cart-provider";
import { Button } from "@/components/ui/button";
import { CheckoutStepper } from "@/components/shop/checkout-stepper";

export const lastOrderKey = "kartofert-last-order";

type Errors = Partial<Record<"name" | "phone" | "city" | "address", string>>;

export type StoredOrder = {
  orderId: string;
  number: string;
  total: number;
  bagsCount: number;
  totalWeight: number;
  paymentStatus: "pending" | "paid";
  paymentMethod?: "card";
  paidAt?: string;
  items: Array<{
    slug: string;
    name: string;
    quantity: number;
    weight: number;
    price: number;
    total: number;
    image: string;
  }>;
  customer: {
    buyerType: string;
    name: string;
    phone: string;
    email: string;
    delivery: string;
    city: string;
    address: string;
    comment: string;
  };
};

function productImage(slug: string) {
  return `/assets/products/${slug}/front.png`;
}

export function CheckoutForm() {
  const router = useRouter();
  const { lines, total, getProduct } = useCart();
  const [delivery, setDelivery] = useState("Доставка по Беларуси");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const product = getProduct(line.slug);
          return product
            ? {
                slug: line.slug,
                quantity: line.quantity,
                product,
                weight: line.quantity * product.bagWeight,
                total: (product.price ?? 0) * line.quantity
              }
            : null;
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [lines, getProduct]
  );

  const bagsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  function validate(form: FormData) {
    const nextErrors: Errors = {};
    if (!String(form.get("name") ?? "").trim()) nextErrors.name = "Укажите имя покупателя.";
    if (!String(form.get("phone") ?? "").trim()) nextErrors.phone = "Укажите телефон для связи.";
    if (!String(form.get("city") ?? "").trim()) nextErrors.city = "Укажите город доставки.";
    if (delivery === "Доставка по Беларуси" && !String(form.get("address") ?? "").trim()) {
      nextErrors.address = "Укажите адрес доставки.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!validate(form) || !items.length) return;

    setLoading(true);
    const orderId = `KF-${Date.now().toString().slice(-4).padStart(4, "0")}`;
    const order: StoredOrder = {
      orderId,
      number: orderId,
      total,
      bagsCount,
      totalWeight,
      paymentStatus: "pending",
      items: items.map((item) => ({
        slug: item.slug,
        name: item.product.name,
        quantity: item.quantity,
        weight: item.weight,
        price: item.product.price ?? 0,
        total: item.total,
        image: productImage(item.slug)
      })),
      customer: {
        buyerType: String(form.get("buyerType") ?? ""),
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        delivery,
        city: String(form.get("city") ?? ""),
        address: String(form.get("address") ?? ""),
        comment: String(form.get("comment") ?? "")
      }
    };

    window.localStorage.setItem(lastOrderKey, JSON.stringify(order));
    window.setTimeout(() => {
      router.push("/payment-success");
    }, 450);
  }

  if (!items.length) {
    return (
      <>
        <div className="mb-6">
          <CheckoutStepper active="details" />
        </div>
        <section className="rounded-[26px] border border-dashed border-[#b7ad96] bg-[#fffdf8] p-8 text-center shadow-[0_18px_48px_rgba(45,35,17,.055)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-[18px] bg-[#fff1be] text-[#063b23]">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-[#102116]">Корзина пока пуста</h2>
          <p className="mt-2 text-base font-semibold text-[#65705e]">Добавьте товары, чтобы перейти к оформлению заказа.</p>
          <Button asChild className="mt-6 h-12 rounded-[12px] bg-[#063b23] px-7 text-white hover:bg-[#0d5a36]">
            <Link href="/products">Перейти в каталог</Link>
          </Button>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <CheckoutStepper active="details" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <aside className="order-1 h-fit rounded-[24px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_48px_rgba(45,35,17,.08)] lg:order-2 lg:sticky lg:top-24">
          <OrderSummary items={items} bagsCount={bagsCount} totalWeight={totalWeight} total={total} />
          <Button form="checkout-form" disabled={loading} className="mt-5 h-12 w-full rounded-[13px] bg-[#f5b400] text-base font-black text-[#1b1500] shadow-none hover:bg-[#e8a900]">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-5 w-5" />}
            Перейти к оплате
          </Button>
          <TrustList />
        </aside>

        <form id="checkout-form" onSubmit={submit} noValidate className="order-2 rounded-[24px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_48px_rgba(45,35,17,.06)] md:p-6 lg:order-1">
          <FormBlock title="Покупатель" icon={<ShieldCheck className="h-5 w-5" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Тип покупателя">
                <select name="buyerType" className="field-input">
                  <option>Частный покупатель</option>
                  <option>Дачник / садовод</option>
                  <option>Фермерское хозяйство</option>
                  <option>Оптовый клиент</option>
                </select>
              </Field>
              <Field label="Имя" error={errors.name}>
                <input name="name" placeholder="Ваше имя" className="field-input" />
              </Field>
              <Field label="Телефон" error={errors.phone}>
                <input name="phone" placeholder="+375 ..." className="field-input" />
              </Field>
              <Field label="Электронная почта">
                <input name="email" type="email" placeholder="pochta@example.by" className="field-input" />
              </Field>
            </div>
          </FormBlock>

          <FormBlock title="Доставка" icon={<Truck className="h-5 w-5" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Способ получения">
                <select name="delivery" value={delivery} onChange={(event) => setDelivery(event.target.value)} className="field-input">
                  <option>Доставка по Беларуси</option>
                  <option>Самовывоз</option>
                  <option>Уточнить способ получения</option>
                </select>
              </Field>
              <Field label="Город" error={errors.city}>
                <input name="city" placeholder="Например, Минск" className="field-input" />
              </Field>
            </div>
            {delivery === "Доставка по Беларуси" ? (
              <div className="mt-4">
                <Field label="Адрес доставки" error={errors.address}>
                  <input name="address" placeholder="Улица, дом, корпус, офис или примечание" className="field-input" />
                </Field>
              </div>
            ) : null}
          </FormBlock>

          <FormBlock title="Комментарий" icon={<PackageCheck className="h-5 w-5" />}>
            <Field label="Комментарий">
              <textarea name="comment" placeholder="Дополнительные пожелания по доставке или заказу" className="min-h-28 resize-none rounded-[12px] border border-[#173c25]/10 bg-white px-4 py-3 font-semibold text-[#102116] outline-none focus:border-[#f5b400]" />
            </Field>
          </FormBlock>
        </form>
      </div>
    </>
  );
}

type SummaryItem = {
  slug: string;
  quantity: number;
  weight: number;
  total: number;
  product: {
    name: string;
    price?: number;
  };
};

export function OrderSummary({
  items,
  bagsCount,
  totalWeight,
  total
}: {
  items: SummaryItem[];
  bagsCount: number;
  totalWeight: number;
  total: number;
}) {
  return (
    <>
      <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Ваш заказ</h2>
      <div className="mt-5 grid max-h-[390px] gap-3 overflow-y-auto pr-1 [scrollbar-color:#d8c89a_transparent] [scrollbar-width:thin]">
        {items.map((item) => (
          <div key={item.slug} className="grid grid-cols-[64px_1fr] gap-3 rounded-[16px] bg-[#fffaf0] p-3">
            <Link href={`/products/${item.slug}`} className="relative h-16 overflow-hidden rounded-[12px] bg-[#fbf5e8]">
              <Image src={productImage(item.slug)} alt={item.product.name} fill sizes="70px" className="scale-[1.16] object-contain p-1" />
            </Link>
            <div className="min-w-0">
              <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-black leading-tight text-[#102116] hover:text-[#063b23]">{item.product.name}</Link>
              <p className="mt-1 text-xs font-semibold text-[#65705e]">{item.quantity} меш. · {item.weight} кг</p>
              <div className="mt-1 flex items-center justify-between gap-3 text-xs font-bold">
                <span className="text-[#65705e]">{formatProductPrice(item.product)} / мешок</span>
                <span className="text-[#063b23]">{item.total.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 border-t border-[#173c25]/10 pt-4 text-sm font-semibold text-[#59624f]">
        <SummaryRow label="Позиции" value={items.length.toString()} />
        <SummaryRow label="Мешков" value={bagsCount.toString()} />
        <SummaryRow label="Общий вес" value={`${totalWeight.toLocaleString("ru-RU")} кг`} />
        <div className="mt-2 border-t border-[#173c25]/10 pt-4">
          <SummaryRow label="Сумма" value={`${total.toLocaleString("ru-RU")} ₽`} strong />
        </div>
      </div>
    </>
  );
}

export function StoredOrderSummary({ order, title = "Ваш заказ" }: { order: StoredOrder; title?: string }) {
  const items: SummaryItem[] = order.items.map((item) => ({
    slug: item.slug,
    quantity: item.quantity,
    weight: item.weight,
    total: item.total,
    product: {
      name: item.name,
      price: item.price
    }
  }));

  return (
    <>
      {title ? <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">{title}</h2> : null}
      <div className="mt-5 grid max-h-[390px] gap-3 overflow-y-auto pr-1 [scrollbar-color:#d8c89a_transparent] [scrollbar-width:thin]">
        {items.map((item) => (
          <div key={item.slug} className="grid grid-cols-[64px_1fr] gap-3 rounded-[16px] bg-[#fffaf0] p-3">
            <div className="relative h-16 overflow-hidden rounded-[12px] bg-[#fbf5e8]">
              <Image src={productImage(item.slug)} alt={item.product.name} fill sizes="70px" className="scale-[1.16] object-contain p-1" />
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-black leading-tight text-[#102116]">{item.product.name}</p>
              <p className="mt-1 text-xs font-semibold text-[#65705e]">{item.quantity} меш. · {item.weight} кг</p>
              <div className="mt-1 flex items-center justify-between gap-3 text-xs font-bold">
                <span className="text-[#65705e]">{formatProductPrice(item.product)} / мешок</span>
                <span className="text-[#063b23]">{item.total.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 border-t border-[#173c25]/10 pt-4 text-sm font-semibold text-[#59624f]">
        <SummaryRow label="Позиции" value={order.items.length.toString()} />
        <SummaryRow label="Мешков" value={order.bagsCount.toString()} />
        <SummaryRow label="Общий вес" value={`${order.totalWeight.toLocaleString("ru-RU")} кг`} />
        <div className="mt-2 border-t border-[#173c25]/10 pt-4">
          <SummaryRow label="Сумма" value={`${order.total.toLocaleString("ru-RU")} ₽`} strong />
        </div>
      </div>
    </>
  );
}

export function TrustList() {
  return (
    <div className="mt-5 grid gap-3">
      {[
        ["Безопасное оформление заказа", "Данные используются только для обработки покупки"],
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
  );
}

function FormBlock({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border-b border-[#173c25]/10 py-5 first:pt-0 last:border-b-0 last:pb-0">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#fff8df] text-[#8c5b00]">{icon}</span>
        <h2 className="text-xl font-black tracking-[-0.035em] text-[#102116]">{title}</h2>
      </div>
      {children}
    </section>
  );
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

export function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className={strong ? "text-2xl font-black tracking-[-0.05em] text-[#063b23]" : "font-black text-[#102116]"}>{value}</span>
    </div>
  );
}
