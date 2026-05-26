import { createClient } from "@supabase/supabase-js";
import { products } from "../data/products";
import { articles } from "../data/articles";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running Supabase seed.");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function main() {
  for (const [index, product] of products.entries()) {
    const { error } = await supabase.from("products").upsert(
      {
        slug: product.slug,
        title: product.name,
        short_description: product.shortDescription,
        description: product.description,
        category: product.category,
        nutrients: product.elements,
        growing_stages: product.stage,
        price: null,
        price_label: "Цена уточняется",
        price_mode: "request",
        currency: "BYN",
        package_weight: product.packageSize,
        image_url: `/assets/products/${product.slug}/front.png`,
        images: [
          `/assets/products/${product.slug}/front.png`,
          `/assets/products/${product.slug}/angle.png`,
          `/assets/products/${product.slug}/back.png`
        ],
        is_published: true,
        in_stock: product.inStock,
        sort_order: index
      },
      { onConflict: "slug" }
    );
    if (error) throw error;
  }

  for (const [index, article] of articles.entries()) {
    const { error } = await supabase.from("articles").upsert(
      {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.sections.map((section) => `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}`).join("\n\n"),
        category: article.category,
        cover_image_url: "/assets/images/knowledge-base/articles/kb-article-potato-growth-stage.png",
        read_time: article.readTime,
        published_at: new Date().toISOString(),
        status: "published",
        is_featured: index === 0
      },
      { onConflict: "slug" }
    );
    if (error) throw error;
  }

  await supabase.from("site_settings").upsert(
    {
      key: "site",
      value: {
        phone: "+375 29 123-45-67",
        email: "kartofert.by@gmail.com",
        city: "Минск, доставка по Беларуси",
        cityDelivery: "Минск, доставка по Беларуси",
        footerText: "Интернет-магазин удобрений для картофеля.",
        currency: "BYN",
        showPrices: true,
        enableOnlinePayment: false,
        onlinePaymentEnabled: false,
        mainCtaText: "Перейти в каталог",
        mainCta: "Перейти в каталог",
        deliveryText: "Доставка по Беларуси"
      }
    },
    { onConflict: "key" }
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
