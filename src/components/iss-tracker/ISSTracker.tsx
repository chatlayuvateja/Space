"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Satellite, RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useISSData } from "@/hooks/useISSData";
import ISSStatsPanel from "./ISSStatsPanel";
import ISSLiveIndicator from "./ISSLiveIndicator";
import ISSPassesPanel from "./ISSPassesPanel";

// Dynamic import with no SSR for Leaflet map
const ISSMap = dynamic(() => import("./ISSMap"), { ssr: false });

// ---- Skeleton Loader ----
function SkeletonCard() {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="relative z-10 space-y-3">
        <div className="h-3 w-16 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-7 w-24 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
      </div>
      {/* Shimmer */}
      <div
        className="absolute inset-0 -translate-x-full animate-pulse"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
          animation: "shimmer 2s infinite",
        }}
      />
    </div>
  );
}

// ---- Main Component ----
export default function ISSTracker() {
  const {
    position,
    loading,
    error,
    positionHistory,
    timeSinceUpdate,
    orbitCount,
    manualRefresh,
  } = useISSData();

  // Decimate ground track for performance (keep every point, but limit count)
  const groundTrackCoords: [number, number][] = positionHistory.map((p) => [p.lat, p.lng]);

  return (
    <section
      id="iss"
      className="relative py-24 md:py-32 px-4 sm:px-6 overflow-hidden"
      style={{ background: "#0a0e1a" }}
      aria-label="International Space Station live tracker"
    >
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #22d3ee, transparent 60%)",
          }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-[0.02]"
          style={{
            background: "radial-gradient(circle, #a78bfa, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em]"
                style={{
                  background: "rgba(34, 211, 238, 0.1)",
                  border: "1px solid rgba(34, 211, 238, 0.15)",
                  color: "#22d3ee",
                }}
              >
                <Satellite className="w-3 h-3" />
                Live Tracking
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              ISS <span style={{ color: "#22d3ee" }}>LIVE</span> TRACKER
            </h2>
            <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Real-time orbital telemetry &mdash; polling every 3 seconds
            </p>
          </div>

          {/* Live indicator */}
          {position && <ISSLiveIndicator timeSinceUpdate={timeSinceUpdate} />}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-4 md:gap-6">
          {/* Map - 3/5 on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-3"
          >
            <div
              className="relative overflow-hidden rounded-2xl h-[260px] md:h-[420px]"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Map container */}
              <div
                className="w-full h-full"
                role="img"
                aria-label="ISS live position map"
              >
                {loading && !position ? (
                  <div className="flex items-center justify-center h-full" style={{ background: "#0a0e1a" }}>
                    <div className="text-center">
                      <Satellite className="w-8 h-8 mx-auto mb-2" style={{ color: "rgba(34, 211, 238, 0.5)" }} />
                      <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Acquiring signal...
                      </span>
                    </div>
                  </div>
                ) : position ? (
                  <ISSMap
                    latitude={position.latitude}
                    longitude={position.longitude}
                    altitude={position.altitude}
                    velocity={position.velocity}
                    orbitCount={orbitCount}
                    groundTrack={groundTrackCoords}
                    visibility={position.visibility}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full" style={{ background: "#0a0e1a" }}>
                    <div className="text-center px-4">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-2" style={{ color: "rgba(251, 146, 60, 0.6)" }} />
                      <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Map unavailable
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Refresh button overlay */}
              <div className="absolute top-3 right-3 z-[1000]">
                <button
                  onClick={manualRefresh}
                  disabled={loading}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{
                    background: "rgba(10, 14, 26, 0.7)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                  }}
                  aria-label="Refresh ISS position"
                >
                  <RefreshCw
                    className={cn("w-3.5 h-3.5", loading && "animate-spin")}
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  />
                </button>
              </div>

              {/* Map hint */}
              <div className="absolute bottom-3 left-3 z-[1000]">
                <span
                  className="text-[9px] font-mono px-2 py-1 rounded"
                  style={{
                    background: "rgba(10, 14, 26, 0.6)",
                    color: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  Drag to explore · Scroll to zoom
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats Panel - 2/5 on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-2"
          >
            {loading && !position ? (
              <div className="flex flex-col gap-3">
                {[...Array(5)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error && !position ? (
              <div
                className="rounded-xl p-6 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                  backdropFilter: "blur(12px)",
                }}
                role="alert"
              >
                <motion.div
                  animate={{ x: [0, -5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <AlertTriangle className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(239, 68, 68, 0.6)" }} />
                  <p className="text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Failed to fetch ISS data
                  </p>
                  <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Retrying every 10 seconds...
                  </p>
                  <button
                    onClick={manualRefresh}
                    className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    Retry Now
                  </button>
                </motion.div>
              </div>
            ) : position ? (
              <ISSStatsPanel position={position} orbitCount={orbitCount} />
            ) : null}
          </motion.div>
        </div>

        {/* ISS Passes Panel */}
        {position && !loading && <ISSPassesPanel />}
      </div>
    </section>
  );
}
