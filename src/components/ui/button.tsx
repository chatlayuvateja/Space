import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 gap-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-cosmic-500 to-nebula-500 text-white shadow-lg shadow-cosmic-500/25 hover:shadow-xl hover:shadow-cosmic-500/30 hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "glass-strong text-space-100 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]",
        ghost:
          "text-space-300 hover:text-space-100 hover:bg-white/5",
        outline:
          "border border-white/10 text-space-200 hover:bg-white/5 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]",
        link:
          "text-cosmic-400 underline-offset-4 hover:underline",
        glow:
          "bg-white/5 backdrop-blur-xl border border-white/10 text-space-100 shadow-lg hover:bg-white/10 hover:border-cosmic-400/50 hover:shadow-cosmic-500/20 hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-full px-4 text-xs",
        lg: "h-12 rounded-full px-8 text-base",
        xl: "h-14 rounded-full px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
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
