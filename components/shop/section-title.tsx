import { cn } from "@/lib/utils";

export function SectionTitle({ label, title, text, className }: { label?: string; title: string; text?: string; className?: string }) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {label ? <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#8a662a]">{label}</p> : null}
      <h2 className="text-balance text-3xl font-black tracking-[-0.045em] text-[#182019] md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-8 text-[#5e6858] md:text-lg">{text}</p> : null}
    </div>
  );
}
