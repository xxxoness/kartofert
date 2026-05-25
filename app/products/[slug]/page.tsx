import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProductPage, productsData } from "@/data/product-pages";
import { NpkProductPage } from "@/components/shop/npk-product-page";

export function generateStaticParams() {
  return productsData.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductPage(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name}: назначение, элементы питания, расчёт количества и заявка в KartoFert.`
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = findProductPage(slug);
  if (!product) notFound();

  return <NpkProductPage product={product} />;
}
