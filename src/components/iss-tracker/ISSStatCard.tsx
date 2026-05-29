"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ISSStatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  delay?: number;
  ariaLabel?: string;
}

export default function ISSStatCard({
  icon: Icon,
  label,
  value,
  unit,
  color = "#22d3ee",
  delay = 0,
  ariaLabel,
}: ISSStatCardProps) {
  const previousValueRef = useRef<string | number>(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Extract decimal precision from a formatted string
  const getPrecision = (val: string | number): number => {
    if (typeof val === "number") return 2;
    const match = val.match(/\.(\d+)/);
    return match ? match[1].length : 0;
  };

  useEffect(() => {
    if (value === previousValueRef.current) return;

    const startValue = previousValueRef.current;
    const endValue = value;
    const startStr = String(startValue);
    const endStr = String(endValue);
    // Parse numeric values, stripping any non-numeric prefix/suffix (e.g. "#" for orbit count)
    const startNum = parseFloat(startStr.replace(/[^0-9.\-]/g, "")) || 0;
    const endNum = parseFloat(endStr.replace(/[^0-9.\-]/g, "")) || 0;
    const diff = endNum - startNum;
    const duration = 600;
    const startTime = performance.now();

    setIsAnimating(true);
    const precision = getPrecision(endValue);
    // Extract any prefix from the string (e.g. "#" for orbit count)
    const prefix = typeof endValue === "string" ? endStr.replace(/[0-9.,\-]/g, "") : "";

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = startNum + diff * eased;

      setDisplayValue(`${prefix}${current.toFixed(precision)}`);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(false);
        previousValueRef.current = endValue;
      }
    };

    // For very large numeric differences (like orbit count changing by ~15 each second),
    // still animate but keep it smooth
    if (Math.abs(diff) < 0.001) {
      setDisplayValue(endValue);
      previousValueRef.current = endValue;
      return;
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group relative rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      role="region"
      aria-label={ariaLabel || `${label}: ${value} ${unit || ""}`}
    >
      {/* Subtle hover glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, ${color}08, transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Icon
            className="w-3.5 h-3.5"
            style={{ color }}
          />
          <span
            className="text-[11px] font-medium uppercase tracking-[0.12em]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {label}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span
            className="text-2xl font-mono font-bold tabular-nums transition-colors duration-300"
            style={{ color: isAnimating ? color : "rgba(255,255,255,0.95)" }}
          >
            {displayValue}
          </span>
          {unit && (
            <span
              className="text-xs font-mono"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {unit}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
