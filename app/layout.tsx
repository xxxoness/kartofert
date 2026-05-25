import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartProvider } from "@/components/shop/cart-provider";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://kartofert.by"),
  title: {
    default: `${siteConfig.brandName} — удобрения для картофеля с расчётом`,
    template: `%s | ${siteConfig.brandName}`
  },
  description: siteConfig.siteDescription,
  keywords: [
    "удобрения для картофеля",
    "KartoFert",
    "калькулятор удобрений",
    "сульфат калия",
    "калимагнезия",
    "борофоска"
  ],
  openGraph: {
    title: `${siteConfig.brandName} — магазин удобрений для картофеля`,
    description: siteConfig.siteDescription,
    locale: "ru_BY",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
