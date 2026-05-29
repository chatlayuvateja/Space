"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Image, CalendarDays, Expand, ExternalLink, Loader2 } from "lucide-react";

interface APODData {
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  date: string;
  copyright: string;
  media_type: string;
}

const fallbackApod: APODData = {
  title: "The Pillars of Creation",
  explanation:
    "The Pillars of Creation are a stunning region of star formation in the Eagle Nebula, captured in exquisite detail by the James Webb Space Telescope. These towering columns of gas and dust stretch for light-years and serve as cosmic nurseries where new stars are born. The near-infrared view reveals previously hidden protostars emerging from the dense cloud structures, offering unprecedented insight into the process of stellar formation.",
  url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/1280px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg",
  hdurl: "https://upload.wikimedia.org/wikipedia/commons/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg",
  date: new Date().toISOString().split("T")[0],
  copyright: "NASA, ESA, CSA, STScI",
  media_type: "image",
};

export default function NasaApod() {
  const [apod, setApod] = useState<APODData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        // Try NASA API with demo key first
        const res = await fetch(
          "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
        );
        if (res.ok) {
          const data = await res.json();
          setApod({
            title: data.title,
            explanation: data.explanation,
            url: data.url,
            hdurl: data.hdurl || data.url,
            date: data.date,
            copyright: data.copyright || "NASA",
            media_type: data.media_type,
          });
        } else {
          setApod(fallbackApod);
        }
      } catch {
        setApod(fallbackApod);
      } finally {
        setLoading(false);
      }
    };
    fetchApod();
  }, []);

  return (
    <section id="apod" className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="aurora" className="mb-4 px-4 py-1.5 text-sm">
            <Globe className="w-3.5 h-3.5 mr-1.5" />
            NASA Astronomy Picture of the Day
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-space-100 mb-4">
            Cosmic Gallery
          </h2>
          <p className="text-space-400 max-w-2xl mx-auto text-lg">
            Each day NASA releases a new image or photograph of our fascinating
            universe, accompanied by a brief explanation from an astronomer.
          </p>
        </motion.div>

        {/* APOD Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image side */}
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[500px] overflow-hidden group">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-space-800/50">
                    <Loader2 className="w-8 h-8 text-cosmic-400 animate-spin" />
                  </div>
                ) : (
                  <>
                    <AnimatePresence mode="wait">
                      {apod && !imageError && (
                        <motion.img
                          key={apod.url}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.7 }}
                          src={apod.url}
                          alt={apod.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      )}
                    </AnimatePresence>

                    {imageError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-space-800 to-space-900 text-space-400">
                        <Image className="w-12 h-12 mb-3 opacity-50" />
                        <p className="text-sm">Image temporarily unavailable</p>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-space-900/80 via-transparent to-transparent md:bg-gradient-to-r md:from-space-900/80 md:via-transparent md:to-transparent" />

                    {/* Image controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {apod?.date}
                      </Badge>
                      {apod?.hdurl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="w-8 h-8 rounded-full glass-strong text-space-200 hover:text-space-100"
                        >
                          <a href={apod.hdurl} target="_blank" rel="noopener noreferrer">
                            <Expand className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Content side */}
              <div className="p-6 md:p-8 flex flex-col">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl md:text-2xl leading-tight">
                        {loading ? "Loading..." : apod?.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {apod?.date}
                          {apod?.copyright && (
                            <span className="ml-2 text-space-500">
                              © {apod.copyright}
                            </span>
                          )}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 flex-1">
                  <div className="relative">
                    <p
                      className={`text-sm text-space-400 leading-relaxed ${
                        !expanded ? "line-clamp-[8] md:line-clamp-[12]" : ""
                      }`}
                    >
                      {loading
                        ? "Fetching today's cosmic wonder..."
                        : apod?.explanation}
                    </p>
                    {!loading && apod && apod.explanation.length > 300 && (
                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-cosmic-400 hover:text-cosmic-300 text-sm mt-2 transition-colors"
                      >
                        {expanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </CardContent>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <Button variant="glow" size="sm" asChild className="w-full sm:w-auto">
                    <a
                      href="https://apod.nasa.gov/apod/astropix.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View on NASA APOD
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
