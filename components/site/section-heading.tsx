import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, text, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <Badge className="mb-4">{eyebrow}</Badge> : null}
      <h2 className="text-balance text-3xl font-semibold tracking-normal text-white md:text-5xl">{title}</h2>
      {text ? <p className="mt-5 text-base leading-8 text-stone-300 md:text-lg">{text}</p> : null}
    </div>
  );
}
