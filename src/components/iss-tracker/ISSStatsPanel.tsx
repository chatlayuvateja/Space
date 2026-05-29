"use client";

import { MapPin, Globe, Activity, Gauge, Orbit, Radio } from "lucide-react";
import { motion } from "framer-motion";
import ISSStatCard from "./ISSStatCard";
import type { ISSPosition } from "@/types/iss";

interface ISSStatsPanelProps {
  position: ISSPosition;
  orbitCount: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export default function ISSStatsPanel({ position, orbitCount }: ISSStatsPanelProps) {
  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-1 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="region"
      aria-label="ISS telemetry data"
      aria-live="polite"
    >
      {/* Section label - full width */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex items-center gap-2 mb-1 col-span-full"
      >
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)" }} />
        <span className="text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.25)" }}>
          Telemetry
        </span>
        <div className="h-px flex-1" style={{ background: "linear-gradient(270deg, rgba(255,255,255,0.08), transparent)" }} />
      </motion.div>

      {/* Latitude - cyan */}
      <ISSStatCard
        icon={MapPin}
        label="Latitude"
        value={position.latitude.toFixed(4)}
        unit="°"
        color="#22d3ee"
        delay={0}
        ariaLabel={`ISS latitude: ${position.latitude.toFixed(4)} degrees`}
      />

      {/* Longitude - cyan */}
      <ISSStatCard
        icon={Globe}
        label="Longitude"
        value={position.longitude.toFixed(4)}
        unit="°"
        color="#22d3ee"
        delay={0.08}
        ariaLabel={`ISS longitude: ${position.longitude.toFixed(4)} degrees`}
      />

      {/* Altitude - purple */}
      <ISSStatCard
        icon={Activity}
        label="Altitude"
        value={position.altitude.toFixed(2)}
        unit="km"
        color="#a78bfa"
        delay={0.16}
        ariaLabel={`ISS altitude: ${position.altitude.toFixed(2)} kilometers`}
      />

      {/* Velocity - orange */}
      <ISSStatCard
        icon={Gauge}
        label="Velocity"
        value={Math.round(position.velocity).toLocaleString()}
        unit="km/h"
        color="#fb923c"
        delay={0.24}
        ariaLabel={`ISS velocity: ${Math.round(position.velocity).toLocaleString()} kilometers per hour`}
      />

      {/* Visibility - green/blue */}
      <ISSStatCard
        icon={Radio}
        label="Visibility"
        value={position.visibility === "daylight" ? "Daylight" : "Eclipsed"}
        color={position.visibility === "daylight" ? "#4ade80" : "#60a5fa"}
        delay={0.32}
        ariaLabel={`ISS visibility: ${position.visibility}`}
      />

      {/* Orbit number */}
      <ISSStatCard
        icon={Orbit}
        label="Orbit"
        value={`#${orbitCount.toLocaleString()}`}
        color="#f472b6"
        delay={0.4}
        ariaLabel={`Orbit number: ${orbitCount.toLocaleString()}`}
      />

      {/* Footprint */}
      <ISSStatCard
        icon={Radio}
        label="Footprint"
        value={(position.footprint / 1000).toFixed(0)}
        unit="km"
        color="#34d399"
        delay={0.48}
        ariaLabel={`ISS footprint: ${(position.footprint / 1000).toFixed(0)} kilometers`}
      />
    </motion.div>
  );
}
