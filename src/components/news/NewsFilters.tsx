"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NewsSource } from "@/types/news";

const SOURCES: { value: NewsSource; label: string }[] = [
  { value: "all", label: "All" },
  { value: "NASA", label: "NASA" },
  { value: "SpaceX", label: "SpaceX" },
  { value: "ESA", label: "ESA" },
  { value: "ISRO", label: "ISRO" },
  { value: "Rocket Lab", label: "Rocket Lab" },
];

interface NewsFiltersProps {
  active: NewsSource;
  onChange: (source: NewsSource) => void;
  className?: string;
}

export default function NewsFilters({
  active,
  onChange,
  className,
}: NewsFiltersProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        className
      )}
    >
      {SOURCES.map((source) => {
        const isActive = active === source.value;
        return (
          <button
            key={source.value}
            onClick={() => onChange(source.value)}
            className={cn(
              "relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
              isActive
                ? "text-accent-cyan"
                : "text-text-secondary hover:text-text-primary bg-white/5 border border-white/10 hover:bg-white/10"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="news-filter-active"
                className="absolute inset-0 bg-accent-cyan/15 rounded-lg border border-accent-cyan/30"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{source.label}</span>
          </button>
        );
      })}
    </div>
  );
}
