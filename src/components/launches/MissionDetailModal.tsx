"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Rocket,
  Building2,
  MapPin,
  Globe,
  Info,
  Calendar,
  Film,
  Orbit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LaunchStatusBadge from "./LaunchStatusBadge";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { Launch } from "@/types/launches";
import { COUNTRY_FLAGS } from "@/types/launches";

interface MissionDetailModalProps {
  launch: Launch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MissionDetailModal({
  launch,
  open,
  onOpenChange,
}: MissionDetailModalProps) {
  // Save scroll position on open, restore on close
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !launch) return null;

  const imageUrl =
    launch.image || launch.rocket?.configuration?.image_url || null;

  const agencyName = launch.launch_service_provider?.name ?? "Unknown";
  const agencyType = launch.launch_service_provider?.type ?? null;
  const rocketName = launch.rocket?.configuration?.name ?? "Unknown";
  const rocketFamily = launch.rocket?.configuration?.family ?? null;
  const missionName = launch.mission?.name ?? null;
  const missionDesc = launch.mission?.description ?? null;
  const orbitName = launch.mission?.orbit?.name ?? null;
  const missionType = launch.mission?.type ?? null;
  const padName = launch.pad?.name ?? "Unknown";
  const locationName = launch.pad?.location?.name ?? "Unknown";
  const countryCode = launch.pad?.location?.country_code ?? null;
  const flag = countryCode ? COUNTRY_FLAGS[countryCode] ?? "🚀" : "🚀";
  const infoURLs = launch.infoURLs ?? [];
  const vidURLs = launch.vidURLs ?? [];
  const launchDate = new Date(launch.net);

  const isYouTube = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const getYouTubeEmbed = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Content */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6",
                  "max-md:items-end"
                )}
              >
                <div
                  className={cn(
                    "relative w-full max-w-2xl max-h-screen md:max-h-[90vh] overflow-y-auto",
                    "bg-surface-1 border border-white/10",
                    "max-md:rounded-t-2xl max-md:max-h-[92vh]",
                    "md:rounded-2xl md:shadow-2xl"
                  )}
                >
                  {/* Close button */}
                  <Dialog.Close asChild>
                    <button className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-surface-1/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>

                  {/* Header image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={launch.name}
                        sizes="(max-width: 768px) 100vw, 672px"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 flex items-center justify-center">
                        <Rocket className="w-16 h-16 text-text-muted" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/50 to-transparent" />

                    {/* Status badge on image */}
                    <div className="absolute bottom-4 left-4">
                      <LaunchStatusBadge
                        status={launch.status?.name ?? "Unknown"}
                        abbrev={launch.status?.abbrev}
                      />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-6">
                    {/* Mission name + date */}
                    <div>
                      <Dialog.Title className="text-xl md:text-2xl font-bold text-text-primary mb-1">
                        {launch.name}
                      </Dialog.Title>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Calendar className="w-3.5 h-3.5" />
                        {launchDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZoneName: "short",
                        })}
                      </div>
                    </div>

                    {/* Mission description */}
                    {missionDesc && (
                      <div>
                        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2">
                          <Info className="w-3 h-3 inline mr-1" />
                          Mission
                        </h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {missionDesc}
                        </p>
                      </div>
                    )}

                    {/* Specs grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {missionName && (
                        <div className="glass rounded-xl p-3">
                          <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">
                            Mission
                          </span>
                          <span className="text-sm font-semibold text-text-primary">
                            {missionName}
                          </span>
                        </div>
                      )}
                      {agencyName && (
                        <div className="glass rounded-xl p-3">
                          <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">
                            <Building2 className="w-3 h-3 inline mr-1" />
                            Agency
                          </span>
                          <span className="text-sm font-semibold text-text-primary">
                            {agencyName}
                          </span>
                          {agencyType && (
                            <span className="block text-[10px] text-text-muted mt-0.5">
                              {agencyType}
                            </span>
                          )}
                        </div>
                      )}
                      {rocketName && (
                        <div className="glass rounded-xl p-3">
                          <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">
                            <Rocket className="w-3 h-3 inline mr-1" />
                            Rocket
                          </span>
                          <span className="text-sm font-semibold text-text-primary">
                            {rocketName}
                          </span>
                          {rocketFamily && (
                            <span className="block text-[10px] text-text-muted mt-0.5">
                              {rocketFamily}
                            </span>
                          )}
                        </div>
                      )}
                      {orbitName && (
                        <div className="glass rounded-xl p-3">
                          <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">
                            <Orbit className="w-3 h-3 inline mr-1" />
                            Orbit
                          </span>
                          <span className="text-sm font-semibold text-accent-cyan">
                            {orbitName}
                          </span>
                          {missionType && (
                            <span className="block text-[10px] text-text-muted mt-0.5">
                              {missionType}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Launch pad */}
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-accent-cyan" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1">
                            Launch Site {flag}
                          </h4>
                          <p className="text-sm text-text-primary">{padName}</p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {locationName}
                            {countryCode && ` · ${countryCode}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Info URLs */}
                    {infoURLs.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
                          <Globe className="w-3 h-3 inline mr-1" />
                          Resources
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {infoURLs.map((url, i) => (
                            <Button key={i} variant="glow" size="sm" asChild>
                              <a
                                href={url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {url.title || `Resource ${i + 1}`}
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Video embed */}
                    {vidURLs.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
                          <Film className="w-3 h-3 inline mr-1" />
                          Videos
                        </h4>
                        <div className="space-y-3">
                          {vidURLs.map((vid, i) => {
                            const embedUrl = isYouTube(vid.url)
                              ? getYouTubeEmbed(vid.url)
                              : null;
                            if (embedUrl) {
                              return (
                                <div
                                  key={i}
                                  className="aspect-video rounded-xl overflow-hidden bg-background"
                                >
                                  <iframe
                                    src={embedUrl}
                                    title={vid.title || `Video ${i + 1}`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              );
                            }
                            return (
                              <Button
                                key={i}
                                variant="glow"
                                size="sm"
                                asChild
                              >
                                <a
                                  href={vid.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                <Film className="w-3 h-3" />
                                {vid.title || `Video ${i + 1}`}
                                </a>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
