import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value?: number) {
  if (typeof value !== "number") return "Цена по запросу";
  return `${value.toLocaleString("ru-RU")} BYN`;
}
