"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Launch {
  id: string;
  name: string;
  windowStart: string;
  provider: string;
  vehicle: string;
  location: string;
  mission: string;
  status: string;
  pad: string;
}

const fallbackLaunches: Launch[] = [
  {
    id: "1",
    name: "Falcon 9 • Starlink 12-3",
    windowStart: new Date(Date.now() + 86400000 * 2).toISOString(),
    provider: "SpaceX",
    vehicle: "Falcon 9 Block 5",
    location: "Cape Canaveral, FL, USA",
    mission: "Starlink 12-3: 23 satellites to LEO",
    status: "Go",
    pad: "LC-39A, Kennedy Space Center",
  },
  {
    id: "2",
    name: "Proton-M • Yamal-501",
    windowStart: new Date(Date.now() + 86400000 * 5).toISOString(),
    provider: "Roscosmos",
    vehicle: "Proton-M",
    location: "Baikonur, Kazakhstan",
    mission: "Yamal-501 communications satellite to GEO",
    status: "TBD",
    pad: "Site 81/24, Baikonur Cosmodrome",
  },
  {
    id: "3",
    name: "Ariane 6 • CSO-3",
    windowStart: new Date(Date.now() + 86400000 * 9).toISOString(),
    provider: "Arianespace",
    vehicle: "Ariane 62",
    location: "Kourou, French Guiana",
    mission: "CSO-3 military reconnaissance satellite",
    status: "Go",
    pad: "ELA-4, Guiana Space Centre",
  },
  {
    id: "4",
    name: "Falcon Heavy • Europa Clipper",
    windowStart: new Date(Date.now() + 86400000 * 14).toISOString(),
    provider: "SpaceX",
    vehicle: "Falcon Heavy",
    location: "Cape Canaveral, FL, USA",
    mission: "NASA Europa Clipper mission to Jupiter's moon",
    status: "Go",
    pad: "LC-39A, Kennedy Space Center",
  },
  {
    id: "5",
    name: "Electron • SunSync Rideshare",
    windowStart: new Date(Date.now() + 86400000 * 20).toISOString(),
    provider: "Rocket Lab",
    vehicle: "Electron",
    location: "Mahia, New Zealand",
    mission: "Rideshare mission to sun-synchronous orbit",
    status: "Go",
    pad: "Launch Complex 1, Mahia Peninsula",
  },
  {
    id: "6",
    name: "New Glenn • Blue Ring",
    windowStart: new Date(Date.now() + 86400000 * 30).toISOString(),
    provider: "Blue Origin",
    vehicle: "New Glenn",
    location: "Cape Canaveral, FL, USA",
    mission: "Blue Ring orbital transfer vehicle demo",
    status: "TBD",
    pad: "LC-36, Cape Canaveral SFS",
  },
];

export default function UpcomingLaunches() {
  const [launches, setLaunches] = useState<Launch[]>(fallbackLaunches);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const res = await fetch("https://fdo.rocketlaunch.live/json/launches/next/10");
        if (res.ok) {
          const data = await res.json();
          if (data?.result?.length) {
            const mapped = data.result.map((l: any) => ({
              id: l.id,
              name: l.name,
              windowStart: l.window_start,
              provider: l.provider?.name ?? "Unknown",
              vehicle: l.vehicle?.name ?? l.name,
              location: l.location?.name ?? "Unknown",
              mission: l.mission_description ?? "No mission details",
              status: l.status?.name ?? "TBD",
              pad: l.pad?.name ?? "",
            }));
            setLaunches(mapped.slice(0, 6));
          }
        }
      } catch {
        // Fallback data already loaded
      } finally {
        setLoading(false);
      }
    };
    fetchLaunches();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeRemaining = (iso: string) => {
    const diff = new Date(iso).getTime() - Date.now();
    if (diff < 0) return "Launched";
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <section id="launches" className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="nebula" className="mb-4 px-4 py-1.5 text-sm">
            <Rocket className="w-3.5 h-3.5 mr-1.5" />
            Launch Schedule
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-space-100 mb-4">
            Upcoming Launches
          </h2>
          <p className="text-space-400 max-w-2xl mx-auto text-lg">
            Track the next missions to space from providers around the world.
            Dates are subject to change.
          </p>
        </motion.div>

        {/* Launches timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cosmic-500/40 via-nebula-500/40 to-transparent" />

          <div className="space-y-8">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative pl-16 md:pl-0 md:even:pl-[50%] md:odd:pr-[50%] md:pr-16"
                  >
                    <div className="glass-card rounded-2xl p-6 animate-pulse">
                      <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
                      <div className="h-3 bg-white/5 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-white/5 rounded w-2/3" />
                    </div>
                  </div>
                ))
              : launches.map((launch, i) => (
                  <motion.div
                    key={launch.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative pl-16 md:pl-0 ${
                      i % 2 === 0
                        ? "md:pr-[50%] md:pr-16 md:text-right"
                        : "md:pl-[50%] md:pl-16"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-6 md:left-1/2 top-8 w-3 h-3 rounded-full bg-cosmic-500 border-2 border-space-900 -translate-x-1/2 z-10" />

                    {/* Date badge */}
                    <div
                      className={`text-xs text-cosmic-400 mb-2 flex items-center gap-1.5 ${
                        i % 2 === 0 ? "md:justify-end" : ""
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      {formatDate(launch.windowStart)}
                    </div>

                    <Card
                      className={cn(
                        "relative overflow-hidden",
                        i % 2 === 0 ? "md:mr-8" : "md:ml-8"
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant={
                              launch.status === "Go"
                                ? "success"
                                : launch.status === "TBD"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {launch.status === "Go" ? "Confirmed" : launch.status}
                          </Badge>
                          <span className="text-xs text-space-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            T-{getTimeRemaining(launch.windowStart)}
                          </span>
                        </div>
                        <CardTitle className="text-base md:text-lg">
                          {launch.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Rocket className="w-3 h-3" />
                          {launch.provider} • {launch.vehicle}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-space-400 mb-3">
                          {launch.mission}
                        </p>
                        <div className="flex items-start gap-2 text-xs text-space-500">
                          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                          <span>{launch.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="glow" size="lg" asChild>
            <a
              href="https://www.spacex.com/launches/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Rocket className="w-4 h-4" />
              View All Launches
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
