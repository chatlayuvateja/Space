"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Satellite,
  RefreshCw,
  MapPin,
  Activity,
  Orbit,
  Globe,
  Navigation,
  Gauge,
  Layers,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamically import the Leaflet map component (avoids SSR window issues)
const ISSMap = dynamic(() => import("@/components/iss-map"), { ssr: false });

// ---- Types ----
interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
  daynum: number;
  footprint: number;
  visibility: string;
  solar_lat: number;
  solar_lon: number;
}

interface PositionHistory {
  lat: number;
  lng: number;
}

// ---- ISS Orbit Count Calculation ----
const ISS_LAUNCH_JULIAN = 2451143.5; // Nov 20, 1998
const ORBITS_PER_DAY = 15.54; // ISS completes ~15.54 orbits per day

function calculateOrbitCount(daynum: number): number {
  const daysSinceLaunch = daynum - ISS_LAUNCH_JULIAN;
  return Math.floor(daysSinceLaunch * ORBITS_PER_DAY);
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ISSTracker() {
  const [issData, setIssData] = useState<ISSPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [positionHistory, setPositionHistory] = useState<PositionHistory[]>([]);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);

  // ---- Fetch ISS data ----
  const fetchISS = useCallback(async () => {
    try {
      const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      const pos: ISSPosition = {
        latitude: data.latitude,
        longitude: data.longitude,
        altitude: data.altitude,
        velocity: data.velocity,
        timestamp: data.timestamp,
        daynum: data.daynum,
        footprint: data.footprint,
        visibility: data.visibility,
        solar_lat: data.solar_lat,
        solar_lon: data.solar_lon,
      };

      setIssData((prev) => {
        // Add previous position to history for ground track
        if (prev) {
          setPositionHistory((h) => {
            const next = [
              ...h,
              { lat: prev.latitude, lng: prev.longitude },
            ];
            return next.slice(-500); // Keep last 500 positions
          });
        }
        return pos;
      });

      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + poll every 10 seconds
  useEffect(() => {
    fetchISS();
    const interval = setInterval(fetchISS, 10000);
    return () => clearInterval(interval);
  }, [fetchISS]);

  // Time since last update
  useEffect(() => {
    if (!issData) return;
    const interval = setInterval(() => {
      setTimeSinceUpdate(Math.floor(Date.now() / 1000 - issData.timestamp));
    }, 1000);
    return () => clearInterval(interval);
  }, [issData]);

  // ---- Helpers ----
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const getDirection = (lat: number, lng: number) => {
    const latNorm = lat / 90;
    const lngNorm = lng / 180;
    if (Math.abs(latNorm) > Math.abs(lngNorm)) {
      return latNorm > 0 ? "Northbound" : "Southbound";
    }
    return lngNorm > 0 ? "Eastbound" : "Westbound";
  };

  const orbitCount = issData ? calculateOrbitCount(issData.daynum) : 0;

  // Decimated ground track (every 10th point for performance)
  const groundTrackCoords: [number, number][] = positionHistory
    .filter((_, i) => i % 10 === 0)
    .map((p) => [p.lat, p.lng]);

  return (
    <section id="iss" className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4 px-4 py-1.5 text-sm">
            <Satellite className="w-3.5 h-3.5 mr-1.5" />
            Live Tracking
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-space-100 mb-4">
            International Space Station
          </h2>
          <p className="text-space-400 max-w-2xl mx-auto text-lg">
            Real-time position tracking with live telemetry. The ISS orbits Earth
            every ~92 minutes at 28,000 km/h.
          </p>
        </motion.div>

        {/* Map + Telemetry grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map card — spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden p-0">
              <div className="relative">
                {/* Map */}
                <div className="h-[400px] md:h-[500px] w-full bg-space-900 relative">
                  {issData && (
                    <ISSMap
                      latitude={issData.latitude}
                      longitude={issData.longitude}
                      altitude={issData.altitude}
                      velocity={issData.velocity}
                      orbitCount={orbitCount}
                      groundTrack={groundTrackCoords}
                      visibility={issData.visibility}
                    />
                  )}

                  {/* Loading overlay */}
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-space-900/80 z-[1000]">
                      <div className="text-center">
                        <Satellite className="w-10 h-10 text-cosmic-400 animate-bounce mx-auto mb-3" />
                        <p className="text-space-400 text-sm">Acquiring signal...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Map controls overlay */}
                <div className="absolute top-4 left-4 z-[1000] flex gap-2">
                  <Badge variant="secondary" className="text-xs bg-space-900/80 backdrop-blur-md">
                    <Satellite className="w-3 h-3 mr-1" />
                    ISS Position
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-[1000]">
                  {issData && (
                    <Badge
                      variant={
                        issData.visibility === "daylight"
                          ? "warning"
                          : "default"
                      }
                      className="text-xs bg-space-900/80 backdrop-blur-md"
                    >
                      <Layers className="w-3 h-3 mr-1" />
                      {issData.visibility === "daylight" ? "Daylight" : "Eclipsed"}
                    </Badge>
                  )}
                </div>

                {/* Refresh button */}
                <div className="absolute bottom-4 right-4 z-[1000]">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={fetchISS}
                    disabled={loading}
                    className="w-9 h-9 rounded-full bg-space-900/80 backdrop-blur-md text-space-300 hover:text-space-100"
                  >
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                  </Button>
                </div>

                {/* Map info footer */}
                <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2 text-[10px] text-space-500 bg-space-900/60 backdrop-blur-sm px-2 py-1 rounded-md">
                  <Navigation className="w-3 h-3" />
                  Updated every 10s &middot; Drag to explore
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Telemetry panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Main telemetry card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Telemetry Data</CardTitle>
                  <span className="text-[10px] text-space-500">
                    {timeSinceUpdate > 0
                      ? `${formatTime(timeSinceUpdate)} ago`
                      : "Live"}
                  </span>
                </div>
                <CardDescription>
                  {loading
                    ? "Acquiring signal..."
                    : error
                    ? "Signal lost"
                    : "Real-time orbital telemetry"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="text-center py-6">
                    <Satellite className="w-10 h-10 mx-auto mb-3 text-space-500" />
                    <p className="text-sm text-space-400 mb-4">
                      Unable to reach the ISS. Retrying...
                    </p>
                    <Button variant="glow" size="sm" onClick={fetchISS}>
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Latitude */}
                    <div className="glass rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-[11px] text-space-400">
                          <MapPin className="w-3 h-3" />
                          Latitude
                        </span>
                        <span className="text-[10px] text-space-500">
                          {issData?.latitude.toFixed(4)}°
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-space-100">
                          {issData?.latitude.toFixed(2)}°
                        </span>
                        <span className="text-xs text-space-500">
                          {issData && issData.latitude > 0 ? "N" : "S"}
                        </span>
                      </div>
                    </div>

                    {/* Longitude */}
                    <div className="glass rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-[11px] text-space-400">
                          <Globe className="w-3 h-3" />
                          Longitude
                        </span>
                        <span className="text-[10px] text-space-500">
                          {issData?.longitude.toFixed(4)}°
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-space-100">
                          {issData?.longitude.toFixed(2)}°
                        </span>
                        <span className="text-xs text-space-500">
                          {issData && issData.longitude > 0 ? "E" : "W"}
                        </span>
                      </div>
                    </div>

                    {/* Altitude + Velocity in a row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass rounded-xl p-3.5">
                        <span className="flex items-center gap-1.5 text-[11px] text-space-400 mb-1">
                          <Activity className="w-3 h-3" />
                          Altitude
                        </span>
                        <div className="text-lg font-bold text-space-100">
                          {issData?.altitude.toFixed(0)}
                          <span className="text-xs font-normal text-space-500 ml-1">km</span>
                        </div>
                      </div>
                      <div className="glass rounded-xl p-3.5">
                        <span className="flex items-center gap-1.5 text-[11px] text-space-400 mb-1">
                          <Gauge className="w-3 h-3" />
                          Velocity
                        </span>
                        <div className="text-lg font-bold text-space-100">
                          {issData?.velocity.toFixed(0)}
                          <span className="text-xs font-normal text-space-500 ml-1">km/h</span>
                        </div>
                      </div>
                    </div>

                    {/* Orbit Count */}
                    <div className="glass rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-[11px] text-space-400">
                          <Orbit className="w-3 h-3" />
                          Orbital Passes
                        </span>
                        <span className="text-[10px] text-space-500">Since launch</span>
                      </div>
                      <div className="text-2xl font-bold text-space-100">
                        #{orbitCount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick stats */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xs text-space-400 mb-1">Direction</div>
                    <div className="text-sm font-semibold text-space-100">
                      {issData
                        ? getDirection(issData.latitude, issData.longitude)
                        : "—"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-space-400 mb-1">Footprint</div>
                    <div className="text-sm font-semibold text-space-100">
                      {issData
                        ? `${(issData.footprint / 1000).toFixed(0)} km`
                        : "—"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-space-400 mb-1">Crew</div>
                    <div className="text-sm font-semibold text-space-100">7</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-space-400 mb-1">Visibility</div>
                    <div className="text-sm font-semibold text-space-100 capitalize">
                      {issData?.visibility ?? "—"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info cards row */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {[
            {
              icon: Orbit,
              title: "Orbit Period",
              value: "~92.68 min",
              desc: "16 sunrises & sunsets daily",
            },
            {
              icon: Satellite,
              title: "Orbit Altitude",
              value: "~408 km",
              desc: "Low Earth Orbit",
            },
            {
              icon: Gauge,
              title: "Orbital Speed",
              value: "~28,000 km/h",
              desc: "~7.66 km per second",
            },
            {
              icon: Users,
              title: "Crew Capacity",
              value: "7 Astronauts",
              desc: "International collaboration",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            >
              <Card>
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="w-10 h-10 rounded-full bg-cosmic-500/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-cosmic-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-space-400 mb-0.5">{item.title}</div>
                    <div className="text-lg font-bold text-space-100">{item.value}</div>
                    <div className="text-xs text-space-500 mt-0.5">{item.desc}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
