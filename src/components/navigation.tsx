"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Satellite,
  Rocket,
  Globe,
  Newspaper,
  Sparkles,
} from "lucide-react";

const navLinks = [
  { href: "#hero", label: "Home", icon: Sparkles },
  { href: "#iss", label: "ISS Tracker", icon: Satellite },
  { href: "#launches", label: "Launches", icon: Rocket },
  { href: "#apod", label: "APOD", icon: Globe },
  { href: "#news", label: "News", icon: Newspaper },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass border-b border-white/5 shadow-lg shadow-black/10"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16 md:h-20">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-500 to-nebula-500 flex items-center justify-center shadow-lg shadow-cosmic-500/25">
                <Satellite className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-cosmic-500/20 to-nebula-500/20 blur-lg group-hover:from-cosmic-500/40 group-hover:to-nebula-500/40 transition-all duration-500" />
            </div>
            <span className="font-bold text-lg text-space-100 hidden sm:block">
              Space<span className="gradient-text">Explore</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-space-300 hover:text-space-100 rounded-full hover:bg-white/5 transition-all duration-300"
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </button>
            ))}
            <Button size="sm" className="ml-4" onClick={() => scrollTo("#launches")}>
              <Rocket className="w-3.5 h-3.5" />
              Track Launches
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-full glass-strong text-space-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-space-950/80 backdrop-blur-xl md:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center justify-center h-full gap-6"
            >
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  onClick={() => scrollTo(link.href)}
                  className="flex items-center gap-3 text-xl text-space-200 hover:text-space-100 transition-colors"
                >
                  <link.icon className="w-5 h-5 text-cosmic-400" />
                  {link.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
