"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { APODData, APODState } from "@/types/apod";

const API_BASE = "https://api.nasa.gov/planetary/apod";
const API_KEY = "DEMO_KEY"; // Replace with your own NASA API key at api.nasa.gov
const CACHE_KEY = "codebuff_apod_cache";
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours (well under DEMO_KEY 30 req/hr limit)

interface CachePayload {
  today: APODData;
  week: APODData[];
  fetchedAt: number;
}

function todayFallback(): APODData {
  return {
    title: "The Pillars of Creation",
    explanation:
      "The Pillars of Creation are a stunning region of star formation in the Eagle Nebula, captured in exquisite detail by the James Webb Space Telescope. These towering columns of gas and dust stretch for light-years and serve as cosmic nurseries where new stars are born.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/1280px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg",
    hdurl: "https://upload.wikimedia.org/wikipedia/commons/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg",
    date: new Date().toISOString().split("T")[0],
    copyright: "NASA, ESA, CSA, STScI",
    media_type: "image",
    service_version: "v1",
  };
}

function generateFallbackWeek(base: APODData): APODData[] {
  const fallbacks: APODData[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    fallbacks.push({
      ...base,
      title: `${base.title} (${i})`,
      date: d.toISOString().split("T")[0],
    });
  }
  return fallbacks;
}

function getDateRange(daysBack: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - daysBack);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

function loadCache(): CachePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const payload: CachePayload = JSON.parse(raw);
    if (Date.now() - payload.fetchedAt > CACHE_TTL) return null;
    return payload;
  } catch {
    return null;
  }
}

function saveCache(today: APODData, week: APODData[]) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ today, week, fetchedAt: Date.now() })
    );
  } catch {
    // localStorage might be full, just ignore
  }
}

export function useAPOD() {
  const [state, setState] = useState<APODState>({
    current: null,
    pastWeek: [],
    loading: true,
    error: null,
    index: -1,
  });
  const mountedRef = useRef(true);

  const fetchAPOD = useCallback(async () => {
    // Check cache first
    const cached = loadCache();
    if (cached) {
      if (mountedRef.current) {
        setState({
          current: cached.today,
          pastWeek: cached.week,
          loading: false,
          error: null,
          index: -1,
        });
      }
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      // Fetch today + past 7 days in ONE request
      const range = getDateRange(7);
      const res = await fetch(
        `${API_BASE}?api_key=${API_KEY}&start_date=${range.start}&end_date=${range.end}&thumbs=true`
      );

      // 429 = rate limited — use cache if available, otherwise don't show error
      if (res.status === 429) {
        const staleCache = loadCache(); // try to load again (might be expired but better than nothing)
        if (staleCache && mountedRef.current) {
          setState({
            current: staleCache.today,
            pastWeek: staleCache.week,
            loading: false,
            error: null,
            index: -1,
          });
        } else {
          // No cache at all — use fallback but don't signal error to user
          const fallback = todayFallback();
          if (mountedRef.current) {
            setState({
              current: fallback,
              pastWeek: generateFallbackWeek(fallback),
              loading: false,
              error: null, // silent — rate limits are temporary
              index: -1,
            });
          }
        }
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: APODData[] = await res.json();

      // The first item is the most recent (today), rest are past days
      const todayData = data[0];
      const pastData = data.slice(1, 8);

      // Save to cache
      saveCache(todayData, pastData);

      if (mountedRef.current) {
        setState({
          current: todayData,
          pastWeek: pastData,
          loading: false,
          error: null,
          index: -1,
        });
      }
    } catch (err) {
      if (mountedRef.current) {
        // Try cache as fallback
        const cached = loadCache();
        if (cached) {
          setState({
            current: cached.today,
            pastWeek: cached.week,
            loading: false,
            error: null,
            index: -1,
          });
          return;
        }

        const fallback = todayFallback();
        setState({
          current: fallback,
          pastWeek: generateFallbackWeek(fallback),
          loading: false,
          error: null, // silent fallback — no need to alarm the user
          index: -1,
        });
      }
    }
  }, []);

  const selectIndex = useCallback((idx: number) => {
    setState((s) => ({ ...s, index: idx }));
  }, []);

  const selectToday = useCallback(() => {
    setState((s) => ({ ...s, index: -1 }));
  }, []);

  // Derived current item
  const displayItem =
    state.index >= 0 && state.pastWeek[state.index]
      ? state.pastWeek[state.index]
      : state.current;

  useEffect(() => {
    mountedRef.current = true;
    fetchAPOD();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchAPOD]);

  return { ...state, displayItem, selectIndex, selectToday, refresh: fetchAPOD };
}
