import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productCategories } from "@/data/categories";

export function CategoryTiles() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {productCategories.map((category) => {
        const Icon = category.icon;
        return (
          <Link
            key={category.title}
            href={category.href}
            className="group rounded-[16px] border border-[#173c25]/10 bg-white p-4 shadow-[0_12px_32px_rgba(45,35,17,.05)] transition hover:-translate-y-0.5 hover:border-[#f5b400]/60 hover:shadow-[0_18px_44px_rgba(45,35,17,.1)]"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eef4e6] text-[#1f7a45] ring-1 ring-[#173c25]/8">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black leading-tight text-[#102116]">{category.title}</span>
                <span className="mt-1 block text-xs leading-5 text-[#5b6659]">{category.text}</span>
              </span>
              <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-[#b77800] transition group-hover:translate-x-1" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
