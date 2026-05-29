"use client";

import { useState, useEffect, useRef } from "react";

interface AstroData {
  people: { name: string; craft: string }[];
  number: number;
  message: string;
}

export function usePeopleInSpace() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const fetchAstros = async () => {
      try {
        const res = await fetch("http://api.open-notify.org/astros.json");
        if (res.ok) {
          const data: AstroData = await res.json();
          if (mountedRef.current) {
            setCount(data.number);
          }
        }
      } catch {
        // Silently fail — non-critical data
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchAstros();
    const interval = setInterval(fetchAstros, 60000); // Refresh every minute

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  return { count, loading };
}
