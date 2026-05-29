"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Launch, LaunchLibraryResponse } from "@/types/launches";

const API_BASE = "https://ll.thespacedevs.com/2.2.0";
const UPCOMING_URL = `${API_BASE}/launch/upcoming/?format=json&limit=10&mode=detailed`;
const PREVIOUS_URL = `${API_BASE}/launch/previous/?format=json&limit=6&mode=detailed`;

const LS_KEY_UPCOMING = "codebuff_launches_upcoming";
const LS_KEY_PREVIOUS = "codebuff_launches_previous";
const LS_KEY_TIMESTAMP = "codebuff_launches_ts";
// LL2 free tier: 15 req/hour. Persist to localStorage so data survives page reloads.
// We re-fetch at most once every 4 hours = 6 calls/day = well under 15 req/hr.
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours
const RETRY_DELAY = 5 * 60 * 1000; // 5 minutes before retrying on 429

interface CacheEntry {
  data: Launch[];
  timestamp: number;
}

const memoryCache: Record<string, CacheEntry> = {};

function loadPersistedCache(key: string): CacheEntry | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

function savePersistedCache(key: string, cacheKey: string, data: Launch[]) {
  const entry: CacheEntry = { data, timestamp: Date.now() };
  memoryCache[cacheKey] = entry;
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage might be full
  }
}

interface UseLaunchesReturn {
  upcoming: Launch[];
  previous: Launch[];
  loading: boolean;
  error: string | null;
  rateLimited: boolean;
  refresh: () => void;
}

export function useLaunches(): UseLaunchesReturn {
  const [upcoming, setUpcoming] = useState<Launch[]>([]);
  const [previous, setPrevious] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const mountedRef = useRef(true);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasDataRef = useRef(false);

  const fetchList = useCallback(
    async (url: string, cacheKey: string, lsKey: string): Promise<Launch[]> => {
      // Check memory cache + localStorage first
      const memCached = memoryCache[cacheKey];
      if (memCached && Date.now() - memCached.timestamp < CACHE_TTL) {
        return memCached.data;
      }
      const persisted = loadPersistedCache(lsKey);
      if (persisted && Date.now() - persisted.timestamp < CACHE_TTL) {
        memoryCache[cacheKey] = persisted;
        return persisted.data;
      }

      const res = await fetch(url);

      if (res.status === 429) {
        setRateLimited(true);
        // Return whatever we have cached (even if expired)
        if (persisted) return persisted.data;
        if (memCached) return memCached.data;

        // Schedule a retry
        if (!retryTimerRef.current) {
          retryTimerRef.current = setTimeout(() => {
            retryTimerRef.current = null;
            delete memoryCache[cacheKey];
          }, RETRY_DELAY);
        }
        throw new Error(
          "Rate limited. Launch Library API allows 15 req/hour. Cached data shown."
        );
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data: LaunchLibraryResponse = await res.json();
      const results = data.results ?? [];

      // Update both memory and localStorage cache
      savePersistedCache(lsKey, cacheKey, results);
      setRateLimited(false);
      return results;
    },
    []
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [upcomingData, previousData] = await Promise.all([
        fetchList(UPCOMING_URL, "upcoming", LS_KEY_UPCOMING),
        fetchList(PREVIOUS_URL, "previous", LS_KEY_PREVIOUS),
      ]);

      if (mountedRef.current) {
        setUpcoming(upcomingData);
        setPrevious(previousData);
        hasDataRef.current =
          upcomingData.length > 0 || previousData.length > 0;
      }
    } catch (err) {
      if (mountedRef.current) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch launch data";
        // Only show error if we have NO data (including from cache)
        if (!hasDataRef.current) {
          setError(message);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchList]);

  useEffect(() => {
    mountedRef.current = true;
    fetchAll();

    // Refresh every 4 hours — stayed under 15 req/hr even with multiple reloads
    const interval = setInterval(fetchAll, CACHE_TTL);
    return () => {
      mountedRef.current = false;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
      clearInterval(interval);
    };
  }, [fetchAll]);

  return {
    upcoming,
    previous,
    loading,
    error,
    rateLimited,
    refresh: fetchAll,
  };
}
