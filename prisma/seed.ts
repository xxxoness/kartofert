import { PrismaClient } from "@prisma/client";
import { products } from "../data/products";
import { articles } from "../data/articles";
import { siteConfig } from "../config/site";

const prisma = new PrismaClient();

function articleContent(article: (typeof articles)[number]) {
  return article.sections.map((section) => `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}`).join("\n\n");
}

async function main() {
  for (const [index, product] of products.entries()) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        slug: product.slug,
        title: product.name,
        shortTitle: product.shortName,
        description: product.description,
        shortDescription: product.shortDescription,
        category: product.category,
        type: product.fertilizerType,
        stage: product.stage.join(", "),
        task: product.tasks.join(", "),
        nutrients: product.elements,
        composition: {
          formula: product.formula,
          elements: product.elements
        },
        specs: {
          packageSize: product.packageSize,
          dosage: product.dosage,
          recommendedRange: product.recommendedRange,
          normUnit: product.normUnit
        },
        instructions: {
          application: product.application,
          important: product.important,
          advantages: product.advantages
        },
        image: `/assets/products/${product.slug}/front.png`,
        images: {
          front: `/assets/products/${product.slug}/front.png`,
          side: `/assets/products/${product.slug}/side.png`,
          back: `/assets/products/${product.slug}/back.png`
        },
        packageWeightKg: product.bagWeight,
        price: null,
        currency: "BYN",
        priceMode: "request",
        stockStatus: product.inStock ? "in_stock" : "out_of_stock",
        isPublished: true,
        isFeatured: index < 4,
        sortOrder: index,
        seoTitle: product.name,
        seoDescription: product.shortDescription,
        legacy: product
      },
      update: {
        title: product.name,
        shortTitle: product.shortName,
        description: product.description,
        shortDescription: product.shortDescription,
        category: product.category,
        type: product.fertilizerType,
        stage: product.stage.join(", "),
        task: product.tasks.join(", "),
        nutrients: product.elements,
        image: `/assets/products/${product.slug}/front.png`,
        images: {
          front: `/assets/products/${product.slug}/front.png`,
          side: `/assets/products/${product.slug}/side.png`,
          back: `/assets/products/${product.slug}/back.png`
        },
        packageWeightKg: product.bagWeight,
        currency: "BYN",
        stockStatus: product.inStock ? "in_stock" : "out_of_stock",
        isPublished: true,
        sortOrder: index,
        legacy: product
      }
    });
  }

  for (const [index, article] of articles.entries()) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: articleContent(article),
        category: article.category,
        coverImage: "/assets/images/knowledge-base/articles/kb-article-potato-growth-stage.png",
        readTime: article.readTime,
        publishedAt: new Date(),
        status: "published",
        isFeatured: index === 0,
        seoTitle: article.title,
        seoDescription: article.excerpt,
        legacy: article
      },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: articleContent(article),
        category: article.category,
        readTime: article.readTime,
        status: "published",
        isFeatured: index === 0,
        legacy: article
      }
    });
  }

  await prisma.siteSettings.upsert({
    where: { key: "site" },
    create: {
      key: "site",
      value: {
        phone: siteConfig.phone,
        email: "kartofert.by@gmail.com",
        city: "Минск, доставка по Беларуси",
        footerText: "Интернет-магазин удобрений для картофеля.",
        currency: "BYN",
        showPrices: true,
        enableOnlinePayment: true,
        mainCtaText: "Перейти в каталог",
        deliveryText: "Доставка по Беларуси"
      }
    },
    update: {
      value: {
        phone: siteConfig.phone,
        email: "kartofert.by@gmail.com",
        city: "Минск, доставка по Беларуси",
        footerText: "Интернет-магазин удобрений для картофеля.",
        currency: "BYN",
        showPrices: true,
        enableOnlinePayment: true,
        mainCtaText: "Перейти в каталог",
        deliveryText: "Доставка по Беларуси"
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
