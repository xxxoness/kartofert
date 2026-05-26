import { prisma, withDatabase } from "@/lib/db";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
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
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", "site").maybeSingle();
      if (error) throw error;
      return data?.value && typeof data.value === "object" ? ({ ...defaultSiteSettings, ...(data.value as object) } as SiteSettingsValue) : defaultSiteSettings;
    } catch (error) {
      console.error("[supabase settings]", error);
    }
  }

  return withDatabase(
    async () => {
      const row = await prisma.siteSettings.findUnique({ where: { key: "site" } });
      return row?.value && typeof row.value === "object" ? ({ ...defaultSiteSettings, ...(row.value as object) } as SiteSettingsValue) : defaultSiteSettings;
    },
    defaultSiteSettings
  );
}

export async function getSetting(key: string) {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("site_settings").select("*").eq("key", key).maybeSingle();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("[supabase setting]", error);
    }
  }

  return withDatabase(async () => prisma.siteSettings.findUnique({ where: { key } }), null);
}
