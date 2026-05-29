"use client";

import { cn } from "@/lib/utils";

interface LaunchCardSkeletonProps {
  featured?: boolean;
  className?: string;
}

export default function LaunchCardSkeleton({
  featured = false,
  className,
}: LaunchCardSkeletonProps) {
  if (featured) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "bg-surface-1/60 border border-white/5",
          "h-[400px] md:h-[500px]",
          className
        )}
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
        </div>

        <div className="relative h-full flex flex-col justify-end p-8">
          {/* Badge */}
          <div className="w-20 h-5 rounded-full bg-white/10 mb-4" />
          {/* Title */}
          <div className="w-3/4 h-8 rounded-lg bg-white/10 mb-3" />
          <div className="w-1/2 h-8 rounded-lg bg-white/10 mb-6" />
          {/* Info row */}
          <div className="flex gap-4">
            <div className="w-24 h-4 rounded bg-white/10" />
            <div className="w-20 h-4 rounded bg-white/10" />
            <div className="w-28 h-4 rounded bg-white/10" />
          </div>
          {/* Countdown */}
          <div className="flex gap-3 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-20 rounded-xl bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "glass-card p-0",
        className
      )}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
      </div>

      {/* Image placeholder */}
      <div className="aspect-video bg-white/5" />

      {/* Content */}
      <div className="p-4 space-y-3 relative">
        {/* Agency */}
        <div className="w-16 h-3 rounded bg-white/10" />
        {/* Mission name */}
        <div className="w-full h-4 rounded bg-white/10" />
        <div className="w-3/4 h-4 rounded bg-white/10" />
        {/* Rocket */}
        <div className="w-24 h-3 rounded bg-white/10" />
        {/* Bottom row */}
        <div className="flex items-center justify-between pt-2">
          <div className="w-20 h-4 rounded bg-white/10" />
          <div className="w-16 h-5 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
