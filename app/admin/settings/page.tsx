import { Save } from "lucide-react";
import { updateSettingsAction } from "@/app/admin/actions";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getSiteSettings } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <AdminLayout active="settings" title="Настройки" description="Основные параметры сайта. Сохранение будет подключено к серверному хранилищу." adminEmail={admin.email}>
      <form action={updateSettingsAction} className="rounded-[22px] border border-[#173c25]/10 bg-white p-6 shadow-[0_16px_42px_rgba(45,35,17,.06)]">
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="Телефон" defaultValue={settings.phone} />
          <Field label="Email" defaultValue={settings.email} type="email" />
          <Field label="Город / доставка" name="city" defaultValue={settings.city} />
          <Field label="Валюта" name="currency" defaultValue={settings.currency} />
          <Field label="Текст footer" name="footerText" defaultValue={settings.footerText} />
          <Field label="Основной CTA" name="mainCtaText" defaultValue={settings.mainCtaText} />
          <Field label="Текст доставки" name="deliveryText" defaultValue={settings.deliveryText} />
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Toggle title="Онлайн-оплата" name="enableOnlinePayment" enabled={settings.enableOnlinePayment} />
          <Toggle title="Отображение цен" name="showPrices" enabled={settings.showPrices} />
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-[18px] bg-[#fbf7ec] p-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-semibold leading-6 text-[#596553]">Поля подготовлены под реальное сохранение после подключения базы данных.</p>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#063b23] px-5 text-sm font-black text-white transition hover:bg-[#0d5a36]">
            <Save className="h-4 w-4" />
            Сохранить
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

function Field({ label, name, defaultValue, type = "text" }: { label: string; name?: string; defaultValue: string; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#243427]">
      {label}
      <input name={name ?? (label === "Телефон" ? "phone" : label === "Email" ? "email" : undefined)} type={type} defaultValue={defaultValue} className="h-12 rounded-[14px] border border-[#173c25]/10 bg-[#fffdf8] px-4 font-semibold outline-none focus:border-[#f5b400]" />
    </label>
  );
}

function Toggle({ title, name, enabled }: { title: string; name: string; enabled: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[16px] border border-[#173c25]/10 bg-[#fffdf8] p-4">
      <span className="font-black text-[#102116]">{title}</span>
      <input name={name} type="checkbox" defaultChecked={enabled} className="h-4 w-4 accent-[#063b23]" />
      <span className={enabled ? "rounded-full bg-[#eef7e8] px-3 py-1 text-xs font-black text-[#1f7a45]" : "rounded-full bg-[#fff1e8] px-3 py-1 text-xs font-black text-[#8c3d22]"}>
        {enabled ? "Включено" : "Выключено"}
      </span>
    </label>
  );
}
