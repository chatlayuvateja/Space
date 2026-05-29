// ---- API Response Envelope ----
export interface LaunchLibraryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Launch[];
}

// ---- Launch Object ----
export interface Launch {
  id: string;
  name: string;
  net: string; // ISO8601 datetime
  window_end: string;
  window_start: string;
  status: LaunchStatus;
  launch_service_provider: LaunchServiceProvider | null;
  rocket: Rocket | null;
  mission: Mission | null;
  pad: Pad | null;
  image: string | null;
  infographic: string | null;
  infoURLs: InfoURL[];
  vidURLs: VidURL[];
  url: string;
  slug: string;
  hashtag: string | null;
  probability: number | null;
  holdreason: string | null;
  failreason: string | null;
}

export interface LaunchStatus {
  id: number;
  name: string;
  abbrev: string;
  description: string;
}

export interface LaunchServiceProvider {
  id: number;
  name: string;
  type: string | null;
}

export interface Rocket {
  configuration: RocketConfiguration;
}

export interface RocketConfiguration {
  id: number;
  name: string;
  family: string;
  full_name: string;
  image_url: string | null;
  variant: string | null;
}

export interface Mission {
  id: number;
  name: string;
  description: string;
  type: string | null;
  orbit: Orbit | null;
}

export interface Orbit {
  id: number;
  name: string;
  abbrev: string;
}

export interface Pad {
  id: number;
  name: string;
  location: PadLocation | null;
  info_url: string | null;
  wiki_url: string | null;
  map_url: string | null;
  latitude: string;
  longitude: string;
}

export interface PadLocation {
  id: number;
  name: string;
  country_code: string;
  total_launch_count: number;
  total_landing_count: number;
}

export interface InfoURL {
  url: string;
  title: string;
}

export interface VidURL {
  url: string;
  title: string;
}

// ---- Derived / UI Types ----
export type LaunchTab = "upcoming" | "previous";
export type LaunchFilter = "all" | "crewed" | "cargo" | "commercial" | "government";
export type SortMode = "date" | "agency";

export const LAUNCH_STATUS_COLORS: Record<string, string> = {
  Go: "#4ade80",
  "Go for Launch": "#4ade80",
  TBD: "#facc15",
  Hold: "#fb923c",
  Failure: "#f87171",
  "Partial Failure": "#f87171",
  Success: "#60a5fa",
  "In Flight": "#a78bfa",
};

export const LAUNCH_STATUS_VARIANTS: Record<
  string,
  "success" | "warning" | "destructive" | "default" | "aurora" | "nebula"
> = {
  Go: "success",
  "Go for Launch": "success",
  TBD: "warning",
  Hold: "warning",
  Failure: "destructive",
  "Partial Failure": "destructive",
  Success: "aurora",
  "In Flight": "nebula",
};

export const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸",
  RU: "🇷🇺",
  KZ: "🇰🇿",
  GF: "🇬🇫",
  NZ: "🇳🇿",
  JP: "🇯🇵",
  IN: "🇮🇳",
  CN: "🇨🇳",
  IL: "🇮🇱",
  KR: "🇰🇷",
  UK: "🇬🇧",
  FR: "🇫🇷",
  DE: "🇩🇪",
  IT: "🇮🇹",
};
