import { products } from "@/data/products";
import { siteConfig } from "@/config/site";

export type AreaMode = "sotka" | "hectare";
export type NormUnit = "кг/га" | "г/м²" | "кг/сотка";
export type NormMode = "culture" | "manual";

export type CalculatorValidation = {
  valid: boolean;
  errors: Partial<Record<"area" | "norm" | "bagWeight" | "price", string>>;
};

export type SingleProductCalculation = {
  valid: boolean;
  requiredKg: number;
  bagsExact: number;
  bagsRounded: number;
  totalWeightKg: number;
  totalPrice: number;
};

export const calculatorWarning = siteConfig.disclaimerText;

export const calculatorRules = products.map((product) => ({
  productSlug: product.slug,
  productName: product.name,
  defaultNorm: product.defaultNorm,
  normUnit: product.normUnit,
  recommendedRange: product.recommendedRange,
  bagWeight: product.bagWeight,
  price: product.price,
  elements: product.elements
}));

export function calculateFertilizer({
  area,
  areaMode,
  norm,
  normUnit,
  bagWeight,
  price
}: {
  area: number;
  areaMode: AreaMode;
  norm: number;
  normUnit: NormUnit;
  bagWeight: number;
  price?: number;
}) {
  const areaHa = convertAreaToHa(area, areaMode);
  const applicationRateKgPerHa = convertRateToKgPerHa(norm, normUnit);
  const calculation = calculateSingleProduct({
    areaHa,
    rateKgPerHa: applicationRateKgPerHa,
    bagWeightKg: bagWeight,
    pricePerBag: price ?? 0
  });

  return {
    areaM2: areaHa * 10000,
    areaHa,
    areaSotka: areaHa * 100,
    needKg: calculation.requiredKg,
    bags: calculation.bagsRounded,
    cost: calculation.totalPrice
  };
}

export function normalizeNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return 0;
  const number = Number.parseFloat(normalized);
  return Number.isFinite(number) ? number : 0;
}

export function roundNumber(value: number, digits = 1) {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function convertAreaToHa(areaValue: number | string, areaUnit: AreaMode) {
  const area = Math.max(0, normalizeNumber(areaValue));
  return areaUnit === "sotka" ? area / 100 : area;
}

export function convertRateToKgPerHa(rateValue: number | string, rateUnit: NormUnit) {
  const rate = Math.max(0, normalizeNumber(rateValue));
  if (rateUnit === "г/м²") return rate * 10;
  if (rateUnit === "кг/сотка") return rate * 100;
  return rate;
}

export function validateCalculatorInput({
  area,
  norm,
  bagWeight,
  price
}: {
  area: number | string;
  norm: number | string;
  bagWeight: number | string;
  price: number | string;
}): CalculatorValidation {
  const errors: CalculatorValidation["errors"] = {};
  if (normalizeNumber(area) <= 0) errors.area = "Укажите площадь больше 0";
  if (normalizeNumber(norm) <= 0) errors.norm = "Укажите норму больше 0";
  if (normalizeNumber(bagWeight) <= 0) errors.bagWeight = "Вес мешка должен быть больше 0";
  if (normalizeNumber(price) < 0) errors.price = "Цена не может быть отрицательной";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function calculateSingleProduct({
  areaHa,
  rateKgPerHa,
  bagWeightKg,
  pricePerBag
}: {
  areaHa: number;
  rateKgPerHa: number;
  bagWeightKg: number;
  pricePerBag: number;
}): SingleProductCalculation {
  const safeAreaHa = Math.max(0, normalizeNumber(areaHa));
  const safeRate = Math.max(0, normalizeNumber(rateKgPerHa));
  const safeBagWeight = normalizeNumber(bagWeightKg);
  const safePrice = Math.max(0, normalizeNumber(pricePerBag));

  if (safeAreaHa <= 0 || safeRate <= 0 || safeBagWeight <= 0) {
    return {
      valid: false,
      requiredKg: 0,
      bagsExact: 0,
      bagsRounded: 0,
      totalWeightKg: 0,
      totalPrice: 0
    };
  }

  const requiredKg = safeAreaHa * safeRate;
  const bagsExact = requiredKg / safeBagWeight;
  const bagsRounded = Math.max(1, Math.ceil(bagsExact));
  return {
    valid: true,
    requiredKg,
    bagsExact,
    bagsRounded,
    totalWeightKg: bagsRounded * safeBagWeight,
    totalPrice: bagsRounded * safePrice
  };
}

export function calculateScheme<T extends { rateKgPerHa: number; bagWeightKg: number; pricePerBag: number }>({
  areaHa,
  items
}: {
  areaHa: number;
  items: T[];
}) {
  const calculatedItems = items.map((item) => ({
    ...item,
    calculation: calculateSingleProduct({
      areaHa,
      rateKgPerHa: item.rateKgPerHa,
      bagWeightKg: item.bagWeightKg,
      pricePerBag: item.pricePerBag
    })
  }));

  return {
    items: calculatedItems,
    totals: {
      bags: calculatedItems.reduce((sum, item) => sum + item.calculation.bagsRounded, 0),
      weight: calculatedItems.reduce((sum, item) => sum + item.calculation.totalWeightKg, 0),
      cost: calculatedItems.reduce((sum, item) => sum + item.calculation.totalPrice, 0),
      requiredKg: calculatedItems.reduce((sum, item) => sum + item.calculation.requiredKg, 0)
    }
  };
}

export function formatKg(value: number) {
  return roundNumber(value, value >= 100 ? 0 : 1).toLocaleString("ru-RU");
}

export function formatPrice(value: number) {
  return roundNumber(value, 0).toLocaleString("ru-RU");
}
