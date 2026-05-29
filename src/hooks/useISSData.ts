"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ISSPosition, PositionHistoryPoint } from "@/types/iss";

const API_URL = "https://api.wheretheiss.at/v1/satellites/25544";
const FALLBACK_URL = "http://api.open-notify.org/iss-now.json";
const POLL_INTERVAL = 3000;
const RETRY_INTERVAL = 10000;
const MAX_HISTORY = 50;
const ISS_LAUNCH_JULIAN = 2451143.5;
const ORBITS_PER_DAY = 15.54;

function calculateOrbitCount(daynum: number): number {
  const daysSinceLaunch = daynum - ISS_LAUNCH_JULIAN;
  return Math.floor(daysSinceLaunch * ORBITS_PER_DAY);
}

interface UseISSDataReturn {
  position: ISSPosition | null;
  loading: boolean;
  error: boolean;
  positionHistory: PositionHistoryPoint[];
  timeSinceUpdate: number;
  orbitCount: number;
  manualRefresh: () => void;
}

export function useISSData(): UseISSDataReturn {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [positionHistory, setPositionHistory] = useState<PositionHistoryPoint[]>([]);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);
  const errorCountRef = useRef(0);

  const fetchISS = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const pos: ISSPosition = {
        latitude: data.latitude,
        longitude: data.longitude,
        altitude: data.altitude,
        velocity: data.velocity,
        timestamp: data.timestamp,
        daynum: data.daynum,
        footprint: data.footprint,
        visibility: data.visibility,
        solar_lat: data.solar_lat,
        solar_lon: data.solar_lon,
        id: data.id,
        name: data.name,
        units: data.units,
      };

      setPosition((prev) => {
        if (prev) {
          setPositionHistory((h) => {
            const next = [...h, { lat: prev.latitude, lng: prev.longitude }];
            return next.slice(-MAX_HISTORY);
          });
        }
        return pos;
      });

      setError(false);
      errorCountRef.current = 0;
    } catch {
      errorCountRef.current += 1;

      // Try fallback API after 3 consecutive failures
      if (errorCountRef.current >= 3) {
        try {
          const fallbackRes = await fetch(FALLBACK_URL);
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            const issPos = fallbackData.iss_position;
            const pos: ISSPosition = {
              latitude: parseFloat(issPos.latitude),
              longitude: parseFloat(issPos.longitude),
              altitude: 0,
              velocity: 0,
              timestamp: Math.floor(Date.now() / 1000),
              daynum: 0,
              footprint: 0,
              visibility: "eclipsed",
              solar_lat: 0,
              solar_lon: 0,
              id: 25544,
              name: "iss",
              units: "kilometers",
            };

            setPosition((prev) => {
              if (prev) {
                setPositionHistory((h) => {
                  const next = [...h, { lat: prev.latitude, lng: prev.longitude }];
                  return next.slice(-MAX_HISTORY);
                });
              }
              return pos;
            });

            setError(false);
            errorCountRef.current = 0;
            setLoading(false);
            return;
          }
        } catch {
          // Fallback also failed
        }
      }

      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchISS();
    const interval = setInterval(fetchISS, POLL_INTERVAL);

    // Separate retry interval for errors
    const retryInterval = setInterval(() => {
      if (errorCountRef.current > 0) {
        fetchISS();
      }
    }, RETRY_INTERVAL);

    return () => {
      clearInterval(interval);
      clearInterval(retryInterval);
    };
  }, [fetchISS]);

  // Live time-since-update counter
  useEffect(() => {
    if (!position) return;
    const interval = setInterval(() => {
      setTimeSinceUpdate(Math.floor(Date.now() / 1000 - position.timestamp));
    }, 1000);
    return () => clearInterval(interval);
  }, [position]);

  const orbitCount = position ? calculateOrbitCount(position.daynum) : 0;

  return {
    position,
    loading,
    error,
    positionHistory,
    timeSinceUpdate,
    orbitCount,
    manualRefresh: fetchISS,
  };
}
