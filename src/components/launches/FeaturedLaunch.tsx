"use client";

import { motion } from "framer-motion";
import { Rocket, MapPin, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import LaunchStatusBadge from "./LaunchStatusBadge";
import LaunchCountdown from "./LaunchCountdown";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";
import type { Launch } from "@/types/launches";
import { COUNTRY_FLAGS } from "@/types/launches";

interface FeaturedLaunchProps {
  launch: Launch;
  onSelect: (launch: Launch) => void;
  className?: string;
}

export default function FeaturedLaunch({
  launch,
  onSelect,
  className,
}: FeaturedLaunchProps) {
  const countdown = useCountdown(launch.net);
  const imageUrl =
    launch.image || launch.rocket?.configuration?.image_url || null;

  const agencyName = launch.launch_service_provider?.name ?? "Unknown";
  const agencyType = launch.launch_service_provider?.type ?? null;
  const rocketName = launch.rocket?.configuration?.name ?? "Unknown";
  const padName = launch.pad?.name ?? "Unknown";
  const locationName = launch.pad?.location?.name ?? "";
  const countryCode = launch.pad?.location?.country_code ?? null;
  const flag = countryCode ? COUNTRY_FLAGS[countryCode] ?? "" : "";
  const vidUrl = launch.vidURLs?.[0]?.url ?? null;

  const locationStr = [locationName, flag].filter(Boolean).join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10",
        "min-h-[420px] md:min-h-[520px]",
        className
      )}
    >
      {/* Background image */}
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={launch.name}
            sizes="(max-width: 768px) 100vw, 80vw"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-surface-1 via-background to-surface-1" />
      )}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
        {/* Top badge area */}
        <div className="flex items-center gap-3 mb-4">
          <LaunchStatusBadge
            status={launch.status?.name ?? "Unknown"}
            abbrev={launch.status?.abbrev}
          />
          {agencyType && (
            <span className="text-[10px] text-text-secondary uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              {agencyType}
            </span>
          )}
        </div>

        {/* Mission name */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-2 max-w-3xl">
          {launch.name}
        </h2>

        {/* Info row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-accent-cyan" />
            {agencyName}
          </span>
          <span className="flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5 text-accent-cyan" />
            {rocketName}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent-cyan" />
            {padName}
            {locationStr && <> · {locationStr}</>}
          </span>
        </div>

        {/* Countdown */}
        <LaunchCountdown data={countdown} status={launch.status?.abbrev} />

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onSelect(launch)}
          >
            <ExternalLink className="w-4 h-4" />
            Mission Details
          </Button>
          {vidUrl && (
            <Button variant="glow" size="lg" asChild>
              <a
                href={vidUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                </svg>
                Watch Live
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
