import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-[rgba(129,140,248,0.12)] text-accent-purple border border-[rgba(129,140,248,0.25)] hover:shadow-[0_0_12px_rgba(129,140,248,0.2)]",
        secondary:
          "bg-white/5 text-text-secondary border border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)]",
        destructive:
          "bg-[rgba(248,113,113,0.12)] text-accent-red border border-[rgba(248,113,113,0.25)] hover:shadow-[0_0_12px_rgba(248,113,113,0.2)]",
        success:
          "bg-[rgba(52,211,153,0.12)] text-accent-green border border-[rgba(52,211,153,0.25)] hover:shadow-[0_0_12px_rgba(52,211,153,0.2)]",
        warning:
          "bg-[rgba(251,191,36,0.12)] text-accent-amber border border-[rgba(251,191,36,0.25)] hover:shadow-[0_0_12px_rgba(251,191,36,0.2)]",
        nebula:
          "bg-[rgba(168,85,247,0.12)] text-accent-purple border border-[rgba(168,85,247,0.25)] hover:shadow-[0_0_12px_rgba(168,85,247,0.2)]",
        aurora:
          "bg-[rgba(34,211,238,0.12)] text-accent-cyan border border-[rgba(34,211,238,0.25)] hover:shadow-[0_0_12px_rgba(34,211,238,0.2)]",
        orbit:
          "bg-white/5 text-text-secondary border border-white/10 font-mono text-[10px]",
        agency:
          "bg-white/5 text-text-primary border border-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
