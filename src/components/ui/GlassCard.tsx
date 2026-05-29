"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type GlassCardVariant = "default" | "elevated" | "bordered" | "highlight";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassCardVariant;
}

const variantStyles: Record<GlassCardVariant, string> = {
  default:
    "bg-[rgba(13,17,23,0.8)] border border-[rgba(255,255,255,0.06)] backdrop-blur-[12px] rounded-2xl",
  elevated:
    "bg-[rgba(13,17,23,0.8)] border border-[rgba(255,255,255,0.06)] backdrop-blur-[12px] rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_rgba(0,0,0,0.5)]",
  bordered:
    "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.12)] backdrop-blur-[12px] rounded-2xl",
  highlight:
    "bg-[rgba(13,17,23,0.8)] border border-[rgba(34,211,238,0.3)] backdrop-blur-[12px] rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.05)]",
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          "transition-all duration-200 hover:translate-y-[-2px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

const GlassCardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 md:p-6 pb-0", className)}
    {...props}
  />
));
GlassCardHeader.displayName = "GlassCardHeader";

const GlassCardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg md:text-xl font-semibold font-display text-text-primary leading-tight tracking-tight",
      className
    )}
    {...props}
  />
));
GlassCardTitle.displayName = "GlassCardTitle";

const GlassCardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-text-secondary leading-relaxed", className)}
    {...props}
  />
));
GlassCardDescription.displayName = "GlassCardDescription";

const GlassCardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 md:p-6", className)} {...props} />
));
GlassCardContent.displayName = "GlassCardContent";

const GlassCardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-5 md:p-6 pt-0",
      className
    )}
    {...props}
  />
));
GlassCardFooter.displayName = "GlassCardFooter";

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
};
