"use client";

import { motion } from "framer-motion";
import StarBackground from "@/components/star-background";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ISSTracker from "@/components/iss-tracker";
import UpcomingLaunches from "@/components/upcoming-launches";
import NasaApod from "@/components/nasa-apod";
import SpaceNews from "@/components/space-news";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <StarBackground />
      <Navigation />

      <main className="relative z-10">
        <HeroSection />

        {/* Section dividers with gradient */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cosmic-500/30 to-transparent" />
          <ISSTracker />
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nebula-500/30 to-transparent" />
          <UpcomingLaunches />
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-aurora-500/30 to-transparent" />
          <NasaApod />
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nebula-500/30 to-transparent" />
          <SpaceNews />
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cosmic-500/30 to-transparent" />
          <Footer />
        </div>
      </main>

      {/* Credits overlay */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="glass-strong rounded-full px-3 py-1.5 text-[10px] text-space-500"
        >
          Powered by{" "}
          <a
            href="https://api.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cosmic-400 hover:text-cosmic-300 transition-colors"
          >
            NASA APIs
          </a>
        </motion.div>
      </div>
    </>
  );
}
