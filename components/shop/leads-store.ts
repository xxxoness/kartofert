"use client";

export type LeadStatus = "новая" | "в работе" | "закрыта";
export type LeadSource = "форма" | "калькулятор" | "товар" | "заказ";

export type Lead = {
  id: string;
  createdAt: string;
  status: LeadStatus;
  source: LeadSource;
  name: string;
  phone: string;
  email?: string;
  productName?: string;
  city?: string;
  comment?: string;
  amount?: string;
  total?: string;
};

export const leadsStorageKey = "kartofert-leads";
const leadsEvent = "kartofert-leads-updated";

export function readLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(leadsStorageKey);
    return raw ? (JSON.parse(raw) as Lead[]) : [];
  } catch {
    return [];
  }
}

export function saveLeads(leads: Lead[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(leadsStorageKey, JSON.stringify(leads));
  window.dispatchEvent(new Event(leadsEvent));
}

export function addLead(lead: Omit<Lead, "id" | "createdAt" | "status"> & { status?: LeadStatus }) {
  const next: Lead = {
    id: `KF-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    status: lead.status ?? "новая",
    ...lead
  };
  saveLeads([next, ...readLeads()]);
  return next;
}

export function useLeadsStore() {
  return { readLeads, saveLeads, addLead };
}
