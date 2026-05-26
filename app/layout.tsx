import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartProvider } from "@/components/shop/cart-provider";
import { siteConfig } from "@/config/site";
import { ProductsProvider } from "@/components/shop/product-store";
import { getPublishedProducts } from "@/lib/products";
import { siteUrl } from "@/lib/site-url";

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
    type: "website"
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
