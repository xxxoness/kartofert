import { Prisma } from "@prisma/client";
import { prisma, withDatabase } from "@/lib/db";
import { Product, products as staticProducts } from "@/data/products";

type DbProduct = Awaited<ReturnType<typeof prisma.product.findFirst>>;

function asNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value == null) return undefined;
  return typeof value === "number" ? value : Number(value.toString());
}

export function dbProductToProduct(row: NonNullable<DbProduct>): Product {
  const legacy = (row.legacy && typeof row.legacy === "object" ? row.legacy : {}) as Partial<Product>;
  const price = row.priceMode === "request" ? undefined : asNumber(row.price);

  return {
    ...legacy,
    slug: row.slug,
    name: row.title,
    shortName: row.shortTitle ?? legacy.shortName ?? row.title,
    brand: legacy.brand ?? "KartoFert",
    category: row.category,
    fertilizerType: row.type ?? legacy.fertilizerType ?? row.category,
    typeGroup: legacy.typeGroup ?? row.category,
    tasks: legacy.tasks ?? (row.task ? row.task.split(",").map((item) => item.trim()).filter(Boolean) : []),
    elements: (Array.isArray(row.nutrients) ? row.nutrients : legacy.elements ?? []) as Product["elements"],
    stage: legacy.stage ?? (row.stage ? row.stage.split(",").map((item) => item.trim()).filter(Boolean) : []),
    packageSize: legacy.packageSize ?? `${row.packageWeightKg} кг`,
    bagWeight: row.packageWeightKg,
    price,
    formula: legacy.formula,
    bagTitle: legacy.bagTitle ?? row.shortTitle ?? row.title,
    bagSubtitle: legacy.bagSubtitle ?? row.category,
    bagTheme: legacy.bagTheme ?? "npk-potato",
    shortDescription: row.shortDescription ?? legacy.shortDescription ?? "",
    description: row.description,
    mainAction: legacy.mainAction ?? row.shortDescription ?? row.description,
    advantages: legacy.advantages ?? [],
    important: legacy.important ?? [],
    application: legacy.application ?? "",
    dosage: legacy.dosage ?? "",
    defaultNorm: legacy.defaultNorm ?? 100,
    normUnit: legacy.normUnit ?? "кг/га",
    recommendedRange: legacy.recommendedRange ?? "",
    tags: legacy.tags ?? [],
    inStock: row.stockStatus !== "out_of_stock",
    imageTone: legacy.imageTone ?? "green",
    crops: legacy.crops ?? ["Картофель"]
  } as Product;
}

export function productToAdminRow(product: Product) {
  return {
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
    legacy: product
  };
}

export async function getProducts() {
  return withDatabase(
    async () => {
      const rows = await prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });
      return rows.map(dbProductToProduct);
    },
    staticProducts
  );
}

export async function getPublishedProducts() {
  return withDatabase(
    async () => {
      const rows = await prisma.product.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }]
      });
      return rows.map(dbProductToProduct);
    },
    staticProducts
  );
}

export async function getProductBySlug(slug: string) {
  return withDatabase(
    async () => {
      const row = await prisma.product.findFirst({ where: { slug, isPublished: true } });
      return row ? dbProductToProduct(row) : null;
    },
    staticProducts.find((product) => product.slug === slug) ?? null
  );
}

export async function getAdminProducts() {
  return withDatabase(
    async () => prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] }),
    staticProducts.map((product, index) => ({
      id: product.slug,
      ...productToAdminRow(product),
      isFeatured: index < 4,
      sortOrder: index,
      seoTitle: product.name,
      seoDescription: product.shortDescription,
      stockQty: null,
      composition: null,
      specs: null,
      instructions: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );
}

export async function getAdminProductById(id: string) {
  return withDatabase(
    async () => prisma.product.findUnique({ where: { id } }),
    null
  );
}

export async function getAdminProductBySlug(slug: string) {
  return withDatabase(
    async () => prisma.product.findUnique({ where: { slug } }),
    null
  );
}
