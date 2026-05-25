"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { categories, products, productTypes, seasons } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";

export function ProductFilters() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все категории");
  const [type, setType] = useState("Все типы");
  const [season, setSeason] = useState("Любой сезон");
  const [sort, setSort] = useState("По рекомендации");

  const filtered = useMemo(() => {
    const items = products.filter((product) => {
      const text = `${product.name} ${product.description} ${product.crops.join(" ")} ${product.composition}`.toLowerCase();
      return (
        text.includes(query.toLowerCase()) &&
        (category === "Все категории" || product.category === category) &&
        (type === "Все типы" || product.type === type) &&
        (season === "Любой сезон" || product.season === season)
      );
    });
    if (sort === "Сначала дешевле") return [...items].sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
    if (sort === "Сначала дороже") return [...items].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return items;
  }, [category, query, season, sort, type]);

  return (
    <div className="grid gap-8">
      <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-5">
        <div className="mb-5 flex items-center gap-2 text-white">
          <SlidersHorizontal className="h-5 w-5 text-emerald-200" />
          <h2 className="text-lg font-semibold">Фильтры каталога</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Label htmlFor="product-search">Поиск</Label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-stone-500" />
              <Input id="product-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Название, культура или состав" className="pl-10" />
            </div>
          </div>
          <FilterSelect label="Культура" value={category} onChange={setCategory} items={["Все категории", ...categories]} />
          <FilterSelect label="Тип" value={type} onChange={setType} items={["Все типы", ...productTypes]} />
          <FilterSelect label="Сезон" value={season} onChange={setSeason} items={["Любой сезон", ...seasons]} />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-400">Найдено: {filtered.length}</p>
          <div className="w-full sm:w-56">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger aria-label="Сортировка">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["По рекомендации", "Сначала дешевле", "Сначала дороже"].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-10 text-center">
          <h3 className="text-2xl font-semibold text-white">По выбранным параметрам ничего не найдено</h3>
          <p className="mx-auto mt-3 max-w-lg text-stone-400">
            Попробуйте изменить культуру, сезон или поисковый запрос. Если задача нестандартная, мы подберем продукт вручную.
          </p>
          <Button className="mt-6" onClick={() => { setQuery(""); setCategory("Все категории"); setType("Все типы"); setSeason("Любой сезон"); }}>
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, items }: { label: string; value: string; onChange: (value: string) => void; items: string[] }) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
