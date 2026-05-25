"use client";

import { useEffect, useMemo, useState } from "react";
import { demoLeads } from "@/data/admin-demo";
import { Lead, LeadStatus, readLeads, saveLeads } from "@/components/shop/leads-store";

export function AdminLeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const saved = readLeads();
    if (!saved.length) {
      saveLeads(demoLeads);
      setLeads(demoLeads);
    } else {
      setLeads(saved);
    }
  }, []);

  const filtered = useMemo(() => {
    const search = query.toLowerCase();
    return leads.filter((lead) => {
      const matchesStatus = status === "all" || lead.status === status;
      const matchesSearch = !search || [lead.id, lead.name, lead.phone, lead.productName, lead.city, lead.comment].join(" ").toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [leads, query, status]);

  const updateStatus = (id: string, nextStatus: LeadStatus) => {
    const next = leads.map((lead) => (lead.id === id ? { ...lead, status: nextStatus } : lead));
    setLeads(next);
    saveLeads(next);
  };

  return (
    <div className="rounded-[16px] border border-[#173c25]/10 bg-white shadow-[0_12px_32px_rgba(45,35,17,.05)]">
      <div className="grid gap-3 border-b border-[#173c25]/10 p-5 md:grid-cols-[1fr_220px]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по заявкам" className="h-11 rounded-[10px] border border-[#173c25]/10 px-4 font-semibold outline-none focus:border-[#f5b400]" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-[10px] border border-[#173c25]/10 px-4 font-bold outline-none focus:border-[#f5b400]">
          <option value="all">Все статусы</option>
          <option value="новая">Новая</option>
          <option value="в работе">В работе</option>
          <option value="закрыта">Закрыта</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[920px] w-full text-sm">
          <thead className="bg-[#fbf7ec] text-left text-xs font-black uppercase tracking-[0.08em] text-[#6e5b22]">
            <tr>
              <th className="px-4 py-3">Номер</th>
              <th className="px-4 py-3">Источник</th>
              <th className="px-4 py-3">Клиент</th>
              <th className="px-4 py-3">Товар</th>
              <th className="px-4 py-3">Объём</th>
              <th className="px-4 py-3">Сумма</th>
              <th className="px-4 py-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-t border-[#173c25]/10">
                <td className="px-4 py-3 font-black text-[#102116]">{lead.id}</td>
                <td className="px-4 py-3">{lead.source}</td>
                <td className="px-4 py-3">
                  <p className="font-bold text-[#102116]">{lead.name}</p>
                  <p className="text-xs font-semibold text-[#596553]">{lead.phone}</p>
                </td>
                <td className="px-4 py-3">{lead.productName ?? "не указан"}</td>
                <td className="px-4 py-3">{lead.amount ?? "уточняется"}</td>
                <td className="px-4 py-3 font-black">{lead.total ?? "уточняется"}</td>
                <td className="px-4 py-3">
                  <select value={lead.status} onChange={(event) => updateStatus(lead.id, event.target.value as LeadStatus)} className="h-10 rounded-[10px] border border-[#173c25]/10 px-3 font-bold outline-none focus:border-[#f5b400]">
                    <option value="новая">Новая</option>
                    <option value="в работе">В работе</option>
                    <option value="закрыта">Закрыта</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
