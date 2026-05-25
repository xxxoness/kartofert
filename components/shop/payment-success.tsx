"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lastOrderKey, StoredOrder, StoredOrderSummary, SummaryRow } from "@/components/shop/checkout-form";
import { CheckoutStepper } from "@/components/shop/checkout-stepper";
import { useCart } from "@/components/shop/cart-provider";

type PaymentErrors = Partial<Record<"cardNumber" | "expiry" | "cvv" | "cardName", string>>;

export function PaymentSuccess() {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [errors, setErrors] = useState<PaymentErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(lastOrderKey);
    if (saved) setOrder(JSON.parse(saved) as StoredOrder);
  }, []);

  function validate(form: FormData) {
    const nextErrors: PaymentErrors = {};
    const cardNumber = String(form.get("cardNumber") ?? "").replace(/\D/g, "");
    const expiry = String(form.get("expiry") ?? "").trim();
    const cvv = String(form.get("cvv") ?? "").replace(/\D/g, "");
    const cardName = String(form.get("cardName") ?? "").trim();

    if (cardNumber.length < 16) nextErrors.cardNumber = "Введите номер карты.";
    if (!/^\d{2}\s?\/\s?\d{2}$/.test(expiry)) nextErrors.expiry = "Укажите срок в формате ММ / ГГ.";
    if (cvv.length < 3) nextErrors.cvv = "Укажите CVV.";
    if (!cardName) nextErrors.cardName = "Укажите имя на карте.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order) return;
    const form = new FormData(event.currentTarget);
    if (!validate(form)) return;

    setLoading(true);
    window.setTimeout(() => {
      const paidOrder: StoredOrder = {
        ...order,
        orderId: order.orderId ?? order.number,
        paymentStatus: "paid",
        paymentMethod: "card",
        paidAt: new Date().toISOString()
      };
      window.localStorage.setItem(lastOrderKey, JSON.stringify(paidOrder));
      clearCart();
      setOrder(paidOrder);
      setLoading(false);
    }, 700);
  }

  if (!order) {
    return (
      <PaymentShell title="Оплата заказа" subtitle="Проверьте сумму и введите данные карты для оплаты заказа.">
        <section className="rounded-[26px] border border-dashed border-[#b7ad96] bg-[#fffdf8] p-8 text-center shadow-[0_18px_48px_rgba(45,35,17,.055)]">
          <h2 className="text-3xl font-black tracking-[-0.05em] text-[#102116]">Заказ не найден</h2>
          <p className="mt-2 text-base font-semibold text-[#65705e]">Вернитесь в корзину и оформите заказ заново.</p>
          <Button asChild className="mt-6 h-12 rounded-[12px] bg-[#f5b400] px-7 text-[#1b1500] shadow-none hover:bg-[#e8a900]">
            <Link href="/cart">Вернуться в корзину</Link>
          </Button>
        </section>
      </PaymentShell>
    );
  }

  if (order.paymentStatus === "paid") {
    return (
      <PaymentShell
        title="Заказ успешно оформлен"
        subtitle="Спасибо! Оплата принята. Мы получили заказ и начали его обработку."
        showStepper={false}
        includePaymentCrumb={false}
      >
        <SuccessScreen order={order} />
      </PaymentShell>
    );
  }

  return (
    <PaymentShell title="Оплата заказа" subtitle="Проверьте сумму и введите данные карты для оплаты заказа.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <form onSubmit={submitPayment} noValidate className="rounded-[24px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_48px_rgba(45,35,17,.06)] md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#fff8df] text-[#8c5b00]">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Банковская карта</h2>
              <p className="mt-1 text-sm font-semibold text-[#65705e]">Введите данные карты для оплаты заказа.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <Field label="Номер карты" error={errors.cardNumber}>
              <input name="cardNumber" inputMode="numeric" placeholder="0000 0000 0000 0000" className="field-input" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Срок действия" error={errors.expiry}>
                <input name="expiry" placeholder="ММ / ГГ" className="field-input" />
              </Field>
              <Field label="CVV" error={errors.cvv}>
                <input name="cvv" inputMode="numeric" placeholder="000" className="field-input" />
              </Field>
            </div>
            <Field label="Имя на карте" error={errors.cardName}>
              <input name="cardName" placeholder="IVAN IVANOV" className="field-input uppercase" />
            </Field>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-[16px] bg-[#fff8df] p-4 text-sm font-semibold leading-6 text-[#6b5527]">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8c5b00]" />
            <p>Платёж защищён. После подтверждения оплаты заказ будет передан в обработку.</p>
          </div>

          <Button disabled={loading} className="mt-5 h-12 w-full rounded-[13px] bg-[#f5b400] text-base font-black text-[#1b1500] shadow-none hover:bg-[#e8a900]">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-5 w-5" />}
            Оплатить {order.total.toLocaleString("ru-RU")} ₽
          </Button>
        </form>

        <aside className="h-fit rounded-[24px] border border-[#173c25]/10 bg-white p-5 shadow-[0_18px_48px_rgba(45,35,17,.08)] lg:sticky lg:top-24">
          <StoredOrderSummary order={order} />
          <PaymentBenefits />
        </aside>
      </div>
    </PaymentShell>
  );
}

function PaymentShell({
  title,
  subtitle,
  children,
  showStepper = true,
  includePaymentCrumb = true
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  showStepper?: boolean;
  includePaymentCrumb?: boolean;
}) {
  return (
    <div>
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#66705d]">
        <Link href="/" className="hover:text-[#063b23]">Главная</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/cart" className="hover:text-[#063b23]">Корзина</Link>
        <ChevronRight className="h-4 w-4" />
        {includePaymentCrumb ? (
          <>
            <Link href="/checkout" className="hover:text-[#063b23]">Оформление заказа</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#102116]">Оплата</span>
          </>
        ) : (
          <span className="text-[#102116]">Оформление заказа</span>
        )}
      </nav>
      <div className="mb-6 max-w-3xl">
        <h1 className="text-[38px] font-black leading-none tracking-[-0.055em] text-[#071a10] md:text-[54px]">{title}</h1>
        <p className="mt-3 text-lg leading-8 text-[#4d5a4e]">{subtitle}</p>
      </div>
      {showStepper ? (
        <div className="mb-6">
          <CheckoutStepper active="payment" />
        </div>
      ) : null}
      {children}
    </div>
  );
}

function PaymentBenefits() {
  return (
    <div className="mt-5 grid gap-3 border-t border-[#173c25]/10 pt-4">
      {[
        "Безопасная оплата",
        "Данные карты не сохраняются",
        "После оплаты заказ передаётся в обработку"
      ].map((item) => (
        <div key={item} className="flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#fff8df] text-[#8c5b00]">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <p className="text-sm font-black text-[#102116]">{item}</p>
        </div>
      ))}
    </div>
  );
}

function SuccessScreen({ order }: { order: StoredOrder }) {
  return (
    <section className="rounded-[26px] border border-[#173c25]/10 bg-white p-6 shadow-[0_24px_80px_rgba(45,35,17,.09)] md:p-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <div className="grid h-16 w-16 place-items-center rounded-[18px] bg-[#eaf8ed] text-[#1f7a45]">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#8a662a]">Оплата</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoBox label="Номер заказа" value={order.number} />
            <InfoBox label="Итого оплачено" value={`${order.total.toLocaleString("ru-RU")} ₽`} />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-[12px] bg-[#f5b400] px-7 text-[#1b1500] shadow-none hover:bg-[#e8a900]">
              <Link href="/products">Вернуться в каталог</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-[12px] border-[#f5b400] bg-white text-[#8c5b00] shadow-none hover:bg-[#fff4cf]">
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-[20px] bg-[#fffaf0] p-4">
          <h3 className="text-xl font-black tracking-[-0.035em] text-[#102116]">Состав заказа</h3>
          <div className="mt-4 grid max-h-[360px] gap-3 overflow-y-auto pr-1 [scrollbar-color:#d8c89a_transparent] [scrollbar-width:thin]">
            {order.items.map((item) => (
              <div key={item.slug} className="grid grid-cols-[56px_1fr] gap-3 rounded-[14px] bg-white p-3">
                <div className="relative h-14 overflow-hidden rounded-[10px] bg-[#fbf5e8]">
                  <Image src={item.image} alt={item.name} fill sizes="60px" className="object-contain p-1" />
                </div>
                <div>
                  <p className="text-sm font-black leading-tight text-[#102116]">{item.name}</p>
                  <p className="mt-1 text-xs font-semibold text-[#65705e]">{item.quantity} меш. · {item.weight} кг · {item.total.toLocaleString("ru-RU")} ₽</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[14px] bg-white p-4 text-sm font-semibold leading-6 text-[#596553]">
            <p><b className="text-[#102116]">Покупатель:</b> {order.customer.name}</p>
            <p><b className="text-[#102116]">Телефон:</b> {order.customer.phone}</p>
            <p><b className="text-[#102116]">Город:</b> {order.customer.city}</p>
          </div>
        </div>
      </div>
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

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-[#fffaf0] p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a662a]">{label}</p>
      <p className="mt-2 text-xl font-black text-[#102116]">{value}</p>
    </div>
  );
}
