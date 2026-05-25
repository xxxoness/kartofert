import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center", className)} aria-label="На главную">
      {compact ? (
        <Image src="/assets/brand/logo-mark.svg" alt="KartoFert" width={40} height={40} priority className="h-10 w-10" />
      ) : (
        <span className="flex min-w-0 flex-col justify-center leading-none">
          <span className="relative inline-flex w-fit items-start text-[31px] font-black tracking-[-0.065em] text-[#073b24]">
            KartoFert
            <span className="ml-1.5 mt-1 h-2.5 w-4 rotate-[-18deg] rounded-[90%_25%_80%_28%] bg-[#f4b400] shadow-[inset_0_-1px_0_rgba(7,59,36,.18)]" aria-hidden="true" />
          </span>
          <span className="-mt-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#315b3e]">
            удобрения для картофеля
          </span>
        </span>
      )}
    </Link>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return <Image src="/assets/brand/logo-mark.svg" alt="" width={44} height={44} className={cn("h-11 w-11", className)} />;
}
