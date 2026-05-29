import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 gap-2 group select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-accent-cyan to-accent-purple text-[#080b14] font-semibold rounded-xl px-5 py-2.5 hover:scale-[1.02] hover:brightness-105 active:scale-[0.98] shadow-lg shadow-accent-cyan/20",
        secondary:
          "border border-[rgba(255,255,255,0.1)] text-text-primary rounded-xl px-5 py-2.5 hover:bg-white/5 hover:border-[rgba(255,255,255,0.15)] active:scale-[0.98]",
        ghost:
          "text-text-secondary rounded-xl px-3 py-2 hover:text-text-primary hover:bg-white/5 active:scale-[0.98]",
        outline:
          "border border-[rgba(255,255,255,0.08)] text-text-primary rounded-xl px-5 py-2.5 hover:bg-white/5 hover:border-[rgba(255,255,255,0.15)] active:scale-[0.98]",
        link:
          "text-accent-cyan underline-offset-4 hover:underline px-1 py-1",
        glow:
          "bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] text-text-primary rounded-xl px-5 py-2.5 hover:bg-[rgba(255,255,255,0.08)] hover:border-accent-cyan/30 hover:shadow-lg hover:shadow-accent-cyan/10 active:scale-[0.98]",
        purple:
          "bg-gradient-to-r from-accent-purple to-accent-purple/80 text-white font-semibold rounded-xl px-5 py-2.5 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] shadow-lg shadow-accent-purple/20",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-4 text-xs rounded-lg",
        lg: "h-12 px-6 text-base rounded-xl",
        xl: "h-14 px-8 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-xl border border-[rgba(255,255,255,0.08)] hover:bg-white/5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
