"use client";

import { useState, useEffect, useCallback } from "react";
import { differenceInSeconds, intervalToDuration } from "date-fns";

export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isPast: boolean;
  isUrgent: boolean; // T-1 hour
  isCritical: boolean; // T-10 minutes
}

export function useCountdown(targetDate: string | null): CountdownData {
  const compute = useCallback((): CountdownData => {
    if (!targetDate) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isPast: false,
        isUrgent: false,
        isCritical: false,
      };
    }

    const target = new Date(targetDate);
    const now = new Date();
    const totalSecs = differenceInSeconds(target, now);

    if (totalSecs <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isPast: true,
        isUrgent: false,
        isCritical: false,
      };
    }

    const duration = intervalToDuration({ start: now, end: target });

    return {
      days: duration.days ?? 0,
      hours: duration.hours ?? 0,
      minutes: duration.minutes ?? 0,
      seconds: duration.seconds ?? 0,
      totalSeconds: totalSecs,
      isPast: false,
      isUrgent: totalSecs <= 3600,
      isCritical: totalSecs <= 600,
    };
  }, [targetDate]);

  const [data, setData] = useState<CountdownData>(compute);

  useEffect(() => {
    if (!targetDate) return;

    setData(compute());

    const interval = setInterval(() => {
      setData(compute());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, compute]);

  return data;
}
