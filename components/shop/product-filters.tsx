"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart, SlidersHorizontal, Grid2X2, List, Search, ShoppingCart, X } from "lucide-react";
import { Product, elements, formatProductPrice, stages, tasks } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/shop/cart-provider";
import { useProductsStore } from "@/components/shop/product-store";

const typeLabels = ["Комплексные NPK", "Азотные", "Фосфорные", "Калийные", "Микроудобрения", "Улучшители почвы", "Натуральные"];

const productImages: Record<string, string> = {
  "npk-potato": "/assets/products/npk-potato/front.png",
  "nitroammofoska-azofoska": "/assets/products/nitroammofoska-azofoska/front.png",
  diammofoska: "/assets/products/diammofoska/front.png",
  ammofos: "/assets/products/ammofos/front.png",
  superfosfat: "/assets/products/superfosfat/front.png",
  "sulfate-potassium": "/assets/products/sulfate-potassium/front.png",
  kalimagnesia: "/assets/products/kalimagnesia/front.png",
  "monopotassium-phosphate": "/assets/products/monopotassium-phosphate/front.png",
  "potassium-nitrate": "/assets/products/potassium-nitrate/front.png",
  "ammonium-sulfate": "/assets/products/ammonium-sulfate/front.png",
  "ammonium-nitrate": "/assets/products/ammonium-nitrate/front.png",
  urea: "/assets/products/urea/front.png",
  borofoska: "/assets/products/borofoska/front.png",
  "dolomite-flour": "/assets/products/dolomite-flour/front.png",
  "wood-ash": "/assets/products/wood-ash/front.png"
};

export function ProductFilters({ initialSearch = "", initialType = "" }: { initialSearch?: string; initialType?: string }) {
  const { products } = useProductsStore();
  const [search, setSearch] = useState(initialSearch);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialType ? [initialType] : []);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("popular");
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  const resetFilters = () => {
    setSearch("");
    setSelectedTypes([]);
    setSelectedTasks([]);
    setSelectedElements([]);
    setSelectedStages([]);
    setMinPrice("");
    setMaxPrice("");
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;

    const result = products.filter((product) => {
      const haystack = [
        product.name,
        product.shortName,
        product.category,
        product.fertilizerType,
        product.shortDescription,
        product.description,
        product.tags.join(" "),
        product.elements.map((item) => `${item.symbol} ${item.label}`).join(" ")
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesType = !selectedTypes.length || selectedTypes.some((type) => product.typeGroup.includes(type) || product.category.includes(type));
      const matchesTask = !selectedTasks.length || selectedTasks.some((task) => product.tasks.includes(task));
      const matchesElement =
        !selectedElements.length ||
        selectedElements.some((symbol) => product.elements.some((element) => element.symbol.toLowerCase().includes(symbol.toLowerCase())));
      const matchesStage = !selectedStages.length || selectedStages.some((stage) => product.stage.includes(stage));
      const matchesPrice = (typeof min !== "number" || (product.price ?? 0) >= min) && (typeof max !== "number" || (product.price ?? 0) <= max);
      return matchesSearch && matchesType && matchesTask && matchesElement && matchesStage && matchesPrice;
    });

    if (sort === "price-asc") result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === "price-desc") result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    return result;
  }, [products, search, selectedTypes, selectedTasks, selectedElements, selectedStages, minPrice, maxPrice, sort]);

  const toggle = (value: string, list: string[], setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[296px_minmax(0,1fr)]">
      <div className="grid gap-3 rounded-[20px] border border-[#173c25]/10 bg-white p-3 shadow-[0_16px_42px_rgba(45,35,17,.055)] lg:col-span-2 lg:grid-cols-[296px_minmax(0,1fr)_auto_auto]">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFiltersVisible((value) => !value)}
          className="h-[52px] justify-start rounded-[14px] border-[#173c25]/10 bg-[#fffdf8] px-4 text-[#102116] shadow-none hover:bg-[#fff8e8]"
        >
          <SlidersHorizontal className="h-5 w-5" />
          {filtersVisible ? "Скрыть фильтры" : "Показать фильтры"}
        </Button>
        <label className="relative">
          <span className="sr-only">Поиск удобрения</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск удобрения по названию или элементу"
            className="h-[52px] w-full rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-5 pr-14 text-sm font-medium text-[#102116] outline-none transition placeholder:text-[#87917d] focus:border-[#f5b400] focus:ring-4 focus:ring-[#f5b400]/20"
          />
          <span className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-[11px] bg-[#f5b400] text-[#1b1500]">
            <Search className="h-5 w-5" />
          </span>
        </label>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="h-[52px] rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 text-sm font-bold text-[#102116] outline-none focus:border-[#f5b400]"
        >
          <option value="popular">Сортировать: по популярности</option>
          <option value="price-asc">Цена: сначала дешевле</option>
          <option value="price-desc">Цена: сначала дороже</option>
          <option value="name">По названию</option>
        </select>
        <div className="flex rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] p-1">
          <button
            className={`grid h-11 w-11 place-items-center rounded-[11px] ${view === "grid" ? "bg-[#063b23] text-white" : "text-[#314131]"}`}
            onClick={() => setView("grid")}
            aria-label="Сетка"
          >
            <Grid2X2 className="h-5 w-5" />
          </button>
          <button
            className={`grid h-11 w-11 place-items-center rounded-[11px] ${view === "list" ? "bg-[#063b23] text-white" : "text-[#314131]"}`}
            onClick={() => setView("list")}
            aria-label="Список"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {filtersVisible ? (
        <aside className="rounded-[22px] border border-[#173c25]/10 bg-[#fffdf8] p-5 shadow-[0_16px_42px_rgba(45,35,17,.06)] lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.035em] text-[#102116]">Фильтры</h2>
            <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1 rounded-full bg-[#f6f1e6] px-3 py-1.5 text-xs font-black text-[#5c654f] transition hover:bg-[#fff0bd] hover:text-[#063b23]">
              <X className="h-3.5 w-3.5" />
              Сбросить
            </button>
          </div>
          <FilterSection title="Тип удобрения">
            {typeLabels.map((item) => (
              <FilterCheck key={item} label={item} checked={selectedTypes.includes(item)} onChange={() => toggle(item, selectedTypes, setSelectedTypes)} count={countByType(products, item)} />
            ))}
          </FilterSection>
          <FilterSection title="Задача">
            {tasks.map((item) => (
              <FilterCheck key={item} label={item} checked={selectedTasks.includes(item)} onChange={() => toggle(item, selectedTasks, setSelectedTasks)} count={countByTask(products, item)} />
            ))}
          </FilterSection>
          <FilterSection title="Элемент питания">
            {elements.map((item) => (
              <FilterCheck key={item} label={elementLabel(item)} checked={selectedElements.includes(item)} onChange={() => toggle(item, selectedElements, setSelectedElements)} />
            ))}
          </FilterSection>
          <FilterSection title="Этап выращивания">
            {stages.map((item) => (
              <FilterCheck key={item} label={item} checked={selectedStages.includes(item)} onChange={() => toggle(item, selectedStages, setSelectedStages)} count={countByStage(products, item)} />
            ))}
          </FilterSection>
          <FilterSection title="Цена">
            <div className="grid grid-cols-2 gap-2">
              <input
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="от"
                type="number"
                className="h-10 rounded-[10px] border border-[#173c25]/10 bg-white px-3 text-sm font-bold outline-none focus:border-[#f5b400]"
              />
              <input
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="до"
                type="number"
                className="h-10 rounded-[10px] border border-[#173c25]/10 bg-white px-3 text-sm font-bold outline-none focus:border-[#f5b400]"
              />
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#f0eadc]">
              <div className="h-2 w-full rounded-full bg-[#f5b400]" />
            </div>
            <p className="mt-2 text-xs font-bold text-[#7b8476]">Цена временно: 10 ₽ за мешок</p>
          </FilterSection>
          <Button type="button" onClick={resetFilters} variant="outline" className="mt-5 h-11 w-full rounded-[12px] border-[#173c25]/10 bg-[#fffdf8] text-[#063b23] shadow-none hover:bg-[#fff4cf]">
            Сбросить фильтры
          </Button>
        </aside>
      ) : null}

      <section className={filtersVisible ? "" : "lg:col-span-2"}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[#173c25]/10 bg-[#fffdf8] px-5 py-3 text-sm font-bold text-[#596553] shadow-[0_12px_30px_rgba(45,35,17,.045)]">
          <span>Найдено товаров: {filtered.length}</span>
          <span>Цена временно: 10 ₽ за мешок</span>
        </div>
        {filtered.length ? (
          <div className={view === "grid" ? "grid justify-start gap-5 sm:grid-cols-2 xl:grid-cols-4" : "grid gap-5 md:grid-cols-2"}>
            {filtered.map((product) => (
              <CatalogProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid min-h-[360px] place-items-center rounded-[18px] border border-[#173c25]/10 bg-white p-8 text-center shadow-[0_16px_42px_rgba(45,35,17,.06)]">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fff3cd] text-3xl">!</div>
              <h2 className="mt-5 text-2xl font-black tracking-[-0.04em] text-[#102116]">Ничего не найдено</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#596553]">
                Попробуйте изменить фильтры, убрать ограничение по цене или найти удобрение по элементу питания.
              </p>
              <Button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-[10px] bg-[#063b23] text-white hover:bg-[#0d5a36]"
              >
                Сбросить фильтры
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#173c25]/10 py-3.5 first:pt-0 last:border-b-0 last:pb-0">
      <h3 className="mb-2.5 text-[15px] font-black text-[#102116]">{title}</h3>
      <div className="grid gap-1.5">{children}</div>
    </div>
  );
}

function FilterCheck({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-[10px] px-1.5 py-1.5 text-sm font-semibold text-[#4f5e4f] transition hover:bg-[#f7f2e8]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[#173c25]/20 text-[#063b23] accent-[#063b23]"
      />
      <span className="min-w-0 flex-1">{label}</span>
      {typeof count === "number" ? <span className="text-xs text-[#7d8678]">({count})</span> : null}
    </label>
  );
}

function CatalogProductCard({ product: initialProduct }: { product: Product }) {
  const { getProduct } = useProductsStore();
  const { addItem } = useCart();
  const product = getProduct(initialProduct.slug) ?? initialProduct;
  const image = productImages[product.slug];
  const elementLine = product.elements
    .slice(0, 5)
    .map((element) => element.symbol)
    .join(" • ");

  return (
    <article className="group relative flex h-full min-h-[368px] flex-col overflow-hidden rounded-[20px] border border-[#173c25]/10 bg-white p-3.5 shadow-[0_14px_36px_rgba(45,35,17,.055)] transition duration-300 hover:-translate-y-1 hover:border-[#f5b400]/60 hover:shadow-[0_24px_64px_rgba(45,35,17,.11)]">
      <button
        className="absolute right-6 top-6 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/92 text-[#1e5a37] shadow-[0_8px_24px_rgba(28,38,25,.1)] transition hover:bg-[#fff1be] hover:text-[#063b23]"
        aria-label="Добавить в избранное"
      >
        <Heart className="h-5 w-5" />
      </button>

      <Link href={`/products/${product.slug}`} className="relative h-[178px] overflow-hidden rounded-[16px] bg-[linear-gradient(180deg,#fffefb,#f2ead8)]">
        {image ? (
          <Image src={image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 250px" className="scale-[1.24] object-contain p-0 transition duration-300 group-hover:scale-[1.29]" />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-sm font-bold text-[#6c7565]">Фото товара скоро появится</div>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-2.5">
        <span className="w-fit rounded-[7px] bg-[#eff2e6] px-2.5 py-1 text-xs font-bold text-[#56624c]">{product.fertilizerType}</span>
        <Link href={`/products/${product.slug}`} className="mt-2">
          <h3 className="line-clamp-2 min-h-[40px] text-[17px] font-black leading-[1.14] tracking-[-0.035em] text-[#102116] transition group-hover:text-[#063b23]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 min-h-5 text-sm font-semibold text-[#65705f]">{elementLine || product.category}</p>
        <p className="mt-0.5 text-sm font-bold text-[#102116]">{product.packageSize}</p>

        <div className="mt-auto pt-2.5">
          <div className="mb-2.5 flex items-end justify-between gap-3">
            <p className="text-[24px] font-black tracking-[-0.04em] text-[#071a10]">{formatProductPrice(product)}</p>
            <button
              onClick={() => addItem(product)}
              className="grid h-11 w-11 place-items-center rounded-[12px] bg-[#063b23] text-white transition hover:bg-[#0d5a36]"
              aria-label="Добавить в корзину"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" className="h-10 rounded-[10px] border-[#1c4a2e]/35 bg-white text-[#063b23] hover:bg-[#f1f5ea]">
              <Link href={`/products/${product.slug}`}>Подробнее</Link>
            </Button>
            <Button asChild className="h-10 rounded-[10px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
              <Link href={`/calculator?product=${product.slug}`}>Рассчитать</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function countByType(products: Product[], type: string) {
  return products.filter((product) => product.typeGroup.includes(type) || product.category.includes(type)).length;
}

function countByTask(products: Product[], task: string) {
  return products.filter((product) => product.tasks.includes(task)).length;
}

function countByStage(products: Product[], stage: string) {
  return products.filter((product) => product.stage.includes(stage)).length;
}

function elementLabel(symbol: string) {
  const labels: Record<string, string> = {
    N: "Азот (N)",
    P: "Фосфор (P)",
    K: "Калий (K)",
    Ca: "Кальций (Ca)",
    Mg: "Магний (Mg)",
    S: "Сера (S)",
    B: "Бор (B)",
    Zn: "Цинк (Zn)"
  };
  return labels[symbol] ?? symbol;
}
