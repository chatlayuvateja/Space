"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// ---- Custom ISS SVG Icon ----
function createISSIcon(): L.DivIcon {
  return L.divIcon({
    className: "iss-marker-custom",
    html: `
      <div class="iss-marker-pulse">
        <div class="iss-marker-glow"></div>
        <div class="iss-marker-core">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7V4h16v3"/>
            <path d="M9 20h6"/>
            <path d="M12 4v16"/>
            <path d="M6 10l-2 2 2 2"/>
            <path d="M18 14l2-2-2-2"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

// ---- Map auto-follow component ----
function MapFlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), {
      duration: 1.5,
      easeLinearity: 0.3,
    });
  }, [lat, lng, map]);

  return null;
}

// ---- Props ----
interface ISSMapProps {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  orbitCount: number;
  groundTrack: [number, number][];
  visibility: string;
}

// ---- Main Map Component ----
export default function ISSMap({
  latitude,
  longitude,
  altitude,
  velocity,
  orbitCount,
  groundTrack,
  visibility,
}: ISSMapProps) {
  const [ready, setReady] = useState(false);
  const [icon, setIcon] = useState<L.DivIcon | null>(null);

  useEffect(() => {
    // Inject Leaflet CSS
    if (!document.querySelector("#leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    // Inject custom map styles
    if (!document.querySelector("#iss-map-custom-styles")) {
      const style = document.createElement("style");
      style.id = "iss-map-custom-styles";
      style.textContent = `
        .iss-marker-custom { background: transparent !important; border: none !important; }
        .iss-marker-pulse { position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
        .iss-marker-glow {
          position: absolute; width: 32px; height: 32px; border-radius: 50%;
          background: radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, rgba(34, 211, 238, 0) 70%);
          animation: iss-pulse-glow 2s ease-in-out infinite;
        }
        .iss-marker-core {
          position: relative; width: 24px; height: 24px; border-radius: 50%;
          background: linear-gradient(135deg, #22d3ee, #06b6d4);
          border: 2px solid rgba(255,255,255,0.9);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3);
          z-index: 2;
        }
        @keyframes iss-pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.8); opacity: 0.2; }
        }
        .leaflet-container { background: #0a0e1a !important; }
        .leaflet-control-zoom a {
          background: rgba(15, 23, 42, 0.85) !important;
          color: rgba(255,255,255,0.7) !important;
          border-color: rgba(255,255,255,0.1) !important;
          backdrop-filter: blur(8px) !important;
          transition: all 0.2s ease !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(30, 41, 59, 0.95) !important;
          color: rgba(255,255,255,1) !important;
        }
        .leaflet-control-attribution {
          background: rgba(10, 14, 26, 0.7) !important;
          color: rgba(255,255,255,0.2) !important;
          font-size: 9px !important;
          padding: 2px 6px !important;
          backdrop-filter: blur(4px) !important;
        }
        .leaflet-control-attribution a {
          color: rgba(34, 211, 238, 0.4) !important;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.95) !important;
          color: rgba(255,255,255,0.9) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 8px !important;
          backdrop-filter: blur(12px) !important;
          font-family: 'Geist Mono', monospace !important;
          font-size: 11px !important;
        }
        .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .leaflet-popup-close-button {
          color: rgba(255,255,255,0.4) !important;
        }
      `;
      document.head.appendChild(style);
    }

    setIcon(createISSIcon());
    setReady(true);
  }, []);

  if (!ready || !icon) {
    return (
      <div className="flex items-center justify-center h-full w-full" style={{ background: "#0a0e1a" }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
            Loading map...
          </span>
        </div>
      </div>
    );
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={4}
      zoomControl={true}
      scrollWheelZoom={false}
      doubleClickZoom={true}
      touchZoom={true}
      dragging={true}
      style={{ height: "100%", width: "100%" }}
      attributionControl={true}
    >
      {/* Dark tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Ground track - fading polyline */}
      {groundTrack.length > 1 && (
        <>
          <Polyline
            positions={groundTrack}
            pathOptions={{
              color: "#22d3ee",
              weight: 2,
              opacity: 0.3,
            }}
          />
          <Polyline
            positions={groundTrack.slice(-5)}
            pathOptions={{
              color: "#22d3ee",
              weight: 3,
              opacity: 0.7,
            }}
          />
        </>
      )}

      {/* ISS Marker */}
      <Marker position={position} icon={icon}>
        <Popup>
          <div style={{ minWidth: "140px" }}>
            <div style={{ fontWeight: 600, marginBottom: 4, color: "#22d3ee" }}>ISS (ZARYA)</div>
            <div>Lat: {latitude.toFixed(4)}°</div>
            <div>Lng: {longitude.toFixed(4)}°</div>
            <div>Alt: {altitude.toFixed(1)} km</div>
            <div>Speed: {velocity.toFixed(0)} km/h</div>
            <div>Orbit: #{orbitCount.toLocaleString()}</div>
            <div style={{ textTransform: "capitalize", color: visibility === "daylight" ? "#4ade80" : "#60a5fa" }}>
              {visibility}
            </div>
          </div>
        </Popup>
      </Marker>

      {/* Auto-follow */}
      <MapFlyTo lat={latitude} lng={longitude} />
    </MapContainer>
  );
}
