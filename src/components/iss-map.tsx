"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// ---- ISS Orbit Icon ----
function createISSIcon(): L.DivIcon {
  return L.divIcon({
    className: "iss-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.8);
        box-shadow: 0 0 20px rgba(99,102,241,0.6), 0 0 40px rgba(99,102,241,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 14l4-4 4 4"/>
          <path d="M14 10l-4 4-4-4"/>
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

// ---- Map FlyTo Component ----
function MapFlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), {
      duration: 2,
      easeLinearity: 0.25,
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
  const [icon, setIcon] = useState<L.DivIcon | null>(null);
  const [cssLoaded, setCssLoaded] = useState(false);

  // Inject Leaflet CSS
  useEffect(() => {
    if (!document.querySelector("#leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    // Inject custom styles
    if (!document.querySelector("#iss-map-style")) {
      const style = document.createElement("style");
      style.id = "iss-map-style";
      style.textContent = `
        .iss-marker { background: transparent !important; border: none !important; }
        .leaflet-control-zoom a { background: rgba(15, 23, 42, 0.8) !important; color: #e4e6f0 !important; border-color: rgba(255,255,255,0.1) !important; }
        .leaflet-control-zoom a:hover { background: rgba(30, 41, 59, 0.9) !important; }
        .leaflet-control-attribution { background: rgba(15, 23, 42, 0.6) !important; color: rgba(255,255,255,0.3) !important; }
        .leaflet-control-attribution a { color: rgba(99,102,241,0.6) !important; }
      `;
      document.head.appendChild(style);
    }

    setCssLoaded(true);
    setIcon(createISSIcon());
  }, []);

  if (!cssLoaded || !icon) return null;

  const position: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={3}
      zoomControl={false}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      attributionControl={true}
    >
      {/* Dark space-like tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Ground track */}
      {groundTrack.length > 1 && (
        <Polyline
          positions={groundTrack}
          pathOptions={{
            color: "#6366f1",
            weight: 2,
            opacity: 0.4,
            dashArray: "6 8",
          }}
        />
      )}

      {/* ISS Marker */}
      <Marker position={position} icon={icon}>
        <Popup>
          <div className="text-xs font-mono">
            <strong>ISS (ZARYA)</strong><br />
            Lat: {latitude.toFixed(4)}°<br />
            Lng: {longitude.toFixed(4)}°<br />
            Alt: {altitude.toFixed(1)} km<br />
            Speed: {velocity.toFixed(1)} km/h<br />
            Orbit: #{orbitCount.toLocaleString()}
          </div>
        </Popup>
      </Marker>

      {/* FlyTo keeps map centered on ISS */}
      <MapFlyTo lat={latitude} lng={longitude} />
    </MapContainer>
  );
}
