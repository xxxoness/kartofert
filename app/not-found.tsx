import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shop/logo";

export default function NotFound() {
  return (
    <section className="container-shell grid min-h-[640px] place-items-center py-16 text-center">
      <div className="max-w-xl rounded-[22px] border border-[#173c25]/10 bg-white p-8 shadow-[0_22px_70px_rgba(45,35,17,.09)]">
        <div className="flex justify-center"><Logo compact /></div>
        <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-[#8c5b00]">404</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#102116]">Страница не найдена</h1>
        <p className="mt-4 leading-7 text-[#596553]">Возможно, товар или раздел был перемещён. Вернитесь в каталог удобрений для картофеля.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="rounded-[10px] bg-[#063b23] text-white hover:bg-[#0d5a36]"><Link href="/products">Перейти в каталог</Link></Button>
          <Button asChild variant="outline" className="rounded-[10px] border-[#f5b400] bg-white text-[#8c5b00] hover:bg-[#fff4cf]"><Link href="/">На главную</Link></Button>
        </div>
      </div>
    </section>
  );
}
