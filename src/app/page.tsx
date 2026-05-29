"use client";

import Navbar from "@/components/navigation/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import ISSTracker from "@/components/iss-tracker/ISSTracker";
import LaunchDashboard from "@/components/launches/LaunchDashboard";
import APODSection from "@/components/apod/APODSection";
import SpaceNewsSection from "@/components/news/SpaceNewsSection";
import LiveStatsBar from "@/components/stats-bar/LiveStatsBar";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative z-10 pb-9">
        <HeroSection />

        {/* Section dividers with gradient */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(34,211,238,0.15)] to-transparent" />
          <ISSTracker />
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(129,140,248,0.15)] to-transparent" />
          <LaunchDashboard />
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(52,211,153,0.15)] to-transparent" />
          <APODSection />
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(168,85,247,0.15)] to-transparent" />
          <SpaceNewsSection />
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(251,191,36,0.15)] to-transparent" />
          <Footer />
        </div>
      </main>

      <LiveStatsBar />
    </>
  );
}
