"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ISSPositionSample, ObserverLocation, ISSPass } from "@/lib/astro-utils";
import { detectPasses } from "@/lib/astro-utils";

interface UseISSPassesReturn {
  /** Current geolocation status */
  status: "idle" | "requesting" | "denied" | "fetching" | "computing" | "ready" | "error";
  /** Detected visible passes */
  passes: ISSPass[];
  /** Error message if any */
  error: string | null;
  /** Observer location (if available) */
  observerLocation: ObserverLocation | null;
  /** Request location and find passes */
  findPasses: () => void;
  /** Manually set location (for denied/fallback) */
  setManualLocation: (lat: number, lon: number) => void;
  /** Whether passes data is from a manual location entry */
  isManual: boolean;
}

// WhereTheISS positions endpoint returns timestamped lat/lng/alt samples.
// We fetch 6 hours of data — enough to detect several visible passes.
const POSITIONS_ENDPOINT =
  "https://api.wheretheiss.at/v1/satellites/25544/positions";
const FETCH_WINDOW_SECONDS = 21600; // 6 hours

export function useISSPasses(): UseISSPassesReturn {
  const [status, setStatus] = useState<UseISSPassesReturn["status"]>("idle");
  const [passes, setPasses] = useState<ISSPass[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [observerLocation, setObserverLocation] = useState<ObserverLocation | null>(null);
  const [isManual, setIsManual] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const computePasses = useCallback(
    async (location: ObserverLocation) => {
      setStatus("fetching");
      setError(null);

      try {
        // Fetch ISS positions for the next 6 hours
        const url = `${POSITIONS_ENDPOINT}?latitude=${location.latitude}&longitude=${location.longitude}&seconds=${FETCH_WINDOW_SECONDS}`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(
            res.status === 429
              ? "Rate limited. Try again later."
              : `Failed to fetch ISS positions (HTTP ${res.status})`
          );
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {                    throw new Error("No position data available. The ISS API may be rate limited. Try again later.");
        }

        setStatus("computing");

        // Map API response to our position sample format
        const positions: ISSPositionSample[] = data.map(
          (item: {
            latitude: number;
            longitude: number;
            altitude: number;
            timestamp: number;
          }) => ({
            latitude: item.latitude,
            longitude: item.longitude,
            altitude: item.altitude,
            timestamp: item.timestamp,
          })
        );

        // Detect passes
        const detected = detectPasses(positions, location, {
          minElevation: 10,
        });

        if (mountedRef.current) {
          // Sort by start time (soonest first)
          detected.sort((a, b) => a.startTime - b.startTime);

          // Only show passes that haven't completely ended yet
          const now = Date.now() / 1000;
          const upcoming = detected.filter((p) => p.endTime > now);

          setPasses(upcoming);
          setObserverLocation(location);
          setStatus("ready");
        }
      } catch (err) {
        if (mountedRef.current) {
          const msg = err instanceof Error ? err.message : "Failed to compute passes";
          setError(msg);
          setStatus("error");
        }
      }
    },
    []
  );

  const findPasses = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser. Enter coordinates manually below.");
      setStatus("denied");
      return;
    }

    setStatus("requesting");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location: ObserverLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          altitude: pos.coords.altitude ?? undefined,
        };
        setObserverLocation(location);
        setIsManual(false);
        computePasses(location);
      },
      (err) => {
        if (mountedRef.current) {
          const message =
            err.code === err.PERMISSION_DENIED
              ? "Location access denied. You can enter coordinates manually."
              : "Could not determine your location. Try again or enter coordinates manually.";
          setError(message);
          setStatus("denied");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, [computePasses]);

  const setManualLocation = useCallback(
    (lat: number, lon: number) => {
      const location: ObserverLocation = { latitude: lat, longitude: lon };
      setIsManual(true);
      setObserverLocation(location);
      computePasses(location);
    },
    [computePasses]
  );

  return {
    status,
    passes,
    error,
    observerLocation,
    findPasses,
    setManualLocation,
    isManual,
  };
}
