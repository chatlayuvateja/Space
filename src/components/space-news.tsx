"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, ExternalLink, ArrowRight, Clock, TrendingUp } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
}

const fallbackNews: NewsArticle[] = [
  {
    id: "n1",
    title: "JWST Discovers Most Distant Galaxy Ever Observed",
    summary:
      "The James Webb Space Telescope has broken its own record by detecting a galaxy that existed just 250 million years after the Big Bang, offering unprecedented insights into the early universe.",
    url: "https://www.nasa.gov/webb",
    source: "NASA",
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    imageUrl: "",
    category: "Discovery",
  },
  {
    id: "n2",
    title: "SpaceX Starship Completes Successful Orbital Test Flight",
    summary:
      "SpaceX's Starship achieved its first fully successful orbital test flight, marking a major milestone in the development of the world's most powerful rocket system for deep space exploration.",
    url: "https://www.spacex.com",
    source: "SpaceX",
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    imageUrl: "",
    category: "Spaceflight",
  },
  {
    id: "n3",
    title: "Artemis III: NASA Selects Landing Sites Near Lunar South Pole",
    summary:
      "NASA has identified 13 candidate landing regions near the lunar south pole for the Artemis III mission, which will return humans to the Moon for the first time in over 50 years.",
    url: "https://www.nasa.gov/artemis",
    source: "NASA",
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    imageUrl: "",
    category: "Exploration",
  },
  {
    id: "n4",
    title: "ESA's Euclid Telescope Maps Dark Matter in Unprecedented Detail",
    summary:
      "The European Space Agency's Euclid mission has released its first stunning images revealing the distribution of dark matter across vast regions of the cosmos, providing new clues about the universe's hidden structure.",
    url: "https://www.esa.int/Science_Exploration/Space_Science/Euclid",
    source: "ESA",
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    imageUrl: "",
    category: "Science",
  },
  {
    id: "n5",
    title: "China's Tiangong Space Station Welcomes New Crew Module",
    summary:
      "China successfully docked a new science module to its Tiangong space station, expanding the orbital laboratory's capabilities for international research collaborations.",
    url: "https://www.cnsa.gov.cn",
    source: "CNSA",
    publishedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    imageUrl: "",
    category: "Space Station",
  },
  {
    id: "n6",
    title: "Polaris Dawn Mission: First Commercial Spacewalk Planned",
    summary:
      "The Polaris Dawn mission aims to conduct the first-ever commercial spacewalk using SpaceX's Crew Dragon, pushing the boundaries of private spaceflight capabilities.",
    url: "https://www.polarisprogram.com",
    source: "Polaris Program",
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    imageUrl: "",
    category: "Commercial",
  },
];

export default function SpaceNews() {
  const [news, setNews] = useState<NewsArticle[]>(fallbackNews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          "https://api.spaceflightnewsapi.net/v4/articles/?limit=6&ordering=-published_at"
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.results?.length) {
            const mapped = data.results.map((a: any) => ({
              id: String(a.id),
              title: a.title,
              summary: a.summary || "No summary available",
              url: a.url,
              source: a.news_site || "Space News",
              publishedAt: a.published_at,
              imageUrl: a.image_url || "",
              category: a.news_site || "Space",
            }));
            setNews(mapped.slice(0, 6));
          }
        }
      } catch {
        // Fallback data already set
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const getTimeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Category-based gradients
  const getCategoryGradient = (cat: string) => {
    const gradients: Record<string, string> = {
      Discovery: "from-aurora-500/20 to-cosmic-500/20",
      Spaceflight: "from-stellar-500/20 to-cosmic-500/20",
      Exploration: "from-cosmic-500/20 to-nebula-500/20",
      Science: "from-nebula-500/20 to-aurora-500/20",
      "Space Station": "from-aurora-500/20 to-stellar-500/20",
      Commercial: "from-cosmic-500/20 to-aurora-500/20",
    };
    return gradients[cat] || "from-cosmic-500/20 to-nebula-500/20";
  };

  return (
    <section id="news" className="relative py-24 md:py-32 px-6">
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
            <Newspaper className="w-3.5 h-3.5 mr-1.5" />
            Latest from Space
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-space-100 mb-4">
            Space News
          </h2>
          <p className="text-space-400 max-w-2xl mx-auto text-lg">
            Stay up to date with the latest discoveries, missions, and
            breakthroughs from space agencies and private companies worldwide.
          </p>
        </motion.div>

        {/* News grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-space-800/50" />
                  <CardHeader>
                    <div className="h-3 bg-white/5 rounded w-16 mb-2" />
                    <div className="h-4 bg-white/10 rounded w-full mb-2" />
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-white/5 rounded w-full mb-1" />
                    <div className="h-3 bg-white/5 rounded w-5/6" />
                  </CardContent>
                </Card>
              ))
            : news.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Card className="group h-full flex flex-col overflow-hidden">
                    {/* Image placeholder with gradient */}
                    <div
                      className={`h-40 bg-gradient-to-br ${getCategoryGradient(
                        article.category
                      )} relative overflow-hidden`}
                    >
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-space-900/60 to-transparent" />

                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                          {article.category}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <div className="flex items-center gap-2 text-xs text-space-500 mb-1">
                        <span>{article.source}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(article.publishedAt)}
                        </span>
                      </div>
                      <CardTitle className="text-sm leading-snug line-clamp-2 group-hover:text-cosmic-300 transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-xs text-space-400 leading-relaxed line-clamp-3 mb-4">
                        {article.summary}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="self-start text-xs group/btn"
                      >
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Read more
                          <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
              href="https://www.space.com/news"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TrendingUp className="w-4 h-4" />
              More Space News
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
