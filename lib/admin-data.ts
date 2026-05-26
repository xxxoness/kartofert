import { articles } from "@/data/articles";
import { products } from "@/data/products";
import { siteConfig } from "@/config/site";

export type AdminProductRow = {
  slug: string;
  name: string;
  category: string;
  price: number | null;
  packageSize: string;
  availability: string;
  status: "published" | "hidden";
  image: string;
  elements: string;
};

export type AdminArticleRow = {
  slug: string;
  title: string;
  category: string;
  status: "published" | "draft";
  date: string;
  image: string;
};

export type AdminOrderRow = {
  id: string;
  customer: string;
  phone: string;
  email?: string;
  total: number;
  status: string;
  paymentStatus: string;
  date: string;
};

const articleImages = [
  "/assets/images/knowledge-base/articles/kb-article-potato-growth-stage.png",
  "/assets/images/knowledge-base/articles/kb-article-potato-leaves-healthy.png",
  "/assets/images/knowledge-base/articles/kb-article-fertilizer-granules.png",
  "/assets/images/knowledge-base/articles/kb-article-potato-sprouting-tubers.png",
  "/assets/images/knowledge-base/articles/kb-article-potato-leaf-deficiency.png",
  "/assets/images/knowledge-base/tools/kb-tool-fertilizer-calculator.png",
  "/assets/images/knowledge-base/articles/kb-article-potato-storage-crate.png"
];

export function getProductsForAdmin(): AdminProductRow[] {
  return products.map((product) => ({
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: typeof product.price === "number" ? product.price : null,
    packageSize: product.packageSize,
    availability: product.inStock ? "В наличии" : "Уточняется",
    status: "published",
    image: `/assets/products/${product.slug}/front.png`,
    elements: product.elements.map((element) => element.symbol).join(", ")
  }));
}

export function getArticlesForAdmin(): AdminArticleRow[] {
  return articles.map((article, index) => ({
    slug: article.slug,
    title: article.title,
    category: article.category,
    status: "published",
    date: article.date,
    image: articleImages[index % articleImages.length]
  }));
}

export function getOrdersForAdmin(): AdminOrderRow[] {
  return [];
}

export function getAnalyticsSummary() {
  return {
    enabled: false,
    message: "Аналитика начнёт собираться после подключения tracking endpoint.",
    items: [
      "Посетители сегодня",
      "Активные сейчас",
      "Просмотры страниц",
      "Популярные страницы",
      "Популярные товары",
      "Добавления в корзину",
      "Начатые оформления заказа",
      "Отправленные формы",
      "Ошибки"
    ]
  };
}

export function getSiteSettings() {
  return {
    phone: siteConfig.phone,
    email: siteConfig.email,
    city: siteConfig.address,
    footerText: "Интернет-магазин удобрений для картофеля.",
    onlinePaymentEnabled: true,
    pricesEnabled: true,
    currency: "₽",
    primaryCta: "Перейти в каталог"
  };
}

export function getAdminLogs() {
  return [];
}

export function getAdminStats() {
  const productRows = getProductsForAdmin();
  const articleRows = getArticlesForAdmin();
  const orderRows = getOrdersForAdmin();

  return {
    products: {
      total: productRows.length,
      published: productRows.filter((product) => product.status === "published").length,
      hidden: productRows.filter((product) => product.status === "hidden").length
    },
    orders: {
      total: orderRows.length,
      new: orderRows.filter((order) => order.status === "Новый").length,
      processing: orderRows.filter((order) => order.status === "В обработке").length
    },
    articles: {
      total: articleRows.length,
      published: articleRows.filter((article) => article.status === "published").length,
      drafts: articleRows.filter((article) => article.status === "draft").length
    },
    visitors: {
      viewsToday: null as number | null,
      activeNow: null as number | null,
      popularPage: null as string | null,
      message: "Данные появятся после подключения аналитики."
    }
  };
}
