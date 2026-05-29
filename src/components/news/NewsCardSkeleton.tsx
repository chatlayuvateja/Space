"use client";

import Skeleton from "@/components/ui/Skeleton";

export default function NewsCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[rgba(13,17,23,0.8)] border border-[rgba(255,255,255,0.06)]">
      <Skeleton variant="image" className="rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="w-16 h-3" />
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-full h-3" />
        <Skeleton variant="text" className="w-3/4 h-3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="text" className="w-20 h-3" />
          <Skeleton variant="text" className="w-24 h-3" />
        </div>
      </div>
    </div>
  );
}
