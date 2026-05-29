"use client";

import { createContext, useContext, ReactNode } from "react";
import { useLaunches } from "@/hooks/useLaunches";
import type { Launch } from "@/types/launches";

interface LaunchesContextValue {
  upcoming: Launch[];
  previous: Launch[];
  loading: boolean;
  error: string | null;
  rateLimited: boolean;
  refresh: () => void;
}

const LaunchesContext = createContext<LaunchesContextValue | null>(null);

export function LaunchProvider({ children }: { children: ReactNode }) {
  const launches = useLaunches();

  return (
    <LaunchesContext.Provider value={launches}>
      {children}
    </LaunchesContext.Provider>
  );
}

export function useLaunchesContext(): LaunchesContextValue {
  const context = useContext(LaunchesContext);
  if (!context) {
    throw new Error(
      "useLaunchesContext must be used within a LaunchProvider"
    );
  }
  return context;
}
