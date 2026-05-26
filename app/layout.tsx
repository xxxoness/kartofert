import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartProvider } from "@/components/shop/cart-provider";
import { siteConfig } from "@/config/site";
import { ProductsProvider } from "@/components/shop/product-store";
import { getPublishedProducts } from "@/lib/products";
import { siteUrl } from "@/lib/site-url";

const ogImageUrl = `${siteUrl}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/"
  },
  title: {
    default: `${siteConfig.brandName} вЂ” СѓРґРѕР±СЂРµРЅРёСЏ РґР»СЏ РєР°СЂС‚РѕС„РµР»СЏ СЃ СЂР°СЃС‡С‘С‚РѕРј`,
    template: `%s | ${siteConfig.brandName}`
  },
  description: siteConfig.siteDescription,
  keywords: [
    "СѓРґРѕР±СЂРµРЅРёСЏ РґР»СЏ РєР°СЂС‚РѕС„РµР»СЏ",
    "KartoFert",
    "РєР°Р»СЊРєСѓР»СЏС‚РѕСЂ СѓРґРѕР±СЂРµРЅРёР№",
    "СЃСѓР»СЊС„Р°С‚ РєР°Р»РёСЏ",
    "РєР°Р»РёРјР°РіРЅРµР·РёСЏ",
    "Р±РѕСЂРѕС„РѕСЃРєР°"
  ],
  openGraph: {
    title: `${siteConfig.brandName} вЂ” РјР°РіР°Р·РёРЅ СѓРґРѕР±СЂРµРЅРёР№ РґР»СЏ РєР°СЂС‚РѕС„РµР»СЏ`,
    description: siteConfig.siteDescription,
    url: siteUrl,
    siteName: siteConfig.brandName,
    locale: "ru_BY",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "KartoFert — удобрения для картофеля"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandName} — удобрения для картофеля`,
    description: siteConfig.siteDescription,
    images: [
      {
        url: ogImageUrl,
        alt: "KartoFert — удобрения для картофеля"
      }
    ]
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const products = await getPublishedProducts();

  return (
    <html lang="ru">
      <body>
        <ProductsProvider initialProducts={products}>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
