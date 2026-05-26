import { articles } from "@/data/articles";
import { findProduct, products, Product } from "@/data/products";

export type ProductPageImage = {
  id: string;
  label: string;
  src: string;
};

export type ProductPageNutrient = {
  symbol: string;
  label: string;
  description: string;
  value?: string;
};

export type ProductPageData = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  quickSummary: string;
  type: string;
  form: string;
  nutrients: ProductPageNutrient[];
  packageWeight: number;
  price: number;
  availability: string;
  usageStages: string[];
  tasks: string[];
  benefits: { title: string; text: string }[];
  cautions: string[];
  characteristics: { label: string; value: string }[];
  calculatorDefaults: {
    norm: number;
    normUnit: "кг/га" | "г/м²" | "кг/сотка";
    bagWeight: number;
    areaSotka: number;
    price: number;
  };
  images: ProductPageImage[];
  passport?: {
    available: boolean;
    url?: string;
    label?: string;
  };
  instruction: {
    title: string;
    paragraphs: string[];
    steps: string[];
    important: string;
  };
  infoCards: { title: string; text: string; items?: string[] }[];
  orderSteps: string[];
  relatedProducts: string[];
  relatedArticles: string[];
};

const relatedMap: Record<string, string[]> = {
  "npk-potato": ["nitroammofoska-azofoska", "diammofoska", "ammofos", "superfosfat"],
  "nitroammofoska-azofoska": ["npk-potato", "diammofoska", "ammofos", "sulfate-potassium"],
  diammofoska: ["npk-potato", "nitroammofoska-azofoska", "ammofos", "superfosfat"],
  ammofos: ["superfosfat", "diammofoska", "monopotassium-phosphate", "npk-potato"],
  superfosfat: ["ammofos", "diammofoska", "borofoska", "dolomite-flour"],
  "sulfate-potassium": ["kalimagnesia", "monopotassium-phosphate", "potassium-nitrate", "npk-potato"],
  kalimagnesia: ["sulfate-potassium", "monopotassium-phosphate", "potassium-nitrate", "npk-potato"],
  "monopotassium-phosphate": ["sulfate-potassium", "kalimagnesia", "potassium-nitrate", "ammofos"],
  "potassium-nitrate": ["sulfate-potassium", "kalimagnesia", "monopotassium-phosphate", "ammonium-nitrate"],
  "ammonium-sulfate": ["ammonium-nitrate", "urea", "npk-potato", "dolomite-flour"],
  "ammonium-nitrate": ["urea", "ammonium-sulfate", "potassium-nitrate", "npk-potato"],
  urea: ["ammonium-nitrate", "ammonium-sulfate", "npk-potato", "kalimagnesia"],
  borofoska: ["npk-potato", "superfosfat", "dolomite-flour", "wood-ash"],
  "dolomite-flour": ["wood-ash", "borofoska", "superfosfat", "npk-potato"],
  "wood-ash": ["dolomite-flour", "borofoska", "superfosfat", "npk-potato"]
};

const nutrientDescriptions: Record<string, string> = {
  N: "поддерживает рост ботвы и развитие растения",
  "P₂O₅": "важен для корневой системы и старта",
  P: "участвует в развитии корневой системы и стартовом питании",
  "K₂O": "влияет на качество клубней, устойчивость и лёжкость",
  K: "поддерживает качество клубней и водный баланс",
  S: "участвует в обмене веществ и серном питании",
  Mg: "входит в систему питания и поддерживает фотосинтез",
  MgO: "поддерживает магниевое питание и работу листового аппарата",
  Ca: "поддерживает кальциевое питание и структуру почвы",
  B: "важен как микроэлемент в сбалансированной схеме питания",
  Zn: "используется для коррекции микроэлементного питания"
};

const stageText = (product: Product) => product.stage.join(" / ");
const elementLine = (product: Product) => product.elements.map((element) => element.symbol).join(", ");
const imagePath = (slug: string, view: "front" | "side" | "back") => `/assets/products/${slug}/${view}.png`;

function cleanText(text: string) {
  return text
    .replaceAll("по инструкции производителя", "по регламенту KartoFert")
    .replaceAll("инструкции производителя", "регламенту KartoFert")
    .replaceAll("инструкцию производителя", "регламент KartoFert")
    .replaceAll("инструкции поставщика", "регламенту KartoFert")
    .replaceAll("инструкцией", "регламентом KartoFert")
    .replaceAll("инструкцию", "регламент KartoFert");
}

function buildImages(product: Product): ProductPageImage[] {
  return [
    { id: "front", label: "Передняя сторона", src: imagePath(product.slug, "front") },
    { id: "side", label: "Боковой ракурс", src: imagePath(product.slug, "side") },
    { id: "back", label: "Задняя сторона", src: imagePath(product.slug, "back") }
  ];
}

function buildNutrients(product: Product): ProductPageNutrient[] {
  return product.elements.map((element) => ({
    symbol: element.symbol,
    label: element.label,
    value: element.value,
    description: nutrientDescriptions[element.symbol] ?? `используется как элемент питания: ${element.label.toLowerCase()}`
  }));
}

function buildCharacteristics(product: Product) {
  return [
    { label: "Тип товара", value: product.fertilizerType },
    { label: "Категория", value: product.category },
    { label: "Форма", value: "Гранулы" },
    { label: "Назначение", value: product.shortDescription },
    { label: "Этап применения", value: stageText(product) },
    { label: "Фасовка", value: product.packageSize },
    { label: "Цена", value: `${product.price ?? 10} ₽ / мешок` },
    { label: "Наличие", value: product.inStock ? "Уточняется" : "Под заказ" },
    { label: "Единица расчёта", value: "г/м², кг/га, кг/сотка" },
    { label: "Примечание", value: "Норма подбирается по площади, анализу почвы и технологии выращивания." }
  ];
}

function buildInfoCards(product: Product): ProductPageData["infoCards"] {
  return [
    {
      title: "Что это",
      text: `${product.name} — ${cleanText(product.description)}`
    },
    {
      title: "Когда применять",
      text: `Продукт применяют в составе схемы питания картофеля на этапах: ${stageText(product).toLowerCase()}.`,
      items: product.stage
    },
    {
      title: "Как применять",
      text: cleanText(product.application),
      items: ["равномерное внесение по площади", "заделка в почву", "учёт влажности", "расчёт нормы по площади"]
    },
    {
      title: "Что важно учесть",
      text: "Финальную норму подбирают по анализу почвы, площади, сорту картофеля и технологии внесения.",
      items: product.important.map(cleanText)
    }
  ];
}

function buildInstruction(product: Product): ProductPageData["instruction"] {
  return {
    title: `Инструкция по применению ${product.name}`,
    paragraphs: [
      `${product.name} применяют в составе схемы питания картофеля. Удобрение распределяют по участку или вносят локально, после чего заделывают в почву с учётом выбранной технологии.`,
      `Ориентировочная норма для калькулятора: ${product.recommendedRange}. Это стартовое значение для расчёта количества мешков, а не универсальная инструкция для любой почвы.`,
      "При локальном внесении гранулы не должны лежать вплотную к клубню. Финальную схему корректируют по анализу почвы, влажности, сорту картофеля и цели выращивания."
    ],
    steps: [
      "Оцените площадь участка и задачу внесения.",
      "Выберите норму в калькуляторе или задайте её вручную.",
      "Равномерно внесите удобрение или добавьте его локально в посадочную зону.",
      "Перемешайте гранулы с почвой и избегайте прямого контакта с клубнем.",
      "При необходимости скорректируйте питание по состоянию растений."
    ],
    important:
      "Важно: указанная норма является ориентировочной. Итоговая схема зависит от анализа почвы, сорта картофеля, площади и технологии выращивания."
  };
}

function buildRelatedArticles(product: Product) {
  const matched = articles.filter((article) => article.relatedProductSlugs.includes(product.slug)).map((article) => article.slug);
  return matched.length ? matched.slice(0, 3) : articles.slice(0, 3).map((article) => article.slug);
}

export function toProductPageData(product: Product): ProductPageData {
  const nutrients = buildNutrients(product);
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    shortDescription: product.shortDescription,
    fullDescription: cleanText(product.description),
    quickSummary: `${product.shortDescription} Точную норму считайте по площади и состоянию почвы.`,
    type: product.fertilizerType,
    form: "Гранулы",
    nutrients,
    packageWeight: product.bagWeight,
    price: product.price ?? 10,
    availability: product.inStock ? "Уточняется" : "Под заказ",
    usageStages: product.stage,
    tasks: [...product.tasks.slice(0, 3), product.packageSize],
    benefits: [
      { title: "Основное действие", text: cleanText(product.mainAction) },
      { title: "Для каких задач", text: product.tasks.join(", ") },
      { title: "Что важно учесть", text: product.important[0] ? cleanText(product.important[0]) : "Норма зависит от почвы, площади и технологии." },
      { title: "Форма", text: "Гранулированное минеральное удобрение." }
    ],
    cautions: product.important.map(cleanText),
    characteristics: buildCharacteristics(product),
    calculatorDefaults: {
      norm: product.defaultNorm,
      normUnit: product.normUnit,
      bagWeight: product.bagWeight,
      areaSotka: 10,
      price: product.price ?? 10
    },
    images: buildImages(product),
    passport: { available: false },
    instruction: buildInstruction(product),
    infoCards: buildInfoCards(product),
    orderSteps: [
      "Выберите товар",
      "Укажите площадь участка",
      "Рассчитайте количество",
      "Отправьте заявку",
      "Менеджер уточнит цену, наличие и доставку"
    ],
    relatedProducts: (relatedMap[product.slug] ?? products.filter((item) => item.slug !== product.slug).slice(0, 4).map((item) => item.slug)).filter(
      (slug) => slug !== product.slug && Boolean(findProduct(slug))
    ),
    relatedArticles: buildRelatedArticles(product)
  };
}

export const productsData = products.map(toProductPageData);

export function findProductPage(slug: string) {
  const product = findProduct(slug);
  return product ? toProductPageData(product) : undefined;
}

export const npkPotatoPage = findProductPage("npk-potato") ?? productsData[0];

export function relatedProductCards(slugs: string[]) {
  return slugs.map((slug) => findProduct(slug)).filter((product): product is Product => Boolean(product));
}

export function relatedArticleCards(slugs: string[]) {
  return slugs.map((slug) => articles.find((article) => article.slug === slug)).filter((article): article is (typeof articles)[number] => Boolean(article));
}
