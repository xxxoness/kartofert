"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, FileText, LayoutDashboard, LogOut, Package, Settings, Users } from "lucide-react";
import { Logo } from "@/components/shop/logo";
import { cn } from "@/lib/utils";

export const adminAuthKey = "kartofert-admin-auth";

const links = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Заявки", icon: Users },
  { href: "/admin/products", label: "Товары", icon: Package },
  { href: "/admin/articles", label: "Статьи", icon: FileText },
  { href: "/admin/settings", label: "Настройки", icon: Settings }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const authed = window.localStorage.getItem(adminAuthKey) === "true";
    if (!authed) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="container-shell py-12 text-[#102116]">Проверяем доступ...</div>;
  }

  return (
    <section className="container-shell py-6">
      <div className="grid min-h-[760px] overflow-hidden rounded-[22px] border border-[#173c25]/10 bg-white shadow-[0_22px_70px_rgba(45,35,17,.09)] lg:grid-cols-[270px_1fr]">
        <aside className="border-b border-[#173c25]/10 bg-[#fbf7ec] p-5 lg:border-b-0 lg:border-r">
          <Logo />
          <nav className="mt-8 grid gap-2">
            {links.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[12px] px-4 py-3 text-sm font-black text-[#4f5e4f] transition hover:bg-white hover:text-[#063b23]",
                    active && "bg-[#063b23] text-white hover:bg-[#063b23] hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => {
              window.localStorage.removeItem(adminAuthKey);
              router.replace("/admin/login");
            }}
            className="mt-8 flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-sm font-black text-[#8c3d22] transition hover:bg-[#fff1e8]"
          >
            <LogOut className="h-5 w-5" />
            Выйти
          </button>
        </aside>
        <main className="min-w-0 bg-[#fffdf7] p-5 md:p-7">
          <div className="mb-7 flex flex-col gap-3 border-b border-[#173c25]/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#8c5b00]">Админка KartoFert</p>
              <h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-[#102116]">Панель управления</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#4f5e4f] shadow-sm">
              <BarChart3 className="h-4 w-4 text-[#1f7a45]" />
              Рабочий режим
            </div>
          </div>
          {children}
        </main>
      </div>
    </section>
  );
}
