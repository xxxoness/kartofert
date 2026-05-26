"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";
import { loginAdmin, type AdminLoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shop/logo";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="w-full max-w-md rounded-[24px] border border-[#173c25]/10 bg-white p-7 shadow-[0_22px_70px_rgba(45,35,17,.1)]">
      <Logo />
      <div className="mt-8 grid h-14 w-14 place-items-center rounded-[16px] bg-[#fff1be] text-[#8c5b00]">
        <LockKeyhole className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-3xl font-black tracking-[-0.05em] text-[#102116]">Вход в админку</h1>
      <p className="mt-2 text-sm leading-6 text-[#596553]">Введите данные администратора для доступа к панели управления KartoFert.</p>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-black text-[#243427]">
          Электронная почта
          <input name="email" type="email" autoComplete="email" required className="h-12 rounded-[12px] border border-[#173c25]/10 px-4 outline-none focus:border-[#f5b400]" />
        </label>
        <label className="grid gap-2 text-sm font-black text-[#243427]">
          Пароль
          <input name="password" type="password" autoComplete="current-password" required className="h-12 rounded-[12px] border border-[#173c25]/10 px-4 outline-none focus:border-[#f5b400]" />
        </label>
      </div>

      {state.error ? <p className="mt-4 rounded-[12px] bg-[#fff1e8] px-4 py-3 text-sm font-bold text-[#8c3d22]">{state.error}</p> : null}

      <Button disabled={pending} className="mt-6 h-12 w-full rounded-[12px] bg-[#063b23] text-white hover:bg-[#0d5a36] disabled:opacity-70">
        {pending ? "Проверяем..." : "Войти"}
      </Button>
    </form>
  );
}
