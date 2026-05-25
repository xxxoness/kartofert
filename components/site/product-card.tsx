import Link from "next/link";
import { ArrowRight, GitCompareArrows, MessageCircle } from "lucide-react";
import { Product } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035))] transition duration-300 hover:-translate-y-1 hover:border-emerald-200/26">
      <CardHeader>
        <div className="mb-5 flex min-h-24 items-end justify-between gap-4 rounded-[8px] bg-[radial-gradient(circle_at_28%_16%,rgba(52,211,153,.24),transparent_42%),linear-gradient(135deg,rgba(245,230,190,.13),rgba(16,50,33,.42))] p-4">
          <div className="h-20 w-14 rounded-md border border-white/18 bg-[linear-gradient(145deg,#e8d6a7,#103421_65%,#0a160f)] shadow-2xl transition group-hover:rotate-2">
            <div className="mx-auto mt-3 h-2 w-8 rounded-full bg-emerald-200/70" />
            <div className="mx-auto mt-7 h-5 w-8 rounded-full bg-white/18" />
          </div>
          <div className="text-right text-xs text-stone-300">
            <p>{product.pack}</p>
            <p className="mt-1 text-emerald-100">{product.season}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.badges.map((badge) => (
            <Badge key={badge}>{badge}</Badge>
          ))}
        </div>
        <CardTitle className="mt-3">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="text-sm leading-6 text-stone-300">{product.description}</p>
        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="text-stone-500">Состав</dt>
            <dd className="mt-1 text-stone-200">{product.composition}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Норма</dt>
            <dd className="mt-1 text-stone-200">{product.dosage}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Культуры</dt>
            <dd className="mt-1 text-stone-200">{product.crops.join(", ")}</dd>
          </div>
        </dl>
        <div className="mt-auto pt-6">
          <p className="mb-4 text-lg font-semibold text-white">{formatPrice(product.price)}</p>
          <div className="grid gap-2">
            <Button asChild>
              <Link href={`/products/${product.slug}`}>
                Подробнее
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link href="/contacts">
                  <MessageCircle className="h-4 w-4" />
                  Консультация
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/compare">
                  <GitCompareArrows className="h-4 w-4" />
                  Сравнить
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
