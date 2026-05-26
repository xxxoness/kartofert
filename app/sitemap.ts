import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles";
import { getPublishedProducts } from "@/lib/products";
import { absoluteUrl } from "@/lib/site-url";

const staticRoutes = ["/", "/products", "/potato", "/calculator", "/delivery", "/knowledge", "/about", "/contacts", "/cart", "/checkout"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([getPublishedProducts(), getPublishedArticles()]);
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: now,
      changeFrequency: route === "/" ? "daily" as const : "weekly" as const,
      priority: route === "/" ? 1 : 0.7
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/knowledge/${article.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
