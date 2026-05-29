export interface NewsArticle {
  id: number;
  title: string;
  url: string;
  image_url: string | null;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  launches: { id: string; provider: string }[];
  events: { id: number; provider: string }[];
}

export interface NewsAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NewsArticle[];
}

export type NewsSource =
  | "all"
  | "NASA"
  | "SpaceX"
  | "ESA"
  | "ISRO"
  | "Rocket Lab";
