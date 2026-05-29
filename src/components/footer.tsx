"use client";

import { motion } from "framer-motion";
import { Satellite, Heart, ExternalLink } from "lucide-react";

const footerLinks = {
  explore: [
    { label: "ISS Tracker", href: "#iss" },
    { label: "Upcoming Launches", href: "#launches" },
    { label: "NASA APOD", href: "#apod" },
    { label: "Space News", href: "#news" },
  ],
  resources: [
    { label: "NASA Open APIs", href: "https://api.nasa.gov/" },
    { label: "Spaceflight News API", href: "https://spaceflightnewsapi.net/" },
    { label: "Where the ISS At", href: "https://wheretheiss.at/" },
    { label: "RocketLaunch.live", href: "https://rocketlaunch.live/" },
  ],
  company: [
    { label: "About SpaceExplore", href: "#hero" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 pt-16 pb-8 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a href="#hero" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-500 to-nebula-500 flex items-center justify-center">
                <Satellite className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-space-100">
                Space<span className="gradient-text">Explore</span>
              </span>
            </a>
            <p className="text-sm text-space-400 leading-relaxed max-w-xs">
              Your gateway to real-time space exploration data. Track satellites,
              launches, and discover the cosmos from your browser.
            </p>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            >
              <h4 className="text-sm font-semibold text-space-200 uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-space-400 hover:text-cosmic-400 transition-colors flex items-center gap-1.5 group"
                    >
                      {link.label}
                      {link.href.startsWith("http") && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-space-500">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} SpaceExplore. Made with
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            for space enthusiasts.
          </p>
          <p className="text-xs">
            Data sourced from{" "}
            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cosmic-400 hover:text-cosmic-300 transition-colors"
            >
              NASA APIs
            </a>
            ,{" "}
            <a
              href="https://wheretheiss.at/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cosmic-400 hover:text-cosmic-300 transition-colors"
            >
              Where the ISS At
            </a>
            , and more.
          </p>
        </div>
      </div>
    </footer>
  );
}
