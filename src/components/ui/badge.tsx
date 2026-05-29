import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-cosmic-500/20 text-cosmic-300 border border-cosmic-500/30",
        secondary:
          "bg-white/5 text-space-300 border border-white/10",
        destructive:
          "bg-red-500/20 text-red-300 border border-red-500/30",
        success:
          "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
        warning:
          "bg-stellar-500/20 text-stellar-300 border border-stellar-500/30",
        nebula:
          "bg-nebula-500/20 text-nebula-300 border border-nebula-500/30",
        aurora:
          "bg-aurora-500/20 text-aurora-300 border border-aurora-500/30",
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
