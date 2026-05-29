"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Satellite,
  MapPin,
  Crosshair,
  AlertTriangle,
  RefreshCw,
  Clock,
  Eye,
  ArrowUp,
  Compass,
} from "lucide-react";
import { useISSPasses } from "@/hooks/useISSPasses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  formatPassTime,
  formatPassDate,
  formatDuration,
  getVisibilityRating,
  azimuthToDirection,
} from "@/lib/astro-utils";

export default function ISSPassesPanel() {
  const {
    status,
    passes,
    error,
    observerLocation,
    findPasses,
    setManualLocation,
    isManual,
  } = useISSPasses();

  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");
  const [showManual, setShowManual] = useState(false);

  const handleManualSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const lat = parseFloat(manualLat);
      const lon = parseFloat(manualLon);
      if (isNaN(lat) || isNaN(lon)) return;
      setManualLocation(lat, lon);
    },
    [manualLat, manualLon, setManualLocation]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="mt-6"
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(13, 17, 23, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(34, 211, 238, 0.1)" }}
            >
              <Eye className="w-4 h-4" style={{ color: "#22d3ee" }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>
                ISS Sightings
              </h3>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                Find visible passes from your location
              </p>
            </div>
          </div>

          {status === "ready" && (
            <button
              onClick={findPasses}
              className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Idle state - show CTA */}
          {status === "idle" && (
            <div className="text-center py-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "rgba(34, 211, 238, 0.08)" }}
              >
                <Crosshair className="w-6 h-6" style={{ color: "rgba(34, 211, 238, 0.6)" }} />
              </div>
              <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                See when the ISS flies over you
              </p>
              <p className="text-[11px] mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
                Get notified of upcoming visible passes at your location
              </p>
              <Button variant="primary" size="lg" onClick={findPasses}>
                <Crosshair className="w-4 h-4" />
                Find Passes
              </Button>
            </div>
          )}

          {/* Requesting location */}
          {status === "requesting" && (
            <div className="text-center py-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <MapPin className="w-6 h-6" style={{ color: "rgba(34, 211, 238, 0.6)" }} />
                </motion.div>
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                Requesting location access...
              </p>
              <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                Your location is never stored or shared
              </p>
            </div>
          )}

          {/* Fetching/computing */}
          {status === "fetching" && (
            <div className="text-center py-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-transparent border-t-accent-cyan"
                style={{ borderTopColor: "#22d3ee" }}
              />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                Fetching ISS orbit data...
              </p>
            </div>
          )}

          {status === "computing" && (
            <div className="text-center py-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-transparent border-t-accent-purple"
                style={{ borderTopColor: "#818cf8" }}
              />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                Computing visible passes...
              </p>
            </div>
          )}

          {/* Denied state - show manual input */}
          {status === "denied" && (
            <div className="text-center py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "rgba(251, 191, 36, 0.08)" }}
              >
                <MapPin className="w-5 h-5" style={{ color: "rgba(251, 191, 36, 0.6)" }} />
              </div>
              <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                {error || "Location access is needed to find passes."}
              </p>

              {!showManual ? (
                <div className="flex items-center justify-center gap-2">
                  <Button variant="ghost" size="sm" onClick={findPasses}>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Try Again
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowManual(true)}
                  >
                    Enter Coordinates
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleManualSubmit} className="max-w-xs mx-auto">
                  <p className="text-[10px] mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Enter your latitude and longitude (decimal degrees)
                  </p>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Latitude"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-mono text-center"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Longitude"
                      value={manualLon}
                      onChange={(e) => setManualLon(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-mono text-center"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!manualLat || !manualLon}
                    className="w-full"
                  >
                    <Satellite className="w-3.5 h-3.5" />
                    Find Passes
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="text-center py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "rgba(239, 68, 68, 0.08)" }}
              >
                <AlertTriangle className="w-5 h-5" style={{ color: "rgba(239, 68, 68, 0.6)" }} />
              </div>
              <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                {error || "Something went wrong."}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button variant="ghost" size="sm" onClick={findPasses}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </Button>
                {observerLocation && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowManual(true)}
                  >
                    Enter Another Location
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Ready state - show passes */}
          {status === "ready" && (
            <div>
              {/* Location indicator */}
              {observerLocation && (
                <div
                  className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(34, 211, 238, 0.5)" }} />
                  <span
                    className="text-[11px] font-mono"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {observerLocation.latitude.toFixed(4)}°, {observerLocation.longitude.toFixed(4)}°
                    {isManual && " (manual)"}
                  </span>
                  {!isManual && (
                    <button
                      onClick={findPasses}
                      className="ml-auto text-[10px] px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      <RefreshCw className="w-3 h-3 inline" />
                    </button>
                  )}
                </div>
              )}

              {/* Passes list */}
              {passes.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <Satellite className="w-5 h-5" style={{ color: "rgba(255,255,255,0.2)" }} />
                  </div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    No visible passes in the next 48 hours
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Try again later or check a different location
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2.5"
                  >
                    {passes.map((pass, i) => {
                      const rating = getVisibilityRating(pass.maxElevation);
                      const isSoon =
                        pass.startTime - Date.now() / 1000 < 3600;
                      const isNow =
                        pass.startTime <= Date.now() / 1000 &&
                        pass.endTime > Date.now() / 1000;

                      return (
                        <motion.div
                          key={pass.startTime}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="relative rounded-xl p-3.5 transition-all duration-200 hover:scale-[1.01]"
                          style={{
                            background: isNow
                              ? "rgba(34, 211, 238, 0.06)"
                              : isSoon
                              ? "rgba(34, 211, 238, 0.03)"
                              : "rgba(255,255,255,0.02)",
                            border: isNow
                              ? "1px solid rgba(34, 211, 238, 0.2)"
                              : isSoon
                              ? "1px solid rgba(34, 211, 238, 0.1)"
                              : "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          {/* Now indicator */}
                          {isNow && (
                            <div className="absolute -top-1.5 -right-1.5">
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-wider"
                                style={{
                                  background: "rgba(34, 211, 238, 0.15)",
                                  color: "#22d3ee",
                                  border: "1px solid rgba(34, 211, 238, 0.2)",
                                }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                                Now
                              </span>
                            </div>
                          )}

                          {/* Pass time row */}
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-sm font-semibold tabular-nums"
                                  style={{ color: "rgba(255,255,255,0.9)" }}
                                >
                                  {formatPassDate(pass.startTime)}
                                </span>
                                <span
                                  className="text-xs font-mono tabular-nums"
                                  style={{ color: "rgba(255,255,255,0.4)" }}
                                >
                                  {formatPassTime(pass.startTime)} – {formatPassTime(pass.endTime)}
                                </span>
                              </div>
                            </div>
                            <Badge
                              variant="default"
                              className="text-[9px] px-2 py-0.5"
                              style={{
                                background: `${rating.color}15`,
                                color: rating.color,
                                border: `1px solid ${rating.color}30`,
                              }}
                            >
                              {rating.label}
                            </Badge>
                          </div>

                          {/* Pass details row */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <ArrowUp
                                className="w-3.5 h-3.5"
                                style={{ color: "rgba(34, 211, 238, 0.5)" }}
                              />
                              <span
                                className="text-xs font-mono tabular-nums"
                                style={{ color: "rgba(255,255,255,0.6)" }}
                              >
                                {pass.maxElevation}°
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Compass
                                className="w-3.5 h-3.5"
                                style={{ color: "rgba(129, 140, 248, 0.5)" }}
                              />
                              <span
                                className="text-xs font-mono"
                                style={{ color: "rgba(255,255,255,0.6)" }}
                              >
                                {azimuthToDirection(pass.startAzimuth)} →{" "}
                                {azimuthToDirection(pass.endAzimuth)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock
                                className="w-3.5 h-3.5"
                                style={{ color: "rgba(251, 191, 36, 0.5)" }}
                              />
                              <span
                                className="text-xs font-mono"
                                style={{ color: "rgba(255,255,255,0.6)" }}
                              >
                                {formatDuration(pass.duration)}
                              </span>
                            </div>
                          </div>

                          {/* Pass timing bar */}
                          <div
                            className="mt-2 h-1 rounded-full overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((Date.now() / 1000 - pass.startTime) /
                                    (pass.endTime - pass.startTime)) *
                                    100
                                )}%`,
                                background: isNow
                                  ? "linear-gradient(90deg, #22d3ee, #818cf8)"
                                  : "rgba(34, 211, 238, 0.3)",
                              }}
                            />
                          </div>

                          {/* Direction text */}
                          <p
                            className="text-[10px] mt-1.5"
                            style={{ color: "rgba(255,255,255,0.25)" }}
                          >
                            Look{" "}
                            <span style={{ color: "rgba(255,255,255,0.5)" }}>
                              {azimuthToDirection(pass.startAzimuth)}
                            </span>
                            {" at "}
                            <span style={{ color: "rgba(255,255,255,0.5)" }}>
                              {pass.maxElevation}°
                            </span>
                            {" elevation — appears in the "}
                            <span style={{ color: "rgba(255,255,255,0.5)" }}>
                              {azimuthToDirection(pass.startAzimuth)}
                            </span>
                            {" and moves toward the "}
                            <span style={{ color: "rgba(255,255,255,0.5)" }}>
                              {azimuthToDirection(pass.endAzimuth)}
                            </span>
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
