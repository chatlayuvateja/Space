"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LaunchTab, LaunchFilter, SortMode } from "@/types/launches";

interface LaunchFiltersProps {
  tab: LaunchTab;
  filter: LaunchFilter;
  sort: SortMode;
  onTabChange: (tab: LaunchTab) => void;
  onFilterChange: (filter: LaunchFilter) => void;
  onSortChange: (sort: SortMode) => void;
  className?: string;
}

const TABS: { value: LaunchTab; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "previous", label: "Previous" },
];

const FILTERS: { value: LaunchFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "crewed", label: "Crewed" },
  { value: "cargo", label: "Cargo" },
  { value: "commercial", label: "Commercial" },
  { value: "government", label: "Government" },
];

const SORTS: { value: SortMode; label: string }[] = [
  { value: "date", label: "By Date" },
  { value: "agency", label: "By Agency" },
];

export default function LaunchFilters({
  tab,
  filter,
  sort,
  onTabChange,
  onFilterChange,
  onSortChange,
  className,
}: LaunchFiltersProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Tab switcher */}
      <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 w-fit mx-auto">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => onTabChange(t.value)}
            className={cn(
              "relative px-5 py-2 text-sm font-medium rounded-lg transition-colors",
              tab === t.value
                ? "text-text-primary"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            {tab === t.value && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-accent-purple/20 rounded-lg border border-accent-purple/30"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Filter chips + sort */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Filter chips */}
        <div className="flex items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200",
                filter === f.value
                  ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
                  : "bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10 hover:text-text-secondary"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort divider */}
        <span className="w-px h-5 bg-white/10 hidden sm:block" />

        {/* Sort buttons */}
        <div className="flex items-center gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => onSortChange(s.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200",
                sort === s.value
                  ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
                  : "bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10 hover:text-text-secondary"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
