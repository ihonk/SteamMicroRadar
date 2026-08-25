export interface SteamGame {
  appid: number;
  title: string;
  release_date: string;
  release_year: number;
  reviews_count: number;
  positive_rate: number;
  estimated_sales: number;
  price_usd: number;
  developers: string[];
  publishers: string[];
  genres: string[];
  tags: string[];
  description: string;
  header_image: string;
  team_size: number;
  confidence: "High" | "Medium" | "Low" | string;
  evidence: string[];
  is_micro: boolean;
  steam_url?: string;
}

export interface PythonSourceFile {
  name: string;
  description: string;
  content: string;
}

export interface AnalysisResult {
  team_size: number;
  confidence: string;
  evidence: string[];
  is_micro: boolean;
  notes?: string;
}
