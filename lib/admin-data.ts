import { Prisma } from "@prisma/client";
import { getAdminArticles } from "@/lib/articles";
import { getAdminLogs as readAdminLogs } from "@/lib/admin-logs";
import { getAnalyticsSummary as readAnalyticsSummary } from "@/lib/analytics";
import { getOrders } from "@/lib/orders";
import { getAdminProducts } from "@/lib/products";
import { getSiteSettings as readSiteSettings } from "@/lib/settings";

function money(value: Prisma.Decimal | number | null | undefined) {
  if (value == null) return null;
  return typeof value === "number" ? value : Number(value.toString());
}

export async function getProductsForAdmin() {
  const rows = await getAdminProducts();

  return rows.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.title,
    category: product.category,
    price: money(product.price),
    currency: product.currency,
    priceMode: product.priceMode,
    packageSize: `${product.packageWeightKg} кг`,
    availability: product.stockStatus,
    stockQty: product.stockQty,
    status: product.isPublished ? "published" : "hidden",
    image: product.image ?? `/assets/products/${product.slug}/front.png`,
    elements: Array.isArray(product.nutrients)
      ? product.nutrients
          .map((element) => (typeof element === "object" && element && "symbol" in element ? String(element.symbol) : ""))
          .filter(Boolean)
          .join(", ")
      : ""
  }));
}

export async function getArticlesForAdmin() {
  const rows = await getAdminArticles();

  return rows.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category,
    status: article.status,
    date: article.publishedAt ? article.publishedAt.toLocaleDateString("ru-RU") : "Не опубликована",
    image: article.coverImage ?? "/assets/images/knowledge-base/articles/kb-article-potato-growth-stage.png"
  }));
}

export async function getOrdersForAdmin() {
  return getOrders();
}

export async function getAnalyticsSummary() {
  return readAnalyticsSummary();
}

export async function getSiteSettings() {
  return readSiteSettings();
}

export async function getAdminLogs() {
  return readAdminLogs();
}

export async function getAdminStats() {
  const [productRows, articleRows, orderRows] = await Promise.all([getProductsForAdmin(), getArticlesForAdmin(), getOrdersForAdmin()]);

  return {
    products: {
      total: productRows.length,
      published: productRows.filter((product) => product.status === "published").length,
      hidden: productRows.filter((product) => product.status === "hidden").length
    },
    orders: {
      total: orderRows.length,
      new: orderRows.filter((order) => order.status === "new").length,
      processing: orderRows.filter((order) => order.status === "processing").length
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
