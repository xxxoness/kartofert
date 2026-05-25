"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shop/logo";
import { adminAuthKey } from "@/components/admin/admin-layout";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (email === "admin@example.com" && password === "password") {
      window.localStorage.setItem(adminAuthKey, "true");
      router.push("/admin");
      return;
    }
    setError("Неверная почта или пароль");
  };

  return (
    <section className="container-shell grid min-h-[720px] place-items-center py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded-[22px] border border-[#173c25]/10 bg-white p-7 shadow-[0_22px_70px_rgba(45,35,17,.09)]">
        <Logo />
        <div className="mt-8 grid h-14 w-14 place-items-center rounded-[16px] bg-[#fff1be] text-[#8c5b00]">
          <LockKeyhole className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-[-0.05em] text-[#102116]">Вход в админку</h1>
        <p className="mt-2 text-sm leading-6 text-[#596553]">Вход для администратора: admin@example.com / password</p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-black text-[#243427]">
            Электронная почта
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-[12px] border border-[#173c25]/10 px-4 outline-none focus:border-[#f5b400]" />
          </label>
          <label className="grid gap-2 text-sm font-black text-[#243427]">
            Пароль
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="h-12 rounded-[12px] border border-[#173c25]/10 px-4 outline-none focus:border-[#f5b400]" />
          </label>
        </div>
        {error ? <p className="mt-4 rounded-[10px] bg-[#fff1e8] px-4 py-3 text-sm font-bold text-[#8c3d22]">{error}</p> : null}
        <Button className="mt-6 h-12 w-full rounded-[10px] bg-[#063b23] text-white hover:bg-[#0d5a36]">Войти</Button>
      </form>
    </section>
  );
}
