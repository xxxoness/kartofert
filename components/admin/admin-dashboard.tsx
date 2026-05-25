"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, FileText, Package, Users, Wallet } from "lucide-react";
import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { demoLeads } from "@/data/admin-demo";
import { Lead, readLeads, saveLeads } from "@/components/shop/leads-store";

export function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const saved = readLeads();
    if (!saved.length) {
      saveLeads(demoLeads);
      setLeads(demoLeads);
    } else {
      setLeads(saved);
    }
  }, []);

  const total = leads.reduce((sum, lead) => sum + Number((lead.total ?? "").replace(/[^\d]/g, "")), 0);
  const cards = [
    { label: "Новые заявки", value: leads.filter((lead) => lead.status === "новая").length, icon: Users },
    { label: "Расчёты", value: leads.filter((lead) => lead.source === "калькулятор").length, icon: Calculator },
    { label: "Товаров", value: products.length, icon: Package },
    { label: "Статей", value: articles.length, icon: FileText },
    { label: "Сумма заявок", value: `${total || 160} ₽`, icon: Wallet }
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[16px] border border-[#173c25]/10 bg-white p-5 shadow-[0_12px_32px_rgba(45,35,17,.05)]">
              <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-[#fff1be] text-[#8c5b00]">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm font-bold text-[#596553]">{card.label}</p>
              <p className="mt-1 text-3xl font-black tracking-[-0.05em] text-[#102116]">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[16px] border border-[#173c25]/10 bg-white p-5 shadow-[0_12px_32px_rgba(45,35,17,.05)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Последние заявки</h2>
            <Link href="/admin/leads" className="text-sm font-black text-[#063b23]">Все заявки</Link>
          </div>
          <div className="grid gap-3">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="grid gap-2 rounded-[12px] border border-[#173c25]/10 bg-[#fffdf7] p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-black text-[#102116]">{lead.productName ?? lead.source}</p>
                  <p className="text-sm font-semibold text-[#596553]">{lead.phone} · {lead.amount ?? "объём уточняется"}</p>
                </div>
                <span className="rounded-full bg-[#fff1be] px-3 py-1 text-xs font-black text-[#8c5b00]">{lead.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[16px] border border-[#173c25]/10 bg-[#063b23] p-5 text-white shadow-[0_12px_32px_rgba(45,35,17,.05)]">
          <h2 className="text-2xl font-black tracking-[-0.04em]">Быстрые действия</h2>
          <div className="mt-5 grid gap-3">
            {[
              { href: "/admin/products", label: "Изменить цены товаров" },
              { href: "/admin/articles/new", label: "Создать статью" },
              { href: "/admin/leads", label: "Разобрать заявки" },
              { href: "/products", label: "Открыть витрину" }
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-[12px] bg-white/10 px-4 py-3 text-sm font-black transition hover:bg-white/16">
                {item.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
