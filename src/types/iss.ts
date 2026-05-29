export interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
  daynum: number;
  footprint: number;
  visibility: "daylight" | "eclipsed";
  solar_lat: number;
  solar_lon: number;
  id: number;
  name: string;
  units: "kilometers";
}

export interface PositionHistoryPoint {
  lat: number;
  lng: number;
}

export interface ISSDataState {
  position: ISSPosition | null;
  loading: boolean;
  error: boolean;
  positionHistory: PositionHistoryPoint[];
  timeSinceUpdate: number;
  orbitCount: number;
}
