"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LAUNCH_STATUS_COLORS } from "@/types/launches";

interface LaunchStatusBadgeProps {
  status: string;
  abbrev?: string;
  className?: string;
}

export default function LaunchStatusBadge({
  status,
  abbrev,
  className,
}: LaunchStatusBadgeProps) {
  const color = LAUNCH_STATUS_COLORS[status] ?? "#6b7280";
  const isInFlight = status === "In Flight";
  const isFailure = status === "Failure" || status === "Partial Failure";
  const label = abbrev || status;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        isInFlight && "animate-pulse",
        className
      )}
      style={{
        background: `${color}18`,
        color: color,
        border: `1px solid ${color}30`,
        boxShadow: isInFlight ? `0 0 12px ${color}40` : "none",
      }}
    >
      {isInFlight && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            style={{ background: color }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ background: color }}
          />
        </span>
      )}
      {isFailure && "⚠ "}
      {label}
    </motion.span>
  );
}
