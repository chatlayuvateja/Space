"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, AlertTriangle, ArrowDown } from "lucide-react";
import { useSpaceNews } from "@/hooks/useSpaceNews";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import NewsCard from "./NewsCard";
import NewsFilters from "./NewsFilters";
import NewsCardSkeleton from "./NewsCardSkeleton";
import type { NewsSource } from "@/types/news";

export default function SpaceNewsSection() {
  const {
    articles,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  } = useSpaceNews();

  const [source, setSource] = useState<NewsSource>("all");

  const filtered = useMemo(() => {
    if (source === "all") return articles;
    return articles.filter(
      (a) => a.news_site.toLowerCase() === source.toLowerCase()
    );
  }, [articles, source]);

  return (
    <section id="news" className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Latest from Space"
          title="Mission Control Feed"
          description="Stay up to date with the latest discoveries, missions, and breakthroughs from space agencies and private companies worldwide."
        />

        {/* Filters */}
        <NewsFilters
          active={source}
          onChange={setSource}
          className="mb-10 justify-center"
        />

        {/* Error state */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6 py-2 px-4 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            {error}
            <Button variant="ghost" size="sm" onClick={refresh}>
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </Button>
          </motion.div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={source}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filtered.map((article, i) => (
                  <NewsCard key={article.id} article={article} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Load More */}
            {hasMore && filtered.length === articles.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-10"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="group"
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                      Load More
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Empty state */}
            {filtered.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-text-muted" />
                </div>
                <p className="text-lg text-text-secondary mb-1">
                  No articles found
                </p>
                <p className="text-sm text-text-muted">
                  Try selecting a different source filter.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
