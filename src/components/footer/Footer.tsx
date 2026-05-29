"use client";

import { motion } from "framer-motion";
import { ExternalLink, Globe, MessageCircle, MessageSquare } from "lucide-react";

const footerData = {
  explore: [
    { label: "ISS Tracker", href: "#iss" },
    { label: "Upcoming Launches", href: "#launches" },
    { label: "NASA APOD", href: "#apod" },
    { label: "Space News", href: "#news" },
  ],
  sources: [
    { label: "NASA Open APIs", href: "https://api.nasa.gov/" },
    { label: "Launch Library 2", href: "https://thespacedevs.com/llapi" },
    { label: "Where the ISS At", href: "https://wheretheiss.at/" },
    { label: "Spaceflight News", href: "https://spaceflightnewsapi.net/" },
  ],
  about: [
    { label: "About COSMOS", href: "#hero" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

const socialLinks = [
  { icon: Globe, href: "https://github.com", label: "GitHub" },
  { icon: MessageSquare, href: "https://twitter.com", label: "Twitter" },
  { icon: MessageCircle, href: "https://discord.com", label: "Discord" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[rgba(255,255,255,0.06)] pt-16 pb-8 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a href="#hero" className="flex items-center gap-2.5 mb-4 group">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="14" cy="14" r="13" stroke="url(#f-grad)" strokeWidth="1.5" />
                <ellipse cx="14" cy="14" rx="9" ry="13" stroke="url(#f-grad)" strokeWidth="1.2" transform="rotate(30, 14, 14)" />
                <circle cx="14" cy="14" r="3" fill="url(#f-grad)" />
                <defs>
                  <linearGradient id="f-grad" x1="0" y1="0" x2="28" y2="28">
                    <stop stopColor="#22d3ee" />
                    <stop offset="1" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-display font-bold text-sm tracking-wider text-text-primary">
                COSMOS
              </span>
            </a>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Real-time space intelligence. Track satellites, launches, and explore
              the cosmos from your browser.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-[rgba(255,255,255,0.08)] text-text-muted hover:text-accent-cyan hover:border-accent-cyan/30 hover:shadow-[0_0_12px_rgba(34,211,238,0.1)] transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerData).map(([title, links], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            >
              <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
                {title === "explore" ? "Explore" : title === "sources" ? "Data Sources" : "About"}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent-cyan transition-colors duration-200 group/link"
                    >
                      {link.label}
                      {link.href.startsWith("http") && (
                        <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>
            Built with real space data. Not affiliated with NASA or SpaceX.{' '}
            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan/60 hover:text-accent-cyan transition-colors"
            >
              Powered by NASA APIs
            </a>
          </p>
          <p>
            &copy; {new Date().getFullYear()} COSMOS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
