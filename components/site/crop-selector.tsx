"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cropRecommendations } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function CropSelector() {
  const [active, setActive] = useState(cropRecommendations[0]);
  const Icon = active.icon;

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="grid gap-2">
        {cropRecommendations.map((item) => {
          const CropIcon = item.icon;
          return (
            <button
              key={item.crop}
              onClick={() => setActive(item)}
              className={`flex items-center gap-3 rounded-[8px] border p-4 text-left transition ${
                active.crop === item.crop ? "border-emerald-200/40 bg-emerald-300/12 text-white" : "border-white/10 bg-white/[0.04] text-stone-300 hover:bg-white/[0.07]"
              }`}
            >
              <CropIcon className="h-5 w-5 text-emerald-200" />
              <span className="font-medium">{item.crop}</span>
            </button>
          );
        })}
      </div>
      <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-7">
        <Icon className="h-9 w-9 text-emerald-200" />
        <h3 className="mt-5 text-2xl font-semibold text-white">{active.crop}</h3>
        <p className="mt-3 leading-7 text-stone-300">{active.text}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {active.categories.map((category) => (
            <Badge key={category}>{category}</Badge>
          ))}
        </div>
        <Button asChild className="mt-7">
          <Link href="/products">
            Смотреть продукты
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
