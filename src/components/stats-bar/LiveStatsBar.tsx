"use client";

import { useEffect, useState, useCallback } from "react";
import { Satellite, Rocket, Users, Sun, Globe } from "lucide-react";
import { usePeopleInSpace } from "@/hooks/usePeopleInSpace";
import { useLaunchesContext } from "@/contexts/LaunchesContext";
import { useISSData } from "@/hooks/useISSData";

function formatCountdown(target: Date): string {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "Launching now!";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function LiveStatsBar() {
  const { count: people, loading: peopleLoading } = usePeopleInSpace();
  const { upcoming, loading: launchesLoading } = useLaunchesContext();
  const { position } = useISSData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextLaunch = !launchesLoading && upcoming.length > 0 ? upcoming[0] : null;
  const nextLaunchDate = nextLaunch?.net ? new Date(nextLaunch.net) : null;

  const issText =
    position
      ? `ISS: ${position.latitude.toFixed(1)}°${position.latitude >= 0 ? "N" : "S"} ${position.longitude.toFixed(1)}°${position.longitude >= 0 ? "E" : "W"} @ ${position.altitude.toFixed(0)}km`
      : "ISS: Acquiring signal...";

  const launchText =
    nextLaunch && nextLaunchDate && nextLaunch.rocket?.configuration?.name
      ? `Next Launch: ${nextLaunch.rocket.configuration.name} in ${formatCountdown(nextLaunchDate)}`
      : null;

  const peopleText = !peopleLoading ? `${people} in space` : null;

  if (!mounted) return null;

  const items = [
    { icon: Satellite, text: issText },
    ...(launchText ? [{ icon: Rocket, text: launchText }] : []),
    ...(peopleText ? [{ icon: Users, text: peopleText }] : []),
    { icon: Sun, text: "Solar Activity: Moderate (M-class flare)" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-9 bg-[#080b14]/95 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden">
      {/* Gradient fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#080b14] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#080b14] to-transparent z-10 pointer-events-none" />

      {/* Desktop: static centered */}
      <div className="hidden md:flex h-full items-center justify-center gap-0">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-0">
            {i > 0 && (
              <span className="text-white/[0.06] mx-3 select-none">|</span>
            )}
            <div className="flex items-center gap-1.5">
              <item.icon className="w-3 h-3 text-accent-cyan/60" />
              <span className="text-[11px] font-mono text-text-secondary whitespace-nowrap">
                {item.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: scrolling marquee */}
      <div className="md:hidden h-full flex items-center overflow-hidden">
        <div className="flex animate-marquee gap-12 whitespace-nowrap px-4">
          {[...items, ...items].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <item.icon className="w-3 h-3 text-accent-cyan/60 shrink-0" />
              <span className="text-[11px] font-mono text-text-secondary">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
