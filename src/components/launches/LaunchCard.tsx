"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Launch } from "@/types/launches";
import { COUNTRY_FLAGS } from "@/types/launches";
import LaunchStatusBadge from "./LaunchStatusBadge";
import LaunchCountdown from "./LaunchCountdown";
import { useCountdown } from "@/hooks/useCountdown";

interface LaunchCardProps {
  launch: Launch;
  index: number;
  onSelect: (launch: Launch) => void;
  isPrevious?: boolean;
}

export default function LaunchCard({
  launch,
  index,
  onSelect,
  isPrevious = false,
}: LaunchCardProps) {
  const countdown = useCountdown(isPrevious ? null : launch.net);
  const imageUrl =
    launch.image || launch.rocket?.configuration?.image_url || null;

  const agencyName = launch.launch_service_provider?.name ?? "Unknown";
  const agencyType = launch.launch_service_provider?.type ?? null;
  const countryCode = launch.pad?.location?.country_code ?? null;
  const flag = countryCode ? COUNTRY_FLAGS[countryCode] ?? "" : "";

  const orbitName = launch.mission?.orbit?.name ?? null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(launch)}
      className="relative group text-left w-full rounded-2xl overflow-hidden glass-card cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
    >
      {/* Image section */}
      <div className="aspect-video relative overflow-hidden bg-surface-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={launch.name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            </svg>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-space-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Orbit badge */}
        {orbitName && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-surface-1/80 backdrop-blur-sm text-accent-cyan border border-accent-cyan/20">
            {orbitName}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        {/* Agency */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-text-muted uppercase tracking-[0.15em] font-medium">
            {agencyName}
          </span>
          {flag && <span className="text-sm">{flag}</span>}
        </div>

        {/* Mission name */}
        <h3 className="text-base font-semibold text-text-primary leading-snug line-clamp-2">
          {launch.name}
        </h3>

        {/* Rocket */}
        {launch.rocket?.configuration?.name && (
          <p className="text-[13px] font-mono text-cyan-400/80">
            {launch.rocket.configuration.name}
          </p>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-1">
          {isPrevious ? (
            <span className="text-xs text-text-muted font-mono">
              {new Date(launch.net).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          ) : (
            <LaunchCountdown data={countdown} compact />
          )}

          <LaunchStatusBadge
            status={launch.status?.name ?? "Unknown"}
            abbrev={launch.status?.abbrev}
          />
        </div>
      </div>
    </motion.button>
  );
}
