"use client";

import { motion } from "framer-motion";
import { ChevronDown, Satellite, Play } from "lucide-react";
import StarField from "./StarField";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const fadeScale = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-svh flex items-center justify-center overflow-hidden"
    >
      {/* BACKGROUND: Fullscreen video — swap hero-bg.mp4 with a different file to change */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080b14]/80 via-[#080b14]/60 to-[#080b14]/85" />

      {/* Star field background */}
      <StarField />

      {/* Deep space gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_60%)]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.08)_0%,transparent_50%)]" />
        <div className="absolute top-2/3 left-1/2 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.06)_0%,transparent_50%)]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.div variants={fadeSlideUp} className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            Real-Time Space Intelligence
          </div>
        </motion.div>

        {/* H1 */}
        <motion.h1
          variants={fadeSlideUp}
          className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] font-bold font-display tracking-tight text-text-primary mb-6"
        >
          Track the{" "}
          <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
            Universe.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeSlideUp}
          className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed"
        >
          Real-time ISS tracking, upcoming rocket launches, NASA&apos;s Astronomy
          Picture of the Day, and the latest space news — all in one place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeScale}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
        >
          <button
            onClick={() => scrollTo("#iss")}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-[#080b14] bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-accent-cyan/20"
          >
            <Satellite className="w-4 h-4" />
            Explore Dashboard
          </button>
          <button
            onClick={() => scrollTo("#iss")}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl text-text-primary border border-[rgba(255,255,255,0.1)] hover:bg-white/5 active:scale-[0.97] transition-all duration-200"
          >
            <Play className="w-4 h-4" />
            Watch ISS Live
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.5 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        }}
        onClick={() => scrollTo("#iss")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted hover:text-text-secondary transition-colors z-10"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.button>
    </section>
  );
}
