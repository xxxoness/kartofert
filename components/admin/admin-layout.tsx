import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  TerminalSquare
} from "lucide-react";
import { logoutAdmin } from "@/app/admin/login/actions";
import { Logo } from "@/components/shop/logo";
import { getDatabaseStatus } from "@/lib/db";
import { cn } from "@/lib/utils";

type AdminSection = "dashboard" | "products" | "orders" | "articles" | "analytics" | "settings" | "logs";

const links: Array<{ href: string; label: string; section: AdminSection; icon: typeof LayoutDashboard }> = [
  { href: "/admin", label: "Dashboard", section: "dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Товары", section: "products", icon: Package },
  { href: "/admin/orders", label: "Заказы", section: "orders", icon: ClipboardList },
  { href: "/admin/articles", label: "Статьи", section: "articles", icon: FileText },
  { href: "/admin/analytics", label: "Аналитика", section: "analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Настройки", section: "settings", icon: Settings },
  { href: "/admin/logs", label: "Логи", section: "logs", icon: TerminalSquare }
];

export function AdminLayout({
  children,
  active,
  title,
  description,
  adminEmail
}: {
  children: React.ReactNode;
  active: AdminSection;
  title: string;
  description?: string;
  adminEmail: string;
}) {
  const databaseStatus = getDatabaseStatus();

  return (
    <section className="min-h-screen bg-[#f6f1e7] px-4 py-5 text-[#102116] md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-[1500px] overflow-hidden rounded-[28px] border border-[#173c25]/10 bg-white shadow-[0_28px_80px_rgba(45,35,17,.12)] lg:grid-cols-[290px_1fr]">
        <aside className="border-b border-[#173c25]/10 bg-[#073821] p-5 text-white lg:border-b-0 lg:border-r">
          <div className="rounded-[20px] bg-white p-4">
            <Logo />
          </div>

          <nav className="mt-6 grid gap-2">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = item.section === active;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-black text-white/72 transition hover:bg-white/10 hover:text-white",
                    isActive && "bg-[#f5b400] text-[#102116] shadow-[0_14px_30px_rgba(245,180,0,.24)] hover:bg-[#f5b400] hover:text-[#102116]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 grid gap-2 border-t border-white/12 pt-5">
            <Link href="/" className="flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-black text-white/72 transition hover:bg-white/10 hover:text-white">
              <Home className="h-5 w-5" />
              На сайт
            </Link>
            <form action={logoutAdmin}>
              <button className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-black text-white/72 transition hover:bg-white/10 hover:text-white">
                <LogOut className="h-5 w-5" />
                Выйти
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 bg-[#fffdf8]">
          <header className="flex flex-col gap-4 border-b border-[#173c25]/10 bg-white px-5 py-5 md:px-7 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#8c5b00]">
                <ShieldCheck className="h-4 w-4" />
                Админка KartoFert
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#102116] md:text-4xl">{title}</h1>
              {description ? <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#596553]">{description}</p> : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block min-w-0 sm:w-[280px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8777]" />
                <input className="h-11 w-full rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] pl-11 pr-4 text-sm font-semibold outline-none focus:border-[#f5b400]" placeholder="Поиск по админке" />
              </label>
              <Link href="/" className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#173c25]/12 bg-white px-4 text-sm font-black text-[#063b23] transition hover:border-[#f5b400]">
                Открыть сайт
              </Link>
              <div className="flex h-11 items-center gap-2 rounded-[14px] bg-[#eef7e8] px-4 text-sm font-black text-[#063b23]">
                <SlidersHorizontal className="h-4 w-4" />
                {adminEmail}
              </div>
            </div>
          </header>

          <div className="p-5 md:p-7">
            {!databaseStatus.connected ? (
              <div className="mb-5 rounded-[18px] border border-[#f5b400]/35 bg-[#fff7d7] px-5 py-4 text-sm font-bold leading-6 text-[#6d4b00]">
                {databaseStatus.message}
              </div>
            ) : null}
            {children}
          </div>
        </main>
      </div>
    </section>
  );
}
