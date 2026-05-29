"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { APODData } from "@/types/apod";

interface APODThumbnailStripProps {
  items: APODData[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function APODThumbnailStrip({
  items,
  activeIndex,
  onSelect,
}: APODThumbnailStripProps) {
  if (items.length === 0) return null;

  return (
    <div className="relative">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <div
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Hide scrollbar */}
        <style>{`
          .apod-thumb-strip::-webkit-scrollbar { display: none; }
        `}</style>

        {items.map((item, i) => {
          const isActive = i === activeIndex;
          const isVideo = item.media_type === "video";
          const thumbUrl = item.url;

          return (
            <motion.button
              key={item.date}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => onSelect(i)}
              className={cn(
                "relative shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden transition-all duration-200 snap-start",
                "border-2",
                isActive
                  ? "border-accent-cyan shadow-lg shadow-accent-cyan/20"
                  : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)]"
              )}
            >
              {isVideo ? (
                <div className="w-full h-full flex items-center justify-center bg-surface-2">
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center mx-auto mb-1">
                      <svg
                        className="w-3.5 h-3.5 text-accent-cyan"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-[9px] text-text-muted font-mono block">
                      Video
                    </span>
                  </div>
                </div>
              ) : (
                <img
                  src={thumbUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}

              {/* Hover overlay with date */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                <span className="text-[10px] text-white/90 font-mono">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="apod-active-dot"
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-cyan shadow-lg shadow-accent-cyan/50"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
