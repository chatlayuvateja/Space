"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card" | "image";
}

export default function Skeleton({
  className,
  variant = "text",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden isolate",
        "bg-[rgba(255,255,255,0.04)]",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 rounded-md",
        variant === "card" && "rounded-2xl",
        variant === "image" && "aspect-video rounded-xl",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.06)] before:to-transparent",
        "before:animate-[shimmer_2s_linear_infinite]",
        className
      )}
      {...props}
    />
  );
}
