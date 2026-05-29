"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/types/news";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

export default function NewsCard({ article, index }: NewsCardProps) {
  const imageUrl = article.image_url || null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative rounded-2xl overflow-hidden bg-[rgba(13,17,23,0.8)] border border-[rgba(255,255,255,0.06)] transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:translate-y-[-2px]"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface-1 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-text-muted/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        )}

        {/* Source badge */}
        <div className="absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-background/70 backdrop-blur-sm border border-white/10 text-text-primary">
          {article.news_site}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        {/* Source (again for visibility when image not loaded) */}
        {!imageUrl && (
          <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-accent-cyan">
            {article.news_site}
          </span>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-accent-cyan transition-colors duration-200">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(article.published_at), {
              addSuffix: true,
            })}
          </span>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary hover:text-accent-cyan transition-colors duration-200 group/link"
          >
            Read More
            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
