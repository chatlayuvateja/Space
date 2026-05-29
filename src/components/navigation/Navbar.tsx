"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight, Satellite, Rocket, Globe, Newspaper, Sparkles } from "lucide-react";

const navLinks = [
  { href: "#hero", label: "Home", icon: Sparkles },
  { href: "#iss", label: "ISS Tracker", icon: Satellite },
  { href: "#launches", label: "Launches", icon: Rocket },
  { href: "#apod", label: "APOD", icon: Globe },
  { href: "#news", label: "News", icon: Newspaper },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = navLinks.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
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
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4",
          "transition-all duration-500"
        )}
      >
        <nav
          className={cn(
            "flex items-center justify-between px-5 h-14 rounded-2xl",
            "bg-[rgba(8,11,20,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)]",
            "transition-all duration-500",
            scrolled && "shadow-lg shadow-black/20 bg-[rgba(8,11,20,0.9)]"
          )}
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }}
            className="flex items-center gap-2.5 group"
          >
            {/* Orbit SVG icon */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <circle cx="14" cy="14" r="13" stroke="url(#orbit-grad)" strokeWidth="1.5" />
              <ellipse cx="14" cy="14" rx="9" ry="13" stroke="url(#orbit-grad)" strokeWidth="1.2" transform="rotate(30, 14, 14)" />
              <circle cx="14" cy="14" r="3" fill="url(#orbit-grad)" />
              <defs>
                <linearGradient id="orbit-grad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#22d3ee" />
                  <stop offset="1" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-display font-bold text-sm tracking-wider text-text-primary hidden sm:block">
              COSMOS
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    "relative px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-colors duration-200",
                    isActive
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-white/5 rounded-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-cyan"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* CTA + Mobile hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTo("#launches")}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl text-[#080b14] bg-gradient-to-r from-accent-cyan to-accent-purple hover:brightness-105 active:scale-[0.97] transition-all duration-200"
            >
              Launch App
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative z-50 w-9 h-9 flex items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#080b14]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  onClick={() => scrollTo(link.href)}
                  className="flex items-center gap-4 text-lg text-text-secondary hover:text-text-primary transition-colors"
                >
                  <link.icon className="w-5 h-5 text-accent-cyan" />
                  {link.label}
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                onClick={() => scrollTo("#launches")}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-[#080b14] bg-gradient-to-r from-accent-cyan to-accent-purple"
              >
                Launch App
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
