import { Prisma } from "@prisma/client";
import { prisma, withDatabase } from "@/lib/db";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import { Product, products as staticProducts } from "@/data/products";

type DbProduct = Awaited<ReturnType<typeof prisma.product.findFirst>>;
type SupabaseProductRow = {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  category?: string | null;
  nutrients?: Product["elements"] | string[] | null;
  growing_stages?: string[] | null;
  price?: number | null;
  price_label?: string | null;
  price_mode?: string | null;
  currency?: string | null;
  package_weight?: string | null;
  image_url?: string | null;
  images?: unknown;
  is_published?: boolean | null;
  in_stock?: boolean | null;
  sort_order?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

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

function normalizeElements(value: SupabaseProductRow["nutrients"]): Product["elements"] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return { symbol: item, label: item };
    return item;
  });
}

function packageWeightNumber(value?: string | null) {
  if (!value) return 25;
  const parsed = Number(String(value).replace(",", ".").match(/\d+(\.\d+)?/)?.[0] ?? 25);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 25;
}

export function supabaseProductToProduct(row: SupabaseProductRow, showPrices = true): Product {
  const staticProduct = staticProducts.find((product) => product.slug === row.slug);
  const priceMode = row.price_mode ?? (row.price == null ? "request" : "real_price");
  const price = !showPrices || priceMode === "request" ? undefined : typeof row.price === "number" ? row.price : undefined;
  const packageWeight = packageWeightNumber(row.package_weight);

  return {
    ...(staticProduct ?? staticProducts[0]),
    slug: row.slug,
    name: row.title,
    shortName: staticProduct?.shortName ?? row.title,
    category: row.category ?? staticProduct?.category ?? "Удобрения",
    fertilizerType: row.category ?? staticProduct?.fertilizerType ?? "Удобрение",
    typeGroup: row.category ?? staticProduct?.typeGroup ?? "Удобрения",
    tasks: staticProduct?.tasks ?? [],
    elements: normalizeElements(row.nutrients).length ? normalizeElements(row.nutrients) : staticProduct?.elements ?? [],
    stage: row.growing_stages ?? staticProduct?.stage ?? [],
    packageSize: row.package_weight ?? staticProduct?.packageSize ?? `${packageWeight} кг`,
    bagWeight: packageWeight,
    price,
    shortDescription: row.short_description ?? staticProduct?.shortDescription ?? "",
    description: row.description ?? staticProduct?.description ?? "",
    mainAction: row.short_description ?? staticProduct?.mainAction ?? "",
    inStock: row.in_stock ?? true,
    bagTitle: staticProduct?.bagTitle ?? row.title,
    bagSubtitle: staticProduct?.bagSubtitle ?? row.category ?? "KartoFert"
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
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });
      if (error) throw error;
      const showPrices = await readShowPrices(supabase);
      return (data ?? []).map((row) => supabaseProductToProduct(row as SupabaseProductRow, showPrices));
    } catch (error) {
      console.error("[supabase products]", error);
    }
  }

  return withDatabase(
    async () => {
      const rows = await prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });
      return rows.map(dbProductToProduct);
    },
    staticProducts
  );
}

export async function getPublishedProducts() {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row) => supabaseProductToProduct(row as SupabaseProductRow));
    } catch (error) {
      console.error("[supabase products]", error);
    }
  }

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
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .is("deleted_at", null)
        .maybeSingle();
      if (error) throw error;
      const showPrices = await readShowPrices(supabase);
      return data ? supabaseProductToProduct(data as SupabaseProductRow, showPrices) : null;
    } catch (error) {
      console.error("[supabase product]", error);
    }
  }

  return withDatabase(
    async () => {
      const row = await prisma.product.findFirst({ where: { slug, isPublished: true } });
      return row ? dbProductToProduct(row) : null;
    },
    staticProducts.find((product) => product.slug === slug) ?? null
  );
}

async function readShowPrices(supabase: ReturnType<typeof createSupabaseAdminClient>) {
  const { data } = await supabase.from("site_settings").select("value").eq("key", "site").maybeSingle();
  const value = data?.value as { showPrices?: boolean; show_prices?: boolean } | null | undefined;
  return value?.showPrices ?? value?.show_prices ?? true;
}

export async function getAdminProducts() {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(supabaseProductToAdminRow);
    } catch (error) {
      console.error("[supabase admin products]", error);
    }
  }

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
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? supabaseProductToAdminRow(data as SupabaseProductRow) : null;
    } catch (error) {
      console.error("[supabase admin product]", error);
    }
  }

  return withDatabase(
    async () => prisma.product.findUnique({ where: { id } }),
    null
  );
}

export async function getAdminProductBySlug(slug: string) {
  if (hasSupabaseAdminEnv) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data ? supabaseProductToAdminRow(data as SupabaseProductRow) : null;
    } catch (error) {
      console.error("[supabase admin product]", error);
    }
  }

  return withDatabase(
    async () => prisma.product.findUnique({ where: { slug } }),
    null
  );
}

function supabaseProductToAdminRow(row: SupabaseProductRow) {
  const product = supabaseProductToProduct(row);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortTitle: product.shortName,
    description: row.description ?? "",
    shortDescription: row.short_description ?? "",
    category: row.category ?? "",
    type: row.category ?? "",
    stage: (row.growing_stages ?? []).join(", "),
    task: product.tasks.join(", "),
    nutrients: normalizeElements(row.nutrients),
    composition: null,
    specs: null,
    instructions: null,
    image: row.image_url,
    images: row.images,
    packageWeightKg: packageWeightNumber(row.package_weight),
    price: row.price,
    currency: row.currency ?? "BYN",
    priceMode: row.price_mode ?? (row.price == null ? "request" : "real_price"),
    priceLabel: row.price_label,
    stockStatus: row.in_stock === false ? "out_of_stock" : "in_stock",
    stockQty: null,
    isPublished: row.is_published ?? true,
    isFeatured: false,
    sortOrder: row.sort_order ?? 0,
    seoTitle: row.title,
    seoDescription: row.short_description,
    legacy: product,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date()
  };
}
