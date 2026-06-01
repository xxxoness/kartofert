"use client";

import type React from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  Leaf,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  ShoppingCart,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addLead, type LeadSource } from "@/components/shop/leads-store";
import { useCart } from "@/components/shop/cart-provider";
import { trackAnalyticsEvent } from "@/components/site/analytics-tracker";
import { products as catalogProducts } from "@/data/products";
import { ProductPageData, ProductPageImage, relatedArticleCards, relatedProductCards } from "@/data/product-pages";
import { canBuyProduct, formatBuyPrice } from "@/lib/cart-utils";

type NormUnit = ProductPageData["calculatorDefaults"]["normUnit"];

const disclaimer =
  "Расчёт ориентировочный. Для точной схемы учитывайте анализ почвы, сорт картофеля, площадь и технологию внесения.";

function formatNumber(value: number, maximumFractionDigits = 1) {
  return value.toLocaleString("ru-RU", { maximumFractionDigits });
}

function calculateNeed({
  areaSotka,
  norm,
  unit,
  bagWeight,
  price
}: {
  areaSotka: number;
  norm: number;
  unit: NormUnit;
  bagWeight: number;
  price?: number;
}) {
  const safeArea = Number.isFinite(areaSotka) ? Math.max(areaSotka, 0) : 0;
  const safeNorm = Number.isFinite(norm) ? Math.max(norm, 0) : 0;
  const safeBagWeight = Number.isFinite(bagWeight) ? Math.max(bagWeight, 1) : 25;
  const safePrice = Number.isFinite(price ?? 0) ? Math.max(price ?? 0, 0) : 0;
  const areaM2 = safeArea * 100;
  const areaHa = safeArea / 100;

  const needKg =
    unit === "г/м²"
      ? (areaM2 * safeNorm) / 1000
      : unit === "кг/га"
        ? areaHa * safeNorm
        : safeArea * safeNorm;

  const bags = Math.ceil(needKg / safeBagWeight);
  return {
    needKg,
    bags,
    cost: bags * safePrice
  };
}

export function NpkProductPage({ product }: { product: ProductPageData }) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState<ProductPageImage>(product.images[0]);
  const [activeOrderTab, setActiveOrderTab] = useState<"bags" | "area">("bags");
  const [bagQuantity, setBagQuantity] = useState(1);
  const [norm, setNorm] = useState(product.calculatorDefaults.norm);
  const [unit, setUnit] = useState<NormUnit>(product.calculatorDefaults.normUnit);
  const [bagWeight, setBagWeight] = useState(product.calculatorDefaults.bagWeight);
  const [areaSotka, setAreaSotka] = useState(product.calculatorDefaults.areaSotka);
  const price = product.calculatorDefaults.price ?? 0;
  const [toast, setToast] = useState<string | null>(null);

  const result = useMemo(
    () => calculateNeed({ areaSotka, norm, unit, bagWeight, price }),
    [areaSotka, bagWeight, norm, price, unit]
  );
  const cartProduct = useMemo(() => {
    const source = catalogProducts.find((item) => item.slug === product.slug);
    if (!source) return undefined;

    return {
      ...source,
      id: product.id,
      name: product.name,
      category: product.category,
      packageSize: `${product.packageWeight} кг`,
      bagWeight: product.packageWeight,
      price: product.price,
      priceLabel: product.priceLabel,
      priceMode: product.priceMode,
      currency: product.currency ?? "BYN",
      inStock: product.inStock ?? source.inStock,
      isPublished: product.isPublished ?? source.isPublished,
      image: product.images[0]?.src
    };
  }, [product]);
  const canBuy = canBuyProduct(cartProduct);
  const displayPrice = cartProduct ? formatBuyPrice(cartProduct) : "Цена уточняется";

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const saveLead = (comment: string) => {
    addLead({
      source: "товар" as LeadSource,
      name: "Покупатель",
      phone: "уточнить",
      productName: product.name,
      amount: `${formatNumber(result.needKg)} кг`,
      total: product.price ? `${formatNumber(result.cost, 0)} BYN` : "Цена уточняется",
      comment
    });
  };

  const sendCalculation = () => {
    saveLead(`Расчёт со страницы ${product.name}. Площадь: ${formatNumber(areaSotka)} соток, норма: ${formatNumber(norm)} ${unit}.`);
    setToast("Расчёт отправлен. Мы свяжемся с вами, уточним наличие, цену и доставку.");
  };

  const leaveRequest = () => {
    saveLead(`Заявка со страницы ${product.name}. Пользователь просит связаться и уточнить условия.`);
    setToast("Заявка отправлена. Мы свяжемся с вами для уточнения цены и доставки.");
    window.setTimeout(() => document.getElementById("order-request")?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  };

  const saveCartDetails = (quantity: number) => {
    if (typeof window === "undefined") return;
    const details = {
      productId: product.slug,
      name: product.name,
      price: product.price ?? 0,
      packageWeight: product.packageWeight,
      quantity,
      totalWeight: quantity * product.packageWeight,
      totalPrice: quantity * (product.price ?? 0)
    };
    try {
      const key = "kartofert-cart-details";
      const saved = window.localStorage.getItem(key);
      const current = saved ? (JSON.parse(saved) as typeof details[]) : [];
      const existing = current.find((item) => item.productId === product.slug);
      const next = existing
        ? current.map((item) =>
            item.productId === product.slug
              ? {
                  ...details,
                  quantity: item.quantity + quantity,
                  totalWeight: (item.quantity + quantity) * product.packageWeight,
                  totalPrice: (item.quantity + quantity) * (product.price ?? 0)
                }
              : item
          )
        : [...current, details];
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Корзина в интерфейсе всё равно обновится через основной cart context.
    }
  };

  const addBagsToCart = (quantity: number, mode: "direct" | "calculated") => {
    const safeQuantity = Math.max(1, Math.ceil(Number(quantity) || 1));
    if (!cartProduct || !canBuy) {
      setToast("Этот товар пока нельзя добавить в корзину. Перейдите в контакты, чтобы уточнить условия.");
      return;
    }

    addItem(cartProduct, safeQuantity);
    void trackAnalyticsEvent({
      eventName: "add_to_cart",
      productSlug: cartProduct.slug,
      payload: {
        product_id: cartProduct.id ?? cartProduct.slug,
        slug: cartProduct.slug,
        name: cartProduct.name,
        price: cartProduct.price,
        quantity: safeQuantity,
        total: safeQuantity * (cartProduct.price ?? 0),
        source: mode === "calculated" ? "product_detail_area" : "product_detail_bags"
      },
      requireConsent: false
    });
    setToast(
      mode === "calculated"
        ? `Товар добавлен в корзину: ${product.name} — ${safeQuantity} меш.`
        : `Товар добавлен в корзину: ${product.name} — ${safeQuantity} меш.`
    );
  };

  return (
    <section className="mx-auto w-[min(1440px,calc(100%_-_32px))] py-4 sm:py-6">
      <Toast message={toast} onClose={() => setToast(null)} />
      <Breadcrumbs product={product} />

      <div className="grid gap-4 xl:grid-cols-[34%_minmax(0,1fr)_27%]">
        <ProductGallery productName={product.name} images={product.images} activeImage={activeImage} onChange={setActiveImage} />

        <div className="min-w-0">
          <span className="inline-flex rounded-[10px] bg-[#fff1be] px-3 py-1.5 text-sm font-black text-[#916106]">
            {product.category}
          </span>
          <h1 className="mt-2.5 text-[32px] font-black leading-[0.96] tracking-[-0.055em] text-[#071a10] sm:text-[42px]">
            {product.name}
          </h1>
          <p className="mt-2.5 text-base font-bold leading-6 text-[#39493b]">{product.shortDescription}</p>
          <p className="mt-2.5 line-clamp-4 text-sm font-medium leading-6 text-[#5f695d]">{product.fullDescription}</p>

          <div className="mt-2.5 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-3 py-2 shadow-[0_10px_22px_rgba(45,35,17,.035)]">
            <p className="text-[13px] font-bold leading-5 text-[#334236]">
              <span className="mr-2 font-black uppercase tracking-[0.1em] text-[#8d650f]">Коротко:</span>
              {product.quickSummary}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.nutrients.map((item) => (
              <span key={item.symbol} className="rounded-full border border-[#173c25]/10 bg-white px-3 py-1.5 text-sm font-black text-[#063b23]">
                {item.symbol}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.tasks.map((task) => (
              <span key={task} className="rounded-full bg-[#edf4e8] px-2.5 py-1 text-xs font-black text-[#315b39]">
                {task}
              </span>
            ))}
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {product.benefits.map((benefit, index) => (
              <BenefitCard key={benefit.title} index={index} title={benefit.title} text={benefit.text} />
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <Button asChild className="h-12 rounded-[12px] bg-[#063b23] px-6 text-white shadow-none hover:bg-[#0d5a36]">
              <Link href="/contacts">
              Связаться
              <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-[12px] border-[#f5b400] bg-white px-6 text-[#8c5b00] hover:bg-[#fff4cf]">
              <Link href="/contacts">Уточнить условия</Link>
            </Button>
          </div>
        </div>

        <aside className="h-fit rounded-[20px] border border-[#173c25]/10 bg-white p-3.5 shadow-[0_18px_46px_rgba(45,35,17,.08)] xl:sticky xl:top-24">
          <div className="grid grid-cols-2 rounded-[14px] border border-[#173c25]/10 bg-[#f8f3e8] p-1">
            <button
              type="button"
              onClick={() => setActiveOrderTab("bags")}
              className={`rounded-[11px] px-3 py-2 text-sm font-black transition ${
                activeOrderTab === "bags" ? "bg-[#063b23] text-white shadow-[0_8px_20px_rgba(6,59,35,.18)]" : "text-[#4f5d52] hover:bg-white"
              }`}
            >
              Купить мешками
            </button>
            <button
              type="button"
              onClick={() => setActiveOrderTab("area")}
              className={`rounded-[11px] px-3 py-2 text-sm font-black transition ${
                activeOrderTab === "area" ? "bg-[#063b23] text-white shadow-[0_8px_20px_rgba(6,59,35,.18)]" : "text-[#4f5d52] hover:bg-white"
              }`}
            >
              Рассчитать по площади
            </button>
          </div>

          {activeOrderTab === "bags" ? (
            <div className="mt-3 grid gap-3">
              <div>
                <h2 className="text-xl font-black tracking-[-0.045em] text-[#102116]">
                  {canBuy ? "Добавить в корзину" : "Уточнить товар"}
                </h2>
                <p className="mt-1 text-sm font-semibold leading-5 text-[#647060]">
                  {canBuy ? "Выберите количество мешков и отправьте товар в корзину." : "Свяжитесь с нами, чтобы уточнить цену, наличие и доставку."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] p-3">
                  <p className="text-xs font-bold text-[#647060]">Цена за мешок</p>
                  <p className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#102116]">{displayPrice}</p>
                </div>
                <div className="rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] p-3">
                  <p className="text-xs font-bold text-[#647060]">Фасовка</p>
                  <p className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#102116]">{product.packageWeight} кг</p>
                </div>
              </div>

              <div className="rounded-[16px] border border-[#173c25]/10 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-[#102116]">Количество мешков</p>
                  <div className="flex items-center rounded-full border border-[#d7d0bf] bg-[#fbf8f1] p-1">
                    <button type="button" onClick={() => setBagQuantity((value) => Math.max(1, value - 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white" aria-label="Уменьшить количество">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-black">{bagQuantity}</span>
                    <button type="button" onClick={() => setBagQuantity((value) => value + 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white" aria-label="Увеличить количество">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Metric label="Количество" value={`${bagQuantity} меш.`} />
                  <Metric label="Вес" value={`${bagQuantity * product.packageWeight} кг`} />
                  <Metric label="Итого" value={canBuy ? `${formatNumber(bagQuantity * (cartProduct?.price ?? 0), 0)} BYN` : "уточняется"} />
                </div>
              </div>

              {canBuy ? (
                <>
                  <Button onClick={() => addBagsToCart(bagQuantity, "direct")} className="h-11 rounded-[12px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
                    <ShoppingCart className="h-5 w-5" />
                    Добавить в корзину
                  </Button>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                    <Link href="/cart" className="rounded-[12px] border border-[#173c25]/10 bg-white px-4 py-2.5 text-center text-sm font-black text-[#063b23] transition hover:border-[#f5b400]/70 hover:bg-[#fff8df]">
                      Перейти в корзину
                    </Link>
                    <Link href="/contacts" className="rounded-[12px] border border-[#173c25]/10 bg-white px-4 py-2.5 text-center text-sm font-black text-[#063b23] transition hover:border-[#f5b400]/70 hover:bg-[#fff8df]">
                      Перейти в контакты
                    </Link>
                  </div>
                </>
              ) : (
                <Button asChild className="h-11 rounded-[12px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
                  <Link href="/contacts">Уточнить условия</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="mt-3 grid gap-2.5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[#fff1be] text-[#866000]">
                  <Calculator className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-xl font-black tracking-[-0.045em] text-[#102116]">Быстрый расчёт</h2>
                  <p className="text-xs font-bold text-[#647060]">Для участков и хозяйств</p>
                </div>
              </div>
              <CalcField label="Норма внесения">
                <div className="grid grid-cols-[1fr_112px] overflow-hidden rounded-[12px] border border-[#173c25]/10 bg-white">
                  <input value={norm} onChange={(event) => setNorm(Number(event.target.value))} type="number" min={0} className="h-10 px-3 font-black text-[#102116] outline-none" />
                  <select value={unit} onChange={(event) => setUnit(event.target.value as NormUnit)} className="border-l border-[#173c25]/10 bg-[#fffdf8] px-2 text-sm font-black text-[#102116] outline-none">
                    <option value="кг/га">кг/га</option>
                    <option value="г/м²">г/м²</option>
                    <option value="кг/сотка">кг/сотка</option>
                  </select>
                </div>
                <p className="mt-1.5 text-xs font-bold leading-5 text-[#7b8477]">Базовая норма KartoFert: 60–90 г/м².</p>
              </CalcField>

              <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
                <CalcField label="Вес мешка">
                  <InputWithSuffix value={bagWeight} onChange={setBagWeight} suffix="кг" />
                </CalcField>
                <CalcField label="Площадь участка">
                  <InputWithSuffix value={areaSotka} onChange={setAreaSotka} suffix="соток" step={0.1} />
                </CalcField>
              </div>

              <div className="rounded-[16px] border border-[#173c25]/10 bg-[#f4f8ef] p-2.5">
                <p className="text-sm font-black text-[#063b23]">Результат расчёта</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Metric label="Нужно, кг" value={`${formatNumber(result.needKg)} кг`} />
                  <Metric label="Мешков" value={`${result.bags} шт.`} />
                </div>
                <div className="mt-2 rounded-[12px] bg-white p-2.5">
                  <p className="text-xs font-bold text-[#647060]">Итого</p>
                  <p className="text-3xl font-black tracking-[-0.05em] text-[#063b23]">{canBuy ? `${formatNumber(result.bags * (cartProduct?.price ?? 0), 0)} BYN` : "уточняется"}</p>
                </div>
              </div>

              {canBuy ? (
                <>
                  <Button onClick={() => addBagsToCart(result.bags, "calculated")} className="h-11 rounded-[12px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
                    <ShoppingCart className="h-5 w-5" />
                    Добавить в корзину
                  </Button>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                    <Link href="/cart" className="rounded-[12px] border border-[#173c25]/10 bg-white px-4 py-2.5 text-center text-sm font-black text-[#063b23] transition hover:border-[#f5b400]/70 hover:bg-[#fff8df]">
                      Перейти в корзину
                    </Link>
                    <Link href="/contacts" className="rounded-[12px] border border-[#173c25]/10 bg-white px-4 py-2.5 text-center text-sm font-black text-[#063b23] transition hover:border-[#f5b400]/70 hover:bg-[#fff8df]">
                      Перейти в контакты
                    </Link>
                  </div>
                </>
              ) : (
                <Button asChild className="h-11 rounded-[12px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
                  <Link href="/contacts">Уточнить условия</Link>
                </Button>
              )}
              <WarningNote text={disclaimer} compact />
            </div>
          )}
        </aside>
      </div>

      <InfoCards product={product} />
      <Characteristics product={product} />
      <Instruction product={product} />
      <OrderSteps product={product} onSend={sendCalculation} />
      <RelatedProducts product={product} />
      <RelatedArticles product={product} />
    </section>
  );
}

function Breadcrumbs({ product }: { product: ProductPageData }) {
  const items = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/products" },
    { label: product.category, href: "/products" },
    { label: product.name }
  ];

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm font-bold text-[#6a7469]">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="transition hover:text-[#063b23]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#102116]">{item.label}</span>
          )}
          {index < items.length - 1 ? <ChevronRight className="h-4 w-4 text-[#9aa196]" /> : null}
        </span>
      ))}
    </nav>
  );
}

function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  if (!message) return null;
  return (
    <div className="fixed right-4 top-20 z-50 max-w-[360px] rounded-[16px] border border-[#173c25]/10 bg-white p-4 shadow-[0_18px_48px_rgba(45,35,17,.16)]">
      <div className="flex gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#edf4e8] text-[#063b23]">
          <Info className="h-5 w-5" />
        </span>
        <div>
          <p className="font-black text-[#102116]">Готово</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-[#536052]">{message}</p>
        </div>
        <button type="button" onClick={onClose} className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#6a7469] hover:bg-[#f4efe5]" aria-label="Закрыть уведомление">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function WarningNote({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <div className={`flex gap-2 rounded-[12px] border border-[#f5b400]/35 bg-[#fff8df] ${compact ? "p-2.5 text-xs leading-5" : "p-3 text-sm leading-6"} font-bold text-[#5d4611]`}>
      <Info className={`${compact ? "mt-0.5 h-4 w-4" : "mt-0.5 h-5 w-5"} shrink-0 text-[#a56f00]`} />
      <p>{text}</p>
    </div>
  );
}

function ProductGallery({
  productName,
  images,
  activeImage,
  onChange
}: {
  productName: string;
  images: ProductPageImage[];
  activeImage: ProductPageImage;
  onChange: (image: ProductPageImage) => void;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const activeIndex = Math.max(0, images.findIndex((image) => image.id === activeImage.id));
  const showImage = (direction: -1 | 1) => {
    const nextIndex = (activeIndex + direction + images.length) % images.length;
    onChange(images[nextIndex]);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") showImage(-1);
      if (event.key === "ArrowRight") showImage(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, lightboxOpen]);

  useEffect(() => {
    setZoom(1);
  }, [activeImage.id, lightboxOpen]);

  return (
    <div className="grid gap-3 sm:grid-cols-[64px_1fr]">
      <div className="order-2 flex gap-2.5 sm:order-1 sm:flex-col">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => onChange(image)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[13px] border bg-[#fffdf8] transition ${
              activeImage.id === image.id ? "border-[#f5b400] shadow-[0_10px_24px_rgba(245,180,0,.18)]" : "border-[#173c25]/10 hover:border-[#063b23]/35"
            }`}
            aria-label={image.label}
          >
            <Image src={image.src} alt={`${productName}: ${image.label}`} fill sizes="64px" className="object-contain p-1" />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative order-1 min-h-[285px] overflow-hidden rounded-[22px] border border-[#173c25]/10 bg-[radial-gradient(circle_at_50%_18%,#ffffff_0%,#fffaf0_39%,#efe5d0_100%)] shadow-[0_18px_42px_rgba(45,35,17,.09)] transition hover:border-[#f5b400]/60 sm:order-2 xl:min-h-[350px]"
        aria-label="Открыть фото товара"
      >
        <div className="absolute inset-x-6 bottom-5 h-16 rounded-[50%] bg-[#4c301c]/10 blur-xl" />
        <Image
          src={activeImage.src}
          alt={`${productName}: ${activeImage.label}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 420px"
          className="scale-[1.2] object-contain p-0 transition-transform duration-300 sm:scale-[1.27]"
        />
      </button>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#071a10]/82 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl rounded-[24px] border border-white/10 bg-[#fffaf0] p-3 shadow-[0_24px_80px_rgba(0,0,0,.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-[#102116] shadow-[0_10px_24px_rgba(45,35,17,.18)]"
              aria-label="Закрыть фото"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute left-4 top-4 z-10 flex gap-2">
              <button type="button" onClick={() => setZoom((value) => Math.min(2.2, Number((value + 0.2).toFixed(1))))} className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#102116] shadow-[0_10px_24px_rgba(45,35,17,.18)]" aria-label="Увеличить фото">
                <Plus className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setZoom((value) => Math.max(1, Number((value - 0.2).toFixed(1))))} className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#102116] shadow-[0_10px_24px_rgba(45,35,17,.18)]" aria-label="Уменьшить фото">
                <Minus className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setZoom(1)} className="inline-flex h-9 items-center gap-1 rounded-full bg-white px-3 text-xs font-black text-[#102116] shadow-[0_10px_24px_rgba(45,35,17,.18)]" aria-label="Сбросить масштаб">
                <RotateCcw className="h-4 w-4" />
                1:1
              </button>
            </div>
            <button
              type="button"
              onClick={() => setZoom((value) => (value === 1 ? 1.8 : 1))}
              className="relative h-[min(76vh,700px)] w-full overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_50%_20%,#ffffff_0%,#fff5df_48%,#ead8b8_100%)]"
              aria-label="Переключить масштаб фото"
            >
              <Image
                src={activeImage.src}
                alt={`${productName}: ${activeImage.label}`}
                fill
                sizes="90vw"
                className="object-contain p-1 transition-transform duration-200 sm:p-3"
                style={{ transform: `scale(${zoom})` }}
              />
            </button>
            <p className="mt-2 text-center text-xs font-bold text-[#6a7469]">Клик по изображению переключает масштаб 1x / 1.8x</p>
            <button
              type="button"
              onClick={() => showImage(-1)}
              className="absolute left-6 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[#102116] shadow-[0_10px_24px_rgba(45,35,17,.18)]"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => showImage(1)}
              className="absolute right-6 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[#102116] shadow-[0_10px_24px_rgba(45,35,17,.18)]"
              aria-label="Следующее фото"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="mt-3 flex justify-center gap-2">
              {images.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => onChange(image)}
                  className={`relative h-14 w-14 overflow-hidden rounded-[12px] border bg-white ${
                    activeImage.id === image.id ? "border-[#f5b400]" : "border-[#173c25]/10"
                  }`}
                  aria-label={image.label}
                >
                  <Image src={image.src} alt={image.label} fill sizes="56px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BenefitCard({ index, title, text }: { index: number; title: string; text: string }) {
  const icons = [PackageCheck, Leaf, ShieldCheck, BadgeCheck];
  const Icon = icons[index] ?? PackageCheck;
  return (
    <div className="rounded-[15px] border border-[#173c25]/10 bg-white p-3.5 shadow-[0_12px_30px_rgba(45,35,17,.045)]">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-[#fff1be] text-[#8c5b00]">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-black text-[#102116]">{title}</h3>
      </div>
      <p className="text-[13px] font-semibold leading-5 text-[#5f695d]">{text}</p>
    </div>
  );
}

function CalcField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-black text-[#1c2d20]">{label}</span>
      {children}
    </label>
  );
}

function InputWithSuffix({
  value,
  onChange,
  suffix,
  step = 1
}: {
  value: number;
  onChange: (value: number) => void;
  suffix: string;
  step?: number;
}) {
  return (
    <div className="grid grid-cols-[1fr_68px] overflow-hidden rounded-[12px] border border-[#173c25]/10 bg-white">
      <input
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        min={0}
        step={step}
        className="h-11 min-w-0 px-4 font-black text-[#102116] outline-none"
      />
      <span className="grid place-items-center border-l border-[#173c25]/10 bg-[#fffdf8] text-sm font-black text-[#596553]">{suffix}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-white p-2.5">
      <p className="text-xs font-bold text-[#647060]">{label}</p>
      <p className="mt-1 text-xl font-black tracking-[-0.045em] text-[#102116]">{value}</p>
    </div>
  );
}

function InfoCards({ product }: { product: ProductPageData }) {
  return (
    <section className="mt-5 grid gap-3 lg:grid-cols-4">
      {product.infoCards.map((card) => (
        <article key={card.title} className="rounded-[17px] border border-[#173c25]/10 bg-white p-3.5 shadow-[0_12px_30px_rgba(45,35,17,.05)]">
          <h2 className="text-base font-black tracking-[-0.03em] text-[#102116]">{card.title}</h2>
          <p className="mt-1.5 text-[13px] font-semibold leading-5 text-[#5f695d]">{card.text}</p>
          {card.items ? (
            <ul className="mt-2.5 space-y-1">
              {card.items.map((item) => (
                <li key={item} className="flex gap-2 text-xs font-bold leading-5 text-[#354337]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5b400]" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}

function Characteristics({ product }: { product: ProductPageData }) {
  const nutrientFormulaClass =
    product.nutrients.length === 1
      ? "grid-cols-1"
      : product.nutrients.length === 2
        ? "grid-cols-[1fr_auto_1fr]"
        : product.nutrients.length === 3
          ? "grid-cols-[1fr_auto_1fr_auto_1fr]"
          : "grid-cols-2 sm:grid-cols-3";

  return (
    <section className="mt-6 rounded-[24px] border border-[#173c25]/10 bg-[#fffdf8] p-3.5 shadow-[0_14px_34px_rgba(45,35,17,.05)]">
      <div className="mb-3 flex flex-col gap-2 rounded-[18px] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[24px] font-black tracking-[-0.05em] text-[#102116]">Характеристики и состав</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#edf4e8] px-3 py-1 text-xs font-black text-[#315b39]">NPK</span>
          <span className="rounded-full bg-[#fff1be] px-3 py-1 text-xs font-black text-[#8c5b00]">25 кг</span>
          <span className="rounded-full bg-[#f3efe5] px-3 py-1 text-xs font-black text-[#596553]">гранулы</span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[18px] border border-[#173c25]/10 bg-white p-3.5">
          <div className="mb-2.5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8d650f]">Параметры</p>
              <h3 className="text-xl font-black tracking-[-0.04em] text-[#102116]">Таблица характеристик</h3>
              <p className="mt-0.5 text-xs font-semibold text-[#6a7469]">Основные параметры товара для сравнения и расчёта.</p>
            </div>
            <span className="hidden rounded-full border border-[#173c25]/10 px-3 py-1 text-xs font-black text-[#425045] sm:inline-flex">
              {product.priceLabel}
            </span>
          </div>
          <div className="overflow-hidden rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8]">
            {product.characteristics.map((row, index) => (
              <div key={row.label} className={`grid gap-2 px-3.5 py-2 sm:grid-cols-[190px_1fr] ${index < product.characteristics.length - 1 ? "border-b border-[#173c25]/10" : ""}`}>
                <p className="text-[13px] font-black text-[#425045]">{row.label}</p>
                <p className="text-[13px] font-semibold leading-5 text-[#102116]">{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex h-full flex-col rounded-[18px] border border-[#173c25]/10 bg-white p-3.5">
          <div className="mb-2.5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8d650f]">Состав</p>
              <h3 className="text-xl font-black tracking-[-0.04em] text-[#102116]">Элементы питания</h3>
            </div>
            <span className="rounded-full bg-[#fff1be] px-3 py-1 text-xs font-black text-[#8c5b00]">NPK</span>
          </div>

          <div className="rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] p-2.5">
            <div className={`grid ${nutrientFormulaClass} items-stretch gap-1.5`}>
              {product.nutrients.map((nutrient, index) => (
                <Fragment key={nutrient.symbol}>
                  <div className="rounded-[12px] border border-[#173c25]/10 bg-white px-2 py-2 text-center shadow-[0_8px_18px_rgba(45,35,17,.04)]">
                    <p className="text-[22px] font-black tracking-[-0.07em] text-[#063b23]">{nutrient.symbol}</p>
                    {nutrient.value ? <p className="mt-0.5 text-xs font-black text-[#8c5b00]">{nutrient.value}</p> : null}
                  </div>
                  {product.nutrients.length <= 3 && index < product.nutrients.length - 1 ? <span className="self-center text-lg font-black text-[#c98a00]">+</span> : null}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="mt-2.5 grid gap-2">
            {product.nutrients.map((nutrient) => (
              <div key={nutrient.symbol} className="rounded-[14px] border border-[#173c25]/10 bg-white px-3 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-[#102116]">
                    {nutrient.symbol} — {nutrient.label.toLowerCase()}
                  </p>
                  {nutrient.value ? <span className="rounded-full bg-[#fff1be] px-2.5 py-1 text-xs font-black text-[#8c5b00]">{nutrient.value}</span> : null}
                </div>
                <p className="mt-1.5 text-xs font-semibold leading-5 text-[#5f695d]">{nutrient.description}.</p>
              </div>
            ))}
          </div>

          <div className="mt-2.5 rounded-[14px] border border-[#f5b400]/30 bg-[#fff8df] p-3 text-xs font-bold leading-5 text-[#5d4611]">
            Норма подбирается по площади, анализу почвы и технологии выращивания.
          </div>
        </aside>
      </div>
    </section>
  );
}

function Instruction({ product }: { product: ProductPageData }) {
  return (
    <section className="mt-6 rounded-[22px] border border-[#173c25]/10 bg-white p-4 shadow-[0_16px_38px_rgba(45,35,17,.05)]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#edf4e8] text-[#063b23]">
          <FileText className="h-5 w-5" />
        </span>
        <h2 className="text-[24px] font-black tracking-[-0.05em] text-[#102116]">{product.instruction.title}</h2>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3 text-sm font-semibold leading-6 text-[#4f5d52]">
          {product.instruction.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <WarningNote text={product.instruction.important} />
        </div>
        <div className="rounded-[17px] border border-[#173c25]/10 bg-[#fffdf8] p-4">
          <h3 className="font-black text-[#102116]">Базовая схема</h3>
          <ol className="mt-3 space-y-2.5">
            {product.instruction.steps.map((step, index) => (
              <li key={step} className="flex gap-2.5 text-[13px] font-bold leading-5 text-[#354337]">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#063b23] text-xs text-white">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function OrderSteps({ product, onSend }: { product: ProductPageData; onSend: () => void }) {
  return (
    <section id="order-request" className="mt-6 rounded-[20px] border border-[#173c25]/10 bg-[#102116] p-4 text-white shadow-[0_16px_38px_rgba(45,35,17,.1)]">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#f5b400]">Заявка</p>
          <h2 className="mt-1 text-[24px] font-black tracking-[-0.05em]">Как оформить заявку</h2>
        </div>
        <Button onClick={onSend} className="h-11 rounded-[12px] bg-[#f5b400] px-5 text-[#1b1500] shadow-none hover:bg-[#e8a900]">
          <Send className="h-5 w-5" />
          Отправить расчёт
        </Button>
      </div>
      <div className="mt-4 grid gap-2.5 md:grid-cols-5">
        {product.orderSteps.map((step, index) => (
          <div key={step} className="rounded-[14px] border border-white/10 bg-white/8 p-3">
            <p className="text-sm font-black text-[#f5b400]">0{index + 1}</p>
            <p className="mt-1.5 text-[13px] font-bold leading-5">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RelatedProducts({ product }: { product: ProductPageData }) {
  const related = relatedProductCards(product.relatedProducts);
  return (
    <section className="mt-7">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black tracking-[-0.05em] text-[#102116]">Похожие товары</h2>
        <Link href="/products" className="text-sm font-black text-[#063b23] hover:text-[#0d5a36]">Все товары</Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((item) => (
          <Link key={item.slug} href={`/products/${item.slug}`} className="group flex min-h-[235px] flex-col rounded-[17px] border border-[#173c25]/10 bg-white p-2.5 shadow-[0_12px_30px_rgba(45,35,17,.05)] transition hover:-translate-y-1 hover:border-[#f5b400]/70 hover:shadow-[0_18px_36px_rgba(45,35,17,.08)]">
            <div className="relative h-40 overflow-hidden rounded-[14px] bg-[#fbf5e8]">
              <Image src={`/assets/products/${item.slug}/front.png`} alt={item.name} fill sizes="(max-width: 768px) 50vw, 260px" className="scale-[1.12] object-contain p-1.5 transition duration-500 group-hover:scale-[1.18]" />
            </div>
            <span className="mt-2 w-fit rounded-full bg-[#edf4e8] px-2.5 py-0.5 text-[11px] font-black text-[#315b39]">{item.category}</span>
            <h3 className="mt-1.5 line-clamp-2 text-[15px] font-black leading-tight text-[#102116]">{item.name}</h3>
            <p className="mt-1 text-xs font-bold text-[#657064]">{item.elements.map((element) => element.symbol).join(", ")} · {item.packageSize}</p>
            <div className="mt-auto flex items-center justify-between pt-2">
              <p className="text-xl font-black tracking-[-0.05em] text-[#102116]">{item.price ? `${item.price} BYN` : "Цена уточняется"}</p>
              <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#063b23] text-white">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function RelatedArticles({ product }: { product: ProductPageData }) {
  const related = relatedArticleCards(product.relatedArticles);
  const articleImages = ["/assets/articles/potato-planting.jpg", "/assets/articles/potato-field.jpg", "/assets/articles/potato-deficiency.jpg"];
  return (
    <section className="mt-7">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black tracking-[-0.05em] text-[#102116]">Полезные статьи</h2>
        <Link href="/knowledge" className="text-sm font-black text-[#063b23] hover:text-[#0d5a36]">Все статьи</Link>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {related.map((article, index) => (
          <Link key={article.slug} href={`/knowledge/${article.slug}`} className="group overflow-hidden rounded-[18px] border border-[#173c25]/10 bg-white shadow-[0_12px_30px_rgba(45,35,17,.05)] transition hover:-translate-y-1 hover:border-[#f5b400]/70 hover:shadow-[0_18px_36px_rgba(45,35,17,.08)]">
            <div className="relative h-36 overflow-hidden bg-[#fbf5e8]">
              <Image src={articleImages[index % articleImages.length]} alt={article.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-4">
              <p className="text-xs font-bold text-[#7c6423]">{article.date}</p>
              <h3 className="mt-2 min-h-[44px] text-base font-black leading-tight text-[#102116]">{article.title}</h3>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#1b6b40]">
                Читать статью <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
