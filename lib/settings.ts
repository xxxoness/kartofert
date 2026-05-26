import { prisma, withDatabase } from "@/lib/db";
import { siteConfig } from "@/config/site";

export type SiteSettingsValue = {
  phone: string;
  email: string;
  city: string;
  footerText: string;
  currency: string;
  showPrices: boolean;
  enableOnlinePayment: boolean;
  mainCtaText: string;
  deliveryText: string;
};

export const defaultSiteSettings: SiteSettingsValue = {
  phone: siteConfig.phone,
  email: "kartofert.by@gmail.com",
  city: "Минск, доставка по Беларуси",
  footerText: "Интернет-магазин удобрений для картофеля.",
  currency: "BYN",
  showPrices: true,
  enableOnlinePayment: true,
  mainCtaText: "Перейти в каталог",
  deliveryText: "Доставка по Беларуси"
};

export async function getSiteSettings() {
  return withDatabase(
    async () => {
      const row = await prisma.siteSettings.findUnique({ where: { key: "site" } });
      return row?.value && typeof row.value === "object" ? ({ ...defaultSiteSettings, ...(row.value as object) } as SiteSettingsValue) : defaultSiteSettings;
    },
    defaultSiteSettings
  );
}

export async function getSetting(key: string) {
  return withDatabase(async () => prisma.siteSettings.findUnique({ where: { key } }), null);
}
