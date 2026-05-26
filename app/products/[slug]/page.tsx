import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toProductPageData } from "@/data/product-pages";
import { NpkProductPage } from "@/components/shop/npk-product-page";
import { getProductBySlug, getPublishedProducts } from "@/lib/products";

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: `${product.name}: назначение, элементы питания, расчёт количества и оформление заказа в KartoFert.`
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return <NpkProductPage product={toProductPageData(product)} />;
}
