"use client";

import { motion } from "framer-motion";

interface ISSLiveIndicatorProps {
  timeSinceUpdate: number;
}

export default function ISSLiveIndicator({ timeSinceUpdate }: ISSLiveIndicatorProps) {
  const formatTimeAgo = (seconds: number): string => {
    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s ago`;
  };

  return (
    <div className="flex items-center gap-3">
      {/* LIVE badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
        background: "rgba(74, 222, 128, 0.1)",
        border: "1px solid rgba(74, 222, 128, 0.2)",
      }}>
        <span className="relative flex h-2 w-2">
          <motion.span
            className="absolute inset-0 rounded-full bg-green-400"
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-green-400">
          ● LIVE
        </span>
      </div>

      {/* Last updated */}
      <motion.span
        key={timeSinceUpdate}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className="text-[11px] font-mono"
        style={{ color: "rgba(255,255,255,0.35)" }}
        aria-live="polite"
      >
        Updated {formatTimeAgo(timeSinceUpdate)}
      </motion.span>
    </div>
  );
}
