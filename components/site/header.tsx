"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import { navItems } from "@/data/categories";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shop/logo";
import { useCart } from "@/components/shop/cart-provider";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [query, setQuery] = useState("");

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#173c25]/10 bg-[#fffdf7]/94 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo className="mr-1 shrink-0" />

        <nav className="hidden items-center gap-1.5 whitespace-nowrap lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-bold text-[#0f2418] transition hover:bg-[#f0eadc] hover:text-[#063b23]",
                  active && "bg-[#f4e9c8] text-[#063b23]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden min-w-[280px] max-w-[420px] flex-1 items-center xl:flex">
          <label className="relative w-full">
            <span className="sr-only">Поиск</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск удобрения или элемента"
              className="h-10 w-full rounded-[12px] border border-[#173c25]/12 bg-white px-4 pr-11 text-sm font-medium text-[#102116] shadow-[0_8px_24px_rgba(34,29,16,.04)] outline-none transition placeholder:text-[#87917d] focus:border-[#f5b400] focus:ring-4 focus:ring-[#f5b400]/20"
            />
            <button aria-label="Найти" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-[10px] text-[#071a10] transition hover:bg-[#f5b400]">
              <Search className="h-5 w-5" />
            </button>
          </label>
        </form>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" className="h-10 px-3 text-[#0f2418] hover:bg-[#f0eadc] hover:text-[#063b23]">
            <Link href="/admin/login">
              <UserRound className="h-5 w-5" />
              Войти
            </Link>
          </Button>
          <Link href="/cart" className="relative grid h-10 w-10 place-items-center rounded-[12px] text-[#071a10] transition hover:bg-[#f0eadc]" aria-label="Корзина">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-[#f5b400] px-1 text-xs font-black text-[#1a1400]">
              {count || 0}
            </span>
          </Link>
        </div>

        <div className="ml-auto flex shrink-0 items-center lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="dark" size="icon" className="bg-[#063b23] text-white hover:bg-[#0d5a36]" aria-label="Открыть меню">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="border-[#173c25]/10 bg-[#fffdf7] text-[#0f2418]">
              <Logo />
              <form onSubmit={submitSearch} className="mt-8">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Поиск удобрения"
                  className="h-12 w-full rounded-[12px] border border-[#173c25]/12 bg-white px-4 text-sm font-medium outline-none focus:border-[#f5b400] focus:ring-4 focus:ring-[#f5b400]/20"
                />
              </form>
              <nav className="mt-7 grid gap-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-[14px] px-4 py-3 text-base font-bold text-[#0f2418] transition hover:bg-[#f0eadc]",
                        pathname === item.href && "bg-[#063b23] text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link href="/cart" className="rounded-[14px] bg-[#f5b400] px-4 py-3 text-base font-black text-[#1a1400]">
                    Корзина {count ? `(${count})` : ""}
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
