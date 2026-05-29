"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, AlertTriangle, RefreshCw, Satellite } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FeaturedLaunch from "./FeaturedLaunch";
import LaunchCard from "./LaunchCard";
import LaunchFilters from "./LaunchFilters";
import MissionDetailModal from "./MissionDetailModal";
import LaunchCardSkeleton from "./LaunchCardSkeleton";
import { useLaunchesContext } from "@/contexts/LaunchesContext";
import type { Launch, LaunchTab, LaunchFilter, SortMode } from "@/types/launches";
import { cn } from "@/lib/utils";

// ---- Helpers ----
function isCrewed(launch: Launch): boolean {
  const name = (launch.name ?? "").toLowerCase();
  const desc = (launch.mission?.description ?? "").toLowerCase();
  const missionName = (launch.mission?.name ?? "").toLowerCase();
  return (
    name.includes("crew") ||
    name.includes("dragon") ||
    name.includes("starliner") ||
    desc.includes("crew") ||
    missionName.includes("crew")
  );
}

function isCargo(launch: Launch): boolean {
  const name = (launch.name ?? "").toLowerCase();
  const type = (launch.mission?.type ?? "").toLowerCase();
  const desc = (launch.mission?.description ?? "").toLowerCase();
  return (
    name.includes("cargo") ||
    name.includes("starlink") ||
    name.includes("resupply") ||
    type.includes("cargo") ||
    type.includes("resupply")
  );
}

function applyFilter(launches: Launch[], filter: LaunchFilter): Launch[] {
  if (filter === "all") return launches;
  return launches.filter((l) => {
    switch (filter) {
      case "crewed":
        return isCrewed(l);
      case "cargo":
        return isCargo(l);
      case "commercial":
        return l.launch_service_provider?.type === "Commercial";
      case "government":
        return (
          l.launch_service_provider?.type === "Government" ||
          l.launch_service_provider?.type === "Multinational"
        );
      default:
        return true;
    }
  });
}

function applySort(launches: Launch[], sort: SortMode): Launch[] {
  const sorted = [...launches];
  switch (sort) {
    case "date":
      return sorted.sort(
        (a, b) => new Date(a.net).getTime() - new Date(b.net).getTime()
      );
    case "agency":
      return sorted.sort((a, b) => {
        const nameA = a.launch_service_provider?.name ?? "";
        const nameB = b.launch_service_provider?.name ?? "";
        return nameA.localeCompare(nameB);
      });
    default:
      return sorted;
  }
}

// ---- Error Card ----
function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <p className="text-lg text-text-secondary mb-2">Failed to load launches</p>
      <p className="text-sm text-text-muted mb-6 max-w-md">{message}</p>
      <Button variant="glow" onClick={onRetry}>
        <RefreshCw className="w-4 h-4" />
        Retry
      </Button>
    </div>
  );
}

// ---- Empty State ----
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <Satellite className="w-16 h-16 text-text-muted mb-4" />
      <p className="text-lg text-text-secondary mb-1">No upcoming launches found</p>
      <p className="text-sm text-text-muted">
        Check back soon for new mission schedules.
      </p>
    </div>
  );
}

// ---- Main Component ----
export default function LaunchDashboard() {
  const { upcoming, previous, loading, error, rateLimited, refresh } =
    useLaunchesContext();

  const [tab, setTab] = useState<LaunchTab>("upcoming");
  const [filter, setFilter] = useState<LaunchFilter>("all");
  const [sort, setSort] = useState<SortMode>("date");
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelect = useCallback((launch: Launch) => {
    setSelectedLaunch(launch);
    setModalOpen(true);
  }, []);

  // Derive the displayed launches
  const rawLaunches = tab === "upcoming" ? upcoming : previous;
  const filtered = useMemo(
    () => applyFilter(rawLaunches, filter),
    [rawLaunches, filter]
  );
  const displayed = useMemo(
    () => applySort(filtered, sort),
    [filtered, sort]
  );

  // The very next launch gets the featured treatment (only upcoming tab)
  const featuredLaunch = useMemo(() => {
    if (tab !== "upcoming" || loading || upcoming.length === 0) return null;
    const sorted = [...upcoming].sort(
      (a, b) => new Date(a.net).getTime() - new Date(b.net).getTime()
    );
    return sorted[0];
  }, [upcoming, tab, loading]);

  // Count how many items match each filter
  const totalCount = rawLaunches.length;

  return (
    <section id="launches" className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="default" className="mb-4 px-4 py-1.5 text-sm">
            <Rocket className="w-3.5 h-3.5 mr-1.5" />
            Launch Schedule
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-2 font-mono uppercase tracking-wider">
            Launch Manifest
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Next missions to orbit and beyond
          </p>
        </motion.div>

        {/* Filters */}
        <LaunchFilters
          tab={tab}
          filter={filter}
          sort={sort}
          onTabChange={setTab}
          onFilterChange={setFilter}
          onSortChange={setSort}
          className="mb-10"
        />

        {/* Rate limit toast */}
        <AnimatePresence>
          {rateLimited && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2 mb-6 py-2 px-4 rounded-lg bg-accent-amber/10 border border-accent-amber/20 text-accent-amber text-sm"
            >
              <AlertTriangle className="w-4 h-4" />
              Rate limited. Showing cached data.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content area */}
        {loading && upcoming.length === 0 && previous.length === 0 ? (
          /* Loading state */
          <div className="space-y-8">
            <LaunchCardSkeleton featured />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <LaunchCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : error && upcoming.length === 0 && previous.length === 0 ? (
          /* Error state - no cached data */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <ErrorCard message={error} onRetry={refresh} />
          </div>
        ) : (
          <>
            {/* Featured launch */}
            {featuredLaunch && (
              <div className="mb-8">
                <FeaturedLaunch
                  launch={featuredLaunch}
                  onSelect={handleSelect}
                />
              </div>
            )}

            {/* Launch cards grid */}
            {totalCount > 0 && displayed.length === 0 ? (
              <EmptyState />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${tab}-${filter}-${sort}`}
                  initial={{ opacity: 0, x: tab === "upcoming" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: tab === "upcoming" ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {displayed.map((launch, i) => (
                    <LaunchCard
                      key={launch.id}
                      launch={launch}
                      index={
                        featuredLaunch && launch.id === featuredLaunch.id
                          ? -1
                          : i
                      }
                      onSelect={handleSelect}
                      isPrevious={tab === "previous"}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </>
        )}
      </div>

      {/* Mission detail modal */}
      <MissionDetailModal
        launch={selectedLaunch}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
}
