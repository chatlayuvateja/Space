"use client";

import { motion } from "framer-motion";
import { Image, RefreshCw, AlertTriangle } from "lucide-react";
import { useAPOD } from "@/hooks/useAPOD";
import SectionHeader from "@/components/ui/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/button";
import APODFeatured from "./APODFeatured";
import APODThumbnailStrip from "./APODThumbnailStrip";

export default function APODSection() {
  const {
    displayItem,
    current,
    pastWeek,
    loading,
    error,
    index,
    selectIndex,
    selectToday,
    refresh,
  } = useAPOD();

  return (
    <section id="apod" className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="NASA Astronomy Picture of the Day"
          title="Cosmic Gallery"
          description="Each day NASA releases a new image or photograph of our fascinating universe, accompanied by a brief explanation from an astronomer."
        />

        {/* Error toast — only shown when there's truly no data */}
        {error && !loading && !current && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6 py-2 px-4 rounded-lg bg-accent-amber/10 border border-accent-amber/20 text-accent-amber text-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            {error}
            <Button variant="ghost" size="sm" onClick={refresh}>
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </Button>
          </motion.div>
        )}

        {/* Content */}
        {loading && !current ? (
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <Skeleton variant="image" className="min-h-[400px]" />
            </div>
            <div className="md:col-span-5 space-y-4">
              <Skeleton variant="text" className="w-1/3 h-4" />
              <Skeleton variant="text" className="w-1/4 h-3" />
              <Skeleton variant="text" className="w-full h-8" />
              <Skeleton variant="text" className="w-full h-4" />
              <Skeleton variant="text" className="w-full h-4" />
              <Skeleton variant="text" className="w-3/4 h-4" />
              <Skeleton variant="text" className="w-2/3 h-4" />
            </div>
          </div>
        ) : displayItem ? (
          <>
            {/* Tab-like selector: Today / Past Week */}
            <div className="flex items-center gap-2 mb-8">
              <Button
                variant={index === -1 ? "primary" : "ghost"}
                size="sm"
                onClick={selectToday}
              >
                <Image className="w-3.5 h-3.5" />
                Today
              </Button>
              {pastWeek.length > 0 && (
                <span className="text-xs text-text-muted">|</span>
              )}
              {pastWeek.map((_, i) => (
                <button
                  key={i}
                  onClick={() => selectIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    i === index
                      ? "bg-accent-cyan scale-125"
                      : "bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.3)]"
                  }`}
                  aria-label={`View APOD from ${pastWeek[i]?.date}`}
                />
              ))}
            </div>

            {/* Featured */}
            <APODFeatured data={displayItem} />

            {/* Past week strip */}
            {pastWeek.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-[rgba(255,255,255,0.06)] to-transparent" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted">
                    Past Week
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-[rgba(255,255,255,0.06)] to-transparent" />
                </div>
                <APODThumbnailStrip
                  items={pastWeek}
                  activeIndex={index}
                  onSelect={selectIndex}
                />
              </motion.div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}
