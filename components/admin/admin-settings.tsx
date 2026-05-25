"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

const settingsKey = "kartofert-settings";

export function AdminSettings() {
  const [settings, setSettings] = useState(siteConfig);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(settingsKey);
    if (raw) setSettings(JSON.parse(raw));
  }, []);

  const update = (key: keyof typeof siteConfig, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const save = () => {
    window.localStorage.setItem(settingsKey, JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  };

  return (
    <div className="grid gap-5 rounded-[16px] border border-[#173c25]/10 bg-white p-5 shadow-[0_12px_32px_rgba(45,35,17,.05)]">
      <div>
        <h2 className="text-2xl font-black tracking-[-0.04em] text-[#102116]">Настройки магазина</h2>
        <p className="mt-2 text-sm font-semibold text-[#596553]">Данные сохраняются локально. Для продакшена их можно подключить к базе или CMS.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(settings).map(([key, value]) => (
          <label key={key} className={key.includes("Description") || key.includes("disclaimer") ? "grid gap-2 text-sm font-black text-[#243427] md:col-span-2" : "grid gap-2 text-sm font-black text-[#243427]"}>
            {label(key)}
            {key.includes("Description") || key.includes("disclaimer") ? (
              <textarea value={value} onChange={(event) => update(key as keyof typeof siteConfig, event.target.value)} className="min-h-28 rounded-[12px] border border-[#173c25]/10 px-4 py-3 font-semibold outline-none focus:border-[#f5b400]" />
            ) : (
              <input value={value} onChange={(event) => update(key as keyof typeof siteConfig, event.target.value)} className="h-12 rounded-[12px] border border-[#173c25]/10 px-4 font-semibold outline-none focus:border-[#f5b400]" />
            )}
          </label>
        ))}
      </div>
      <Button onClick={save} className="h-12 w-fit rounded-[10px] bg-[#063b23] px-8 text-white hover:bg-[#0d5a36]">
        {saved ? "Сохранено" : "Сохранить настройки"}
      </Button>
    </div>
  );
}

function label(key: string) {
  const labels: Record<string, string> = {
    brandName: "Название бренда",
    phone: "Телефон",
    email: "Электронная почта",
    telegram: "Telegram",
    address: "Адрес",
    siteDescription: "Описание сайта",
    disclaimerText: "Текст предупреждения"
  };
  return labels[key] ?? key;
}
