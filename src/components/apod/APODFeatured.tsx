"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  Maximize2,
  Share2,
  ExternalLink,
  Play,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { APODData } from "@/types/apod";
import APODLightbox from "./APODLightbox";

interface APODFeaturedProps {
  data: APODData;
}

export default function APODFeatured({ data }: APODFeaturedProps) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isVideo = data.media_type === "video";
  const isToday =
    data.date === new Date().toISOString().split("T")[0];

  const embedUrl = isVideo
    ? data.url.replace("watch?v=", "embed/").split("&")[0]
    : null;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <motion.div
        key={data.date}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-12 gap-6 md:gap-8"
      >
        {/* Image / Video side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="md:col-span-7 relative"
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl",
              "bg-surface-1 border border-[rgba(255,255,255,0.06)]",
              isVideo ? "aspect-video" : "aspect-[4/3] md:aspect-auto md:min-h-[500px]"
            )}
          >
            {isVideo && embedUrl ? (
              <iframe
                src={embedUrl}
                title={data.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <AnimatePresence mode="wait">
                <motion.img
                  key={data.url}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={data.url}
                  alt={data.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setLightboxOpen(true)}
                />
              </AnimatePresence>
            )}

            {/* Gradient overlay for images */}
            {!isVideo && (
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            )}

            {/* Top controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {!isVideo && data.hdurl && (
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="w-9 h-9 rounded-xl bg-background/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all"
                  aria-label="View full resolution"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
              <a
                href={data.hdurl || data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-background/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all"
                aria-label="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Media type badge */}
            {isVideo && (
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur-md border border-white/10 text-xs text-accent-cyan font-medium">
                <Film className="w-3.5 h-3.5" />
                Video
              </div>
            )}
          </div>
        </motion.div>

        {/* Metadata side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="md:col-span-5 flex flex-col"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.15)] text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-accent-cyan mb-4 self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
            {isToday ? "Today's Picture" : "Astronomy Picture"}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-sm text-text-muted mb-3">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-text-primary mb-4 leading-tight">
            {data.title}
          </h2>

          {/* Explanation */}
          <div className="relative flex-1">
            <p
              className={cn(
                "text-sm text-text-secondary leading-relaxed",
                !expanded && "line-clamp-4"
              )}
            >
              {data.explanation}
            </p>
            {data.explanation.length > 250 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-accent-cyan hover:text-accent-purple text-sm mt-1 transition-colors"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Copyright */}
          {data.copyright && (
            <div className="flex items-center gap-1.5 mt-4 text-xs text-text-muted">
              <User className="w-3 h-3" />
              © {data.copyright}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-5 border-t border-[rgba(255,255,255,0.06)]">
            <Button
              variant="glow"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Share"}
            </Button>

            {!isVideo && data.hdurl && (
              <Button variant="primary" size="sm" asChild>
                <a
                  href={data.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Full Resolution
                </a>
              </Button>
            )}

            {isVideo && (
              <Button variant="primary" size="sm" asChild>
                <a href={data.url} target="_blank" rel="noopener noreferrer">
                  <Play className="w-3.5 h-3.5" />
                  Watch on YouTube
                </a>
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox */}
      {!isVideo && (
        <APODLightbox
          open={lightboxOpen}
          imageUrl={data.hdurl || data.url}
          title={data.title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
