import { Atom, CircleDot, FlaskConical, Gauge, Gem, Leaf, Package, Sprout } from "lucide-react";
import { siteConfig } from "@/config/site";

export const brand = {
  name: siteConfig.brandName,
  descriptor: "удобрения для картофеля",
  phone: siteConfig.phone,
  email: siteConfig.email
};

export const navItems = [
  { href: "/products", label: "Каталог" },
  { href: "/potato", label: "Удобрения" },
  { href: "/delivery", label: "Доставка и оплата" },
  { href: "/knowledge", label: "База знаний" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" }
];

export const productCategories = [
  {
    title: "Комплексные NPK",
    href: "/products?type=Комплексные NPK",
    text: "Сбалансированное питание для высокого урожая",
    icon: Sprout
  },
  {
    title: "Азотные удобрения",
    href: "/products?type=Азотные",
    text: "Рост ботвы и формирование растений",
    icon: Atom
  },
  {
    title: "Фосфорные удобрения",
    href: "/products?type=Фосфорные",
    text: "Корневая система и развитие клубней",
    icon: CircleDot
  },
  {
    title: "Калийные удобрения",
    href: "/products?type=Калийные",
    text: "Устойчивость, качество и лёжкость",
    icon: Gauge
  },
  {
    title: "Микроудобрения",
    href: "/products?type=Микроудобрения",
    text: "Бор, магний и другие элементы",
    icon: FlaskConical
  },
  {
    title: "Органо-минеральные",
    href: "/products?type=Натуральные",
    text: "Плодородие и структура почвы",
    icon: Leaf
  }
];

export const shopStats = [
  { icon: Package, label: "15 типов удобрений" },
  { icon: Gem, label: "Сотки и гектары" },
  { icon: Gauge, label: "Цены и расчёт" },
  { icon: Sprout, label: "Заявка за 1 минуту" }
];

export const cropFilters = ["Картофель"];
export const categoryTiles = productCategories;
export const shopBenefits = shopStats.map((item) => ({ icon: item.icon, title: item.label, text: "" }));
