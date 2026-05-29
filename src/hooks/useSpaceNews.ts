"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { NewsArticle, NewsAPIResponse } from "@/types/news";

const API_BASE = "https://api.spaceflightnewsapi.net/v4/articles/";

interface UseSpaceNewsReturn {
  articles: NewsArticle[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

const PAGE_SIZE = 9;

export function useSpaceNews(): UseSpaceNewsReturn {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchInitial = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}?limit=${PAGE_SIZE}&ordering=-published_at`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: NewsAPIResponse = await res.json();

      if (mountedRef.current) {
        setArticles(data.results ?? []);
        setNextUrl(data.next);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch news"
        );
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextUrl || loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await fetch(nextUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: NewsAPIResponse = await res.json();

      if (mountedRef.current) {
        setArticles((prev) => [...prev, ...(data.results ?? [])]);
        setNextUrl(data.next);
      }
    } catch {
      // Silently fail on load more
    } finally {
      if (mountedRef.current) {
        setLoadingMore(false);
      }
    }
  }, [nextUrl, loadingMore]);

  useEffect(() => {
    mountedRef.current = true;
    fetchInitial();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchInitial]);

  return {
    articles,
    loading,
    loadingMore,
    error,
    hasMore: nextUrl !== null,
    loadMore,
    refresh: fetchInitial,
  };
}
