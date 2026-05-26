"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calculator as CalculatorIcon, MessageCircle, Save, ShieldCheck } from "lucide-react";
import { Product, products as baseProducts } from "@/data/products";
import {
  calculateScheme,
  calculateSingleProduct,
  convertAreaToHa,
  convertRateToKgPerHa,
  formatKg,
  formatPrice,
  normalizeNumber,
  NormMode,
  NormUnit,
  validateCalculatorInput
} from "@/data/calculator-rules";
import { Button } from "@/components/ui/button";
import { useProductsStore } from "@/components/shop/product-store";
import { useCart } from "@/components/shop/cart-provider";

type CalculatorMode = "scheme" | "single";
type SchemeVariant = "economy" | "optimum" | "premium";
type AreaMode = "sotka" | "hectare";

type SchemeItem = {
  slug: string;
  role: string;
  rateFactor: number;
};

type CalculatedSchemeItem = SchemeItem & {
  product: Product;
  rateKgPerHa: number;
  bagWeightKg: number;
  pricePerBag: number;
  quantity: number;
  requiredKg: number;
  weight: number;
  total: number;
};

const savedCalculationKey = "kartofert-saved-calculation";

const variantMeta: Record<SchemeVariant, { title: string; subtitle: string; priceLabel: string; items: SchemeItem[] }> = {
  economy: {
    title: "Эконом",
    subtitle: "Базовое питание",
    priceLabel: "по запросу",
    items: [
      { slug: "npk-potato", role: "Основное питание", rateFactor: 0.55 },
      { slug: "diammofoska", role: "Стартовое питание", rateFactor: 0.42 }
    ]
  },
  optimum: {
    title: "Оптимум",
    subtitle: "Сбалансированное питание",
    priceLabel: "по запросу",
    items: [
      { slug: "diammofoska", role: "Стартовое питание", rateFactor: 0.42 },
      { slug: "npk-potato", role: "Основное питание", rateFactor: 0.55 },
      { slug: "kalimagnesia", role: "Улучшение качества", rateFactor: 0.34 },
      { slug: "superfosfat", role: "Развитие корней", rateFactor: 0.36 }
    ]
  },
  premium: {
    title: "Премиум",
    subtitle: "Расширенная схема питания",
    priceLabel: "по запросу",
    items: [
      { slug: "diammofoska", role: "Стартовое питание", rateFactor: 0.48 },
      { slug: "npk-potato", role: "Основное питание", rateFactor: 0.62 },
      { slug: "kalimagnesia", role: "Улучшение качества", rateFactor: 0.42 },
      { slug: "superfosfat", role: "Развитие корней", rateFactor: 0.4 },
      { slug: "borofoska", role: "Микроэлементы", rateFactor: 0.22 }
    ]
  }
};

function productImage(slug: string) {
  return `/assets/products/${slug}/front.png`;
}

export function Calculator() {
  const searchParams = useSearchParams();
  const { products } = useProductsStore();
  const { addItem } = useCart();
  const items = products.length ? products : baseProducts;
  const initialSlug = searchParams.get("product") ?? "npk-potato";
  const [mode, setMode] = useState<CalculatorMode>("scheme");
  const [areaMode, setAreaMode] = useState<AreaMode>("sotka");
  const [area, setArea] = useState("25");
  const [culture, setCulture] = useState("Картофель");
  const [variant, setVariant] = useState<SchemeVariant>("optimum");
  const [productSlug, setProductSlug] = useState(initialSlug);
  const selectedProduct = items.find((item) => item.slug === productSlug) ?? items.find((item) => item.slug === "npk-potato") ?? items[0];
  const [normMode, setNormMode] = useState<NormMode>("culture");
  const [norm, setNorm] = useState(String(selectedProduct.defaultNorm));
  const [normUnit, setNormUnit] = useState<NormUnit>(selectedProduct.normUnit);
  const [bagWeight, setBagWeight] = useState(String(selectedProduct.bagWeight));
  const [price, setPrice] = useState(String(selectedProduct.price ?? 0));
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (normMode === "culture") {
      setNorm(String(selectedProduct.defaultNorm));
      setNormUnit(selectedProduct.normUnit);
    }
    setBagWeight(String(selectedProduct.bagWeight));
    setPrice(String(selectedProduct.price ?? 0));
  }, [normMode, selectedProduct]);

  const areaValidation = useMemo(
    () => validateCalculatorInput({ area, norm: "1", bagWeight: "1", price: "0" }),
    [area]
  );
  const singleValidation = useMemo(
    () => validateCalculatorInput({ area, norm, bagWeight, price }),
    [area, bagWeight, norm, price]
  );
  const activeValidation = mode === "scheme" ? areaValidation : singleValidation;
  const areaHa = useMemo(() => convertAreaToHa(area, areaMode), [area, areaMode]);

  const scheme = useMemo<CalculatedSchemeItem[]>(() => {
    const rawItems = variantMeta[variant].items
      .map((schemeItem) => {
        const product = items.find((item) => item.slug === schemeItem.slug);
        if (!product) return null;
        return {
          ...schemeItem,
          product,
          rateKgPerHa: convertRateToKgPerHa(product.defaultNorm, product.normUnit) * schemeItem.rateFactor,
          bagWeightKg: product.bagWeight,
          pricePerBag: product.price ?? 0
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    return calculateScheme({ areaHa, items: rawItems }).items.map((item) => ({
      ...item,
      quantity: item.calculation.bagsRounded,
      requiredKg: item.calculation.requiredKg,
      weight: item.calculation.totalWeightKg,
      total: item.calculation.totalPrice
    }));
  }, [areaHa, items, variant]);

  const schemeTotals = useMemo(
    () => ({
      bags: scheme.reduce((sum, item) => sum + item.quantity, 0),
      weight: scheme.reduce((sum, item) => sum + item.weight, 0),
      cost: scheme.reduce((sum, item) => sum + item.total, 0),
      requiredKg: scheme.reduce((sum, item) => sum + item.requiredKg, 0)
    }),
    [scheme]
  );

  const singleCalculation = useMemo(() => {
    const rateKgPerHa = convertRateToKgPerHa(norm, normUnit);
    const calculation = calculateSingleProduct({
      areaHa,
      rateKgPerHa,
      bagWeightKg: normalizeNumber(bagWeight),
      pricePerBag: normalizeNumber(price)
    });
    return {
      rateKgPerHa,
      requiredKg: calculation.requiredKg,
      quantity: calculation.bagsRounded,
      weight: calculation.totalWeightKg,
      total: calculation.totalPrice
    };
  }, [areaHa, bagWeight, norm, normUnit, price]);

  const canSubmit = activeValidation.valid && (mode === "scheme" ? schemeTotals.bags > 0 : singleCalculation.quantity > 0);

  function calculate() {
    setStatus(activeValidation.valid ? "Расчёт обновлён" : "Проверьте поля расчёта");
  }

  function addCurrentToCart() {
    if (!canSubmit) {
      setStatus("Проверьте поля расчёта");
      return;
    }

    if (mode === "scheme") {
      scheme.forEach((item) => {
        for (let index = 0; index < item.quantity; index += 1) addItem(item.product);
      });
      setStatus("Схема добавлена в корзину");
      return;
    }

    for (let index = 0; index < singleCalculation.quantity; index += 1) addItem(selectedProduct);
    setStatus("Товар добавлен в корзину");
  }

  function saveCalculation() {
    if (!canSubmit) {
      setStatus("Проверьте поля расчёта");
      return;
    }

    const payload =
      mode === "scheme"
        ? {
            mode,
            savedAt: new Date().toISOString(),
            areaMode,
            area,
            areaHa,
            culture,
            variant,
            scheme: scheme.map((item) => ({
              slug: item.slug,
              rateKgPerHa: item.rateKgPerHa,
              requiredKg: item.requiredKg,
              quantity: item.quantity,
              totalWeightKg: item.weight,
              totalPrice: item.total
            })),
            totals: schemeTotals
          }
        : {
            mode,
            savedAt: new Date().toISOString(),
            areaMode,
            area,
            areaHa,
            culture,
            productSlug,
            norm,
            normUnit,
            bagWeight,
            price,
            result: singleCalculation
          };

    window.localStorage.setItem(savedCalculationKey, JSON.stringify(payload));
    setStatus("Расчёт сохранён");
  }

  return (
    <div className="relative overflow-hidden">
      <Image
        src="/assets/decor/calculator-floating-potato-leaves.png"
        alt=""
        width={280}
        height={360}
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-28 z-0 hidden h-auto w-44 select-none opacity-70 lg:block xl:-left-28 xl:w-56"
      />
      <div className="pointer-events-none absolute -left-20 top-32 hidden h-48 w-48 rounded-full bg-[#d8edc7]/35 blur-3xl lg:block" />
      <div className="pointer-events-none absolute right-0 top-10 hidden h-56 w-56 rounded-full bg-[#fff1be]/55 blur-3xl lg:block" />

      <div className="relative z-10 mb-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
        <div className="relative">
          <Image
            src="/assets/decor/calculator-leaf-sharp.png"
            alt=""
            width={78}
            height={78}
            aria-hidden="true"
            className="pointer-events-none absolute right-10 top-2 hidden h-auto w-10 rotate-12 select-none opacity-70 lg:block"
          />
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#66705d]">
            <Link href="/" className="hover:text-[#063b23]">Главная</Link>
            <span>›</span>
            <span className="text-[#102116]">Калькулятор питания картофеля</span>
          </div>
          <h1 className="max-w-4xl text-[36px] font-black leading-[0.98] tracking-[-0.06em] text-[#071a10] sm:text-[54px]">
            Рассчитайте питание картофеля и получите оптимальный результат
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-[#4d5a4e] sm:text-lg">
            Укажите параметры участка — мы подберём схему питания и рассчитаем количество удобрений.
          </p>
        </div>
        <HeroVisual variant={variant} items={items} />
      </div>

      <div className="relative z-10 grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(560px,1.05fr)] xl:items-start">
        <div>
          <CalculatorForm
            mode={mode}
            setMode={setMode}
            areaMode={areaMode}
            setAreaMode={setAreaMode}
            area={area}
            setArea={setArea}
            culture={culture}
            setCulture={setCulture}
            variant={variant}
            setVariant={setVariant}
            productSlug={productSlug}
            setProductSlug={setProductSlug}
            products={items}
            normMode={normMode}
            setNormMode={setNormMode}
            norm={norm}
            setNorm={setNorm}
            normUnit={normUnit}
            setNormUnit={setNormUnit}
            bagWeight={bagWeight}
            setBagWeight={setBagWeight}
            price={price}
            setPrice={setPrice}
            product={selectedProduct}
            errors={activeValidation.errors}
            onCalculate={calculate}
          />

          <HowItWorks />
        </div>

        <div className="grid gap-5">
          {mode === "scheme" ? (
            <>
              <SchemeResultCard
                scheme={scheme}
                totals={schemeTotals}
                status={status}
                onAdd={addCurrentToCart}
                onSave={saveCalculation}
                variant={variant}
                canSubmit={canSubmit}
              />
              <VariantPicker variant={variant} setVariant={setVariant} items={items} />
            </>
          ) : (
            <SingleResultCard
              product={selectedProduct}
              result={singleCalculation}
              status={status}
              onAdd={addCurrentToCart}
              onSave={saveCalculation}
              canSubmit={canSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function HeroVisual({ variant, items }: { variant: SchemeVariant; items: Product[] }) {
  return (
    <div className="relative hidden min-h-[190px] lg:block" aria-hidden="true">
      <div className="pointer-events-none absolute inset-x-4 bottom-5 h-20 rounded-full bg-[#d9c59c]/25 blur-2xl" />
      <Image
        src="/assets/decor/calculator-potato-pile.png"
        alt=""
        width={240}
        height={190}
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 bottom-0 z-0 h-auto w-48 select-none opacity-70"
      />
      <Image
        src="/assets/decor/calculator-leaf-sharp.png"
        alt=""
        width={80}
        height={80}
        aria-hidden="true"
        className="pointer-events-none absolute right-56 top-1 z-0 h-auto w-12 -rotate-12 select-none opacity-75"
      />
      <div className="absolute bottom-4 left-12 z-10 flex items-end gap-1">
        {variantMeta[variant].items.slice(0, 3).map((item, index) => {
          const product = items.find((productItem) => productItem.slug === item.slug);
          if (!product) return null;
          return (
            <Image
              key={item.slug}
              src={productImage(item.slug)}
              alt=""
              width={120}
              height={150}
              aria-hidden="true"
              className={`pointer-events-none h-auto object-contain drop-shadow-xl ${index === 1 ? "relative z-10 w-28" : "w-20 opacity-95"} ${index > 0 ? "-ml-5" : ""}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function CalculatorForm({
  mode,
  setMode,
  areaMode,
  setAreaMode,
  area,
  setArea,
  culture,
  setCulture,
  variant,
  setVariant,
  productSlug,
  setProductSlug,
  products,
  normMode,
  setNormMode,
  norm,
  setNorm,
  normUnit,
  setNormUnit,
  bagWeight,
  setBagWeight,
  price,
  setPrice,
  product,
  errors,
  onCalculate
}: {
  mode: CalculatorMode;
  setMode: (mode: CalculatorMode) => void;
  areaMode: AreaMode;
  setAreaMode: (mode: AreaMode) => void;
  area: string;
  setArea: (area: string) => void;
  culture: string;
  setCulture: (culture: string) => void;
  variant: SchemeVariant;
  setVariant: (variant: SchemeVariant) => void;
  productSlug: string;
  setProductSlug: (slug: string) => void;
  products: Product[];
  normMode: NormMode;
  setNormMode: (mode: NormMode) => void;
  norm: string;
  setNorm: (norm: string) => void;
  normUnit: NormUnit;
  setNormUnit: (unit: NormUnit) => void;
  bagWeight: string;
  setBagWeight: (weight: string) => void;
  price: string;
  setPrice: (price: string) => void;
  product: Product;
  errors: Partial<Record<"area" | "norm" | "bagWeight" | "price", string>>;
  onCalculate: () => void;
}) {
  return (
    <form className="rounded-[24px] border border-[#173c25]/10 bg-white p-4 shadow-[0_18px_48px_rgba(45,35,17,.07)] md:p-5">
      <div className="grid overflow-hidden rounded-[14px] border border-[#173c25]/10 bg-[#fbf8ef] p-1 sm:grid-cols-2">
        <button type="button" onClick={() => setMode("scheme")} className={`h-12 rounded-[10px] text-sm font-black transition ${mode === "scheme" ? "bg-[#063b23] text-white shadow-sm" : "text-[#38473b] hover:bg-white"}`}>
          Подобрать схему
        </button>
        <button type="button" onClick={() => setMode("single")} className={`h-12 rounded-[10px] text-sm font-black transition ${mode === "single" ? "bg-[#063b23] text-white shadow-sm" : "text-[#38473b] hover:bg-white"}`}>
          Одно удобрение
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_0.9fr]">
        <Field label="Площадь участка" help={areaMode === "sotka" ? "1 сотка = 100 м²" : "1 га = 10 000 м²"}>
          <input type="number" min="0" step="0.1" value={area} onChange={(event) => setArea(event.target.value)} className="h-12 rounded-[11px] border border-[#173c25]/10 bg-white px-3 text-xl font-black tracking-[-0.04em] text-[#102116] outline-none focus:border-[#f5b400] focus:ring-4 focus:ring-[#f5b400]/20" />
          {errors.area ? <span className="text-xs font-bold text-[#b42318]">{errors.area}</span> : null}
        </Field>
        <Field label="Единица площади">
          <div className="grid h-12 grid-cols-2 overflow-hidden rounded-[11px] border border-[#173c25]/10 bg-white p-1">
            <button type="button" onClick={() => setAreaMode("sotka")} className={`rounded-[9px] text-sm font-black ${areaMode === "sotka" ? "bg-[#f5b400] text-[#1b1500]" : "text-[#4d5a4e]"}`}>
              Сотки
            </button>
            <button type="button" onClick={() => setAreaMode("hectare")} className={`rounded-[9px] text-sm font-black ${areaMode === "hectare" ? "bg-[#f5b400] text-[#1b1500]" : "text-[#4d5a4e]"}`}>
              Гектары
            </button>
          </div>
        </Field>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="Культура">
          <select value={culture} onChange={(event) => setCulture(event.target.value)} className="h-12 rounded-[11px] border border-[#173c25]/10 bg-white px-3 text-sm font-black text-[#102116] outline-none focus:border-[#f5b400]">
            <option>Картофель</option>
          </select>
        </Field>
        {mode === "scheme" ? (
          <Field label="Вариант схемы">
            <div className="grid h-12 grid-cols-3 overflow-hidden rounded-[11px] border border-[#173c25]/10 bg-white p-1">
              {(Object.keys(variantMeta) as SchemeVariant[]).map((key) => (
                <button key={key} type="button" onClick={() => setVariant(key)} className={`rounded-[9px] text-xs font-black transition ${variant === key ? "bg-[#f5b400] text-[#1b1500]" : "text-[#4d5a4e] hover:bg-[#f7f1e5]"}`}>
                  {variantMeta[key].title}
                </button>
              ))}
            </div>
          </Field>
        ) : (
          <Field label="Выбранное удобрение">
            <select value={productSlug} onChange={(event) => setProductSlug(event.target.value)} className="h-12 min-w-0 rounded-[11px] border border-[#173c25]/10 bg-white px-3 text-sm font-black text-[#102116] outline-none focus:border-[#f5b400]">
              {products.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </Field>
        )}
      </div>

      {mode === "single" ? (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Норма внесения" help={`Рекомендуемая норма: ${product.recommendedRange}`}>
              <input type="number" min="0" step="0.1" value={norm} onChange={(event) => { setNorm(event.target.value); setNormMode("manual"); }} className="h-12 rounded-[11px] border border-[#173c25]/10 bg-white px-3 text-xl font-black tracking-[-0.04em] text-[#102116] outline-none focus:border-[#f5b400]" />
              {errors.norm ? <span className="text-xs font-bold text-[#b42318]">{errors.norm}</span> : null}
            </Field>
            <Field label="Единица нормы">
              <select value={normUnit} onChange={(event) => setNormUnit(event.target.value as NormUnit)} className="h-12 rounded-[11px] border border-[#173c25]/10 bg-white px-3 text-sm font-black text-[#102116] outline-none focus:border-[#f5b400]">
                <option value="г/м²">г/м²</option>
                <option value="кг/га">кг/га</option>
                <option value="кг/сотка">кг/сотка</option>
              </select>
            </Field>
            <Field label="Вес мешка">
              <input value={bagWeight} onChange={(event) => setBagWeight(event.target.value)} min="0" step="0.1" type="number" className="h-12 rounded-[11px] border border-[#173c25]/10 bg-white px-3 text-xl font-black tracking-[-0.04em] text-[#102116] outline-none focus:border-[#f5b400]" />
              {errors.bagWeight ? <span className="text-xs font-bold text-[#b42318]">{errors.bagWeight}</span> : null}
            </Field>
            <Field label="Цена за мешок">
              <input value={price} onChange={(event) => setPrice(event.target.value)} min="0" step="1" type="number" className="h-12 rounded-[11px] border border-[#173c25]/10 bg-white px-3 text-xl font-black tracking-[-0.04em] text-[#102116] outline-none focus:border-[#f5b400]" />
              {errors.price ? <span className="text-xs font-bold text-[#b42318]">{errors.price}</span> : null}
            </Field>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-black text-[#102116]">Состав удобрения</p>
            <div className="flex flex-wrap gap-1.5">
              {product.elements.slice(0, 3).map((element) => (
                <span key={element.symbol} className="rounded-[10px] border border-[#173c25]/10 bg-[#f7f1e5] px-3 py-1.5 text-sm font-black text-[#102116]">
                  {element.symbol} <span className="font-semibold text-[#5b6659]">{element.value ?? element.label}</span>
                </span>
              ))}
              {product.elements.length > 3 ? <span className="rounded-[10px] border border-[#173c25]/10 bg-[#f7f1e5] px-3 py-1.5 text-sm font-black text-[#5b6659]">+{product.elements.length - 3} элемента</span> : null}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-[16px] border border-[#173c25]/10 bg-[#fbf8ef] p-4">
          <p className="text-sm font-black text-[#102116]">Вы получите готовый набор удобрений</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#596553]">В этом режиме не нужно выбирать отдельный товар, вес мешка или цену. Схема рассчитывается по товарам каталога и активному варианту.</p>
        </div>
      )}

      <div className="mt-5 flex gap-3 rounded-[15px] border border-[#f5b400]/30 bg-[#fff8e8] p-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1f7a45]" />
        <p className="text-sm font-semibold leading-6 text-[#596553]">Расчёт носит ориентировочный характер. Фактическая потребность может отличаться в зависимости от типа почвы, сорта, погодных условий и технологии выращивания.</p>
      </div>

      <Button type="button" onClick={onCalculate} className="mt-5 h-12 w-full rounded-[12px] bg-[#063b23] px-7 text-base font-black text-white shadow-[0_18px_40px_rgba(6,59,35,.18)] hover:bg-[#0d5a36] sm:w-auto">
        <CalculatorIcon className="h-5 w-5" />
        Рассчитать
      </Button>
    </form>
  );
}

function HowItWorks() {
  return (
    <section className="mt-4 rounded-[22px] border border-[#173c25]/10 bg-white/70 p-4 shadow-[0_12px_32px_rgba(45,35,17,.04)]">
      <h2 className="text-base font-black tracking-[-0.02em] text-[#102116]">Как это работает</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Укажите площадь",
          "Выберите режим",
          "Получите расчёт",
          "Свяжитесь с нами"
        ].map((item, index) => (
          <div key={item} className="flex items-center gap-2 text-sm font-black text-[#384334]">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#fff8df] text-xs text-[#8c5b00]">
              {index + 1}
            </span>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function SchemeResultCard({
  scheme,
  totals,
  status,
  onAdd,
  onSave,
  variant,
  canSubmit
}: {
  scheme: CalculatedSchemeItem[];
  totals: { bags: number; weight: number; cost: number; requiredKg: number };
  status: string;
  onAdd: () => void;
  onSave: () => void;
  variant: SchemeVariant;
  canSubmit: boolean;
}) {
  return (
    <motion.aside layout className="relative overflow-hidden rounded-[28px] border border-[#173c25]/10 bg-[#f4faee] p-4 shadow-[0_22px_70px_rgba(45,35,17,.09)] md:p-5">
      <ResultDecor />
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.045em] text-[#102116] md:text-[28px]">Рекомендованная схема питания</h2>
          <p className="mt-1 text-sm font-semibold text-[#596553]">Оптимальный состав удобрений для вашего участка</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#063b23] shadow-sm">{variantMeta[variant].title}</span>
      </div>

      <motion.div layout className="relative z-10 mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {scheme.map((item, index) => (
          <motion.div
            key={`${variant}-${item.slug}`}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="group relative"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#063b23] text-[11px] font-black text-[#f5b400]">{index + 1}</span>
              {index < scheme.length - 1 ? <span className="hidden h-px flex-1 bg-[#bfd4ba] lg:block" /> : null}
            </div>
            <Link href={`/products/${item.slug}`} className="block rounded-[16px] bg-white/80 p-2.5 transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(45,35,17,.08)]">
              <div className="relative mx-auto h-28">
                <Image src={productImage(item.slug)} alt={item.product.name} fill sizes="180px" className="object-contain transition duration-300 group-hover:-translate-y-1" />
              </div>
              <h3 className="mt-2 line-clamp-2 min-h-[36px] text-[13px] font-black leading-tight text-[#102116]">{item.product.name}</h3>
              <p className="mt-1.5 text-xs font-bold text-[#65705e]">{item.product.elements.map((element) => element.symbol).slice(0, 3).join(", ")}</p>
              <p className="mt-1 text-xs font-semibold text-[#4f6b51]">{item.role}</p>
              <p className="mt-1 text-[11px] font-semibold text-[#7a8373]">Нужно {formatKg(item.requiredKg)} кг</p>
              <p className="mt-1.5 text-base font-black text-[#063b23]">{item.quantity} {declineBag(item.quantity)}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <TotalsBlock totals={totals} status={status} />
      <div className="relative z-10 mt-3 grid gap-3 sm:grid-cols-2">
        <Button asChild disabled={!canSubmit} className="h-12 rounded-[13px] bg-[#f5b400] text-base font-black text-[#1b1500] shadow-none hover:bg-[#e8a900] disabled:opacity-60">
          <Link href="/contacts">
            <MessageCircle className="h-5 w-5" />
            Уточнить условия
          </Link>
        </Button>
        <Button onClick={onSave} disabled={!canSubmit} variant="outline" className="h-12 rounded-[13px] border-[#063b23]/25 bg-white text-base font-black text-[#063b23] shadow-none hover:bg-[#f7f1e5] disabled:opacity-60">
          <Save className="h-5 w-5" />
          Сохранить расчёт
        </Button>
      </div>
    </motion.aside>
  );
}

function SingleResultCard({
  product,
  result,
  status,
  onAdd,
  onSave,
  canSubmit
}: {
  product: Product;
  result: { rateKgPerHa: number; requiredKg: number; quantity: number; weight: number; total: number };
  status: string;
  onAdd: () => void;
  onSave: () => void;
  canSubmit: boolean;
}) {
  const totals = { bags: result.quantity, weight: result.weight, cost: result.total, requiredKg: result.requiredKg };
  return (
    <motion.aside layout className="relative overflow-hidden rounded-[28px] border border-[#173c25]/10 bg-[#f4faee] p-4 shadow-[0_22px_70px_rgba(45,35,17,.09)] md:p-5">
      <ResultDecor />
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.045em] text-[#102116] md:text-[28px]">Результат расчёта</h2>
          <p className="mt-1 text-sm font-semibold text-[#596553]">Расчёт по одному выбранному удобрению</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#063b23] shadow-sm">{product.category}</span>
      </div>

      <Link href={`/products/${product.slug}`} className="relative z-10 mt-4 grid gap-4 rounded-[20px] bg-white/85 p-4 transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(45,35,17,.08)] sm:grid-cols-[150px_1fr]">
        <div className="relative h-40">
          <Image src={productImage(product.slug)} alt={product.name} fill sizes="180px" className="object-contain" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.08em] text-[#8c5b00]">{product.category}</p>
          <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.035em] text-[#102116]">{product.name}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#596553]">{product.shortDescription}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.elements.slice(0, 4).map((element) => (
              <span key={element.symbol} className="rounded-full bg-[#eef6e9] px-3 py-1 text-xs font-black text-[#063b23]">{element.symbol}</span>
            ))}
          </div>
        </div>
      </Link>

      <TotalsBlock totals={totals} status={status} />
      <div className="relative z-10 mt-3 grid gap-3 sm:grid-cols-2">
        <Button asChild disabled={!canSubmit} className="h-12 rounded-[13px] bg-[#f5b400] text-base font-black text-[#1b1500] shadow-none hover:bg-[#e8a900] disabled:opacity-60">
          <Link href="/contacts">
            <MessageCircle className="h-5 w-5" />
            Уточнить условия
          </Link>
        </Button>
        <Button onClick={onSave} disabled={!canSubmit} variant="outline" className="h-12 rounded-[13px] border-[#063b23]/25 bg-white text-base font-black text-[#063b23] shadow-none hover:bg-[#f7f1e5] disabled:opacity-60">
          <Save className="h-5 w-5" />
          Сохранить расчёт
        </Button>
      </div>
    </motion.aside>
  );
}

function ResultDecor() {
  return (
    <>
      <div className="pointer-events-none absolute -right-14 -top-10 h-32 w-32 rounded-full bg-[#fff1be]/70 blur-2xl" />
      <Image src="/assets/decor/calculator-potato-pile.png" alt="" width={260} height={220} aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-24 z-0 hidden h-auto w-44 select-none opacity-35 lg:block xl:w-56" />
      <Image src="/assets/decor/calculator-leaf-blur.png" alt="" width={160} height={160} aria-hidden="true" className="pointer-events-none absolute -right-10 top-24 z-0 hidden h-auto w-24 select-none opacity-35 lg:block" />
      <Image src="/assets/decor/calculator-leaf-sharp.png" alt="" width={76} height={76} aria-hidden="true" className="pointer-events-none absolute right-20 top-4 z-0 hidden h-auto w-10 rotate-12 select-none opacity-50 lg:block" />
    </>
  );
}

function TotalsBlock({ totals, status }: { totals: { bags: number; weight: number; cost: number; requiredKg: number }; status: string }) {
  return (
    <motion.div layout className="relative z-10 mt-4 rounded-[18px] bg-white p-3.5 shadow-[0_14px_30px_rgba(45,35,17,.05)]">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Количество мешков" value={totals.bags.toString()} suffix={declineBag(totals.bags)} />
        <Metric label="Общий вес" value={formatKg(totals.weight)} suffix="кг" />
        <Metric label="Стоимость" value={totals.cost > 0 ? formatPrice(totals.cost) : "уточняется"} suffix={totals.cost > 0 ? "BYN" : ""} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-[#eef6e9] px-3 py-1.5 text-xs font-black text-[#063b23]">Расчёт выполнен по выбранным параметрам</span>
        {status ? <span className="text-sm font-black text-[#1f7a45]">{status}</span> : null}
      </div>
    </motion.div>
  );
}

function VariantPicker({ variant, setVariant, items }: { variant: SchemeVariant; setVariant: (variant: SchemeVariant) => void; items: Product[] }) {
  return (
    <section className="rounded-[24px] border border-[#173c25]/10 bg-white p-4 shadow-[0_18px_48px_rgba(45,35,17,.07)]">
      <h2 className="text-xl font-black tracking-[-0.04em] text-[#102116]">Похожие варианты</h2>
      <p className="mt-1 text-sm font-semibold text-[#65705e]">Это варианты схемы расчёта, а не отдельные товары.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {(Object.keys(variantMeta) as SchemeVariant[]).map((key) => {
          const meta = variantMeta[key];
          const preview = meta.items.slice(0, 3).map((item) => items.find((product) => product.slug === item.slug)).filter(Boolean) as Product[];
          const active = variant === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setVariant(key)}
              className={`rounded-[16px] border p-2.5 text-left transition hover:-translate-y-0.5 ${active ? "border-[#063b23] bg-[#f7fbf2] shadow-[0_14px_30px_rgba(45,35,17,.07)]" : "border-[#173c25]/10 bg-white hover:border-[#f5b400]"}`}
            >
              <div className="flex h-12 items-end gap-1">
                {preview.map((product, index) => (
                  <Image key={product.slug} src={productImage(product.slug)} alt={product.name} width={46} height={58} className={`h-auto object-contain ${index > 0 ? "-ml-3" : ""}`} />
                ))}
              </div>
              <div className="mt-2 flex items-end justify-between gap-2">
                <div>
                  <p className="text-sm font-black text-[#102116]">{meta.title}</p>
                  <p className="text-xs font-semibold text-[#65705e]">{meta.subtitle}</p>
                </div>
                <p className="whitespace-nowrap text-sm font-black text-[#063b23]">{meta.priceLabel}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-black text-[#243427]">
      {label}
      {children}
      {help ? <span className="text-xs font-semibold text-[#7a8373]">{help}</span> : null}
    </label>
  );
}

function Metric({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="border-b border-[#173c25]/10 pb-2.5 last:border-b-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3 sm:last:border-r-0">
      <p className="text-xs font-semibold text-[#65705e] sm:text-sm">{label}</p>
      <p className="mt-1.5 text-2xl font-black tracking-[-0.05em] text-[#063b23] sm:text-[28px]">
        {value} <span className="text-base tracking-normal">{suffix}</span>
      </p>
    </div>
  );
}

function declineBag(count: number) {
  const last = count % 10;
  const lastTwo = count % 100;
  if (last === 1 && lastTwo !== 11) return "мешок";
  if ([2, 3, 4].includes(last) && ![12, 13, 14].includes(lastTwo)) return "мешка";
  return "мешков";
}
