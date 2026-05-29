export interface APODData {
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  date: string;
  copyright: string | null;
  media_type: "image" | "video";
  service_version: string;
}

export interface APODState {
  current: APODData | null;
  pastWeek: APODData[];
  loading: boolean;
  error: string | null;
  index: number; // which past week item is selected (or -1 for today)
}
