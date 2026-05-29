"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  highlightWord?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  highlightWord,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  // Split title around highlight word
  const renderTitle = () => {
    if (!highlightWord || !title.includes(highlightWord)) {
      return title;
    }
    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className="gradient-text">{highlightWord}</span>
        {parts.slice(1).join(highlightWord)}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        isCenter ? "text-center" : "text-left",
        "mb-12 md:mb-16",
        className
      )}
    >
      {/* Eyebrow */}
      {eyebrow && (
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-accent-cyan mb-4",
            "bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.15)]"
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          {eyebrow}
        </div>
      )}

      {/* Title */}
      <h2
        className={cn(
          "text-3xl md:text-5xl font-bold font-display tracking-tight text-text-primary leading-tight",
          isCenter ? "mx-auto max-w-3xl" : ""
        )}
      >
        {renderTitle()}
      </h2>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "mt-4 text-base md:text-lg text-text-secondary leading-relaxed",
            isCenter ? "mx-auto max-w-2xl" : "max-w-xl"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
