"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CountdownData } from "@/hooks/useCountdown";

interface LaunchCountdownProps {
  data: CountdownData;
  compact?: boolean;
  status?: string;
  className?: string;
}

function FlipDigit({ digit, label, color }: { digit: number; label: string; color: string }) {
  const display = String(digit).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl border font-mono font-bold tabular-nums",
          "bg-white/5 border-white/10",
          "w-[68px] h-[72px] text-3xl",
          "md:w-[80px] md:h-[84px] md:text-4xl"
        )}
        style={{ borderColor: `${color}20`, boxShadow: `0 0 20px ${color}10` }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ color }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] text-text-muted uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

export default function LaunchCountdown({
  data,
  compact = false,
  status,
  className,
}: LaunchCountdownProps) {
  const color = useMemo(() => {
    if (data.isCritical) return "#f87171";
    if (data.isUrgent) return "#fb923c";
    return "#818cf8";
  }, [data.isCritical, data.isUrgent]);

  // Show TBD placeholder for uncertain statuses
  if (status === "TBD" || status === "Hold") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-text-secondary text-sm font-mono",
          className
        )}
      >
        <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
        NET {status === "Hold" ? "ON HOLD" : "TBD"}
      </div>
    );
  }

  if (data.isPast) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-text-muted text-sm font-mono",
          className
        )}
      >
        <span className="w-2 h-2 rounded-full bg-text-muted" />
        LIFTOFF
      </div>
    );
  }

  if (compact) {
    // Compact version: single line e.g. "12d 08h 32m 15s"
    const parts: string[] = [];
    if (data.days > 0) parts.push(`${data.days}d`);
    if (data.hours > 0 || data.days > 0) parts.push(`${data.hours}h`);
    parts.push(`${data.minutes}m`);
    parts.push(`${data.seconds}s`);

    return (
      <span
        className={cn(
          "text-xs font-mono tabular-nums",
          data.isCritical ? "text-red-400" : data.isUrgent ? "text-accent-amber" : "text-accent-cyan",
          data.isCritical && "animate-pulse",
          className
        )}
      >
        T-{parts.join(" ")}
      </span>
    );
  }

  // Full flip-digit version
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 md:gap-3",
        "max-sm:gap-1.5 max-sm:flex-wrap max-sm:max-w-[220px] max-sm:mx-auto",
        data.isCritical && "animate-pulse",
        className
      )}
      style={
        data.isCritical
          ? {
              filter: `drop-shadow(0 0 12px ${color}60)`,
            }
          : undefined
      }
    >
      <div className="flex items-center gap-2 md:gap-3">
        {data.days > 0 && (
          <FlipDigit digit={data.days} label="DAYS" color={color} />
        )}
        <FlipDigit digit={data.hours} label="HRS" color={color} />
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <FlipDigit digit={data.minutes} label="MIN" color={color} />
        <FlipDigit digit={data.seconds} label="SEC" color={color} />
      </div>
    </div>
  );
}
