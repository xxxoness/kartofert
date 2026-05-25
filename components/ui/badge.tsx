import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors", {
  variants: {
    variant: {
      default: "bg-emerald-300/15 text-emerald-100 ring-1 ring-emerald-200/20",
      secondary: "bg-stone-100 text-stone-900",
      outline: "border border-white/14 text-stone-200",
      amber: "bg-amber-300/15 text-amber-100 ring-1 ring-amber-200/20"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
