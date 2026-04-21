export type MediaType = "movie" | "tv";

export type WatchStatus = "watchlist" | "watching" | "watched";

export interface WatchlistEntry {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: MediaType;
  status: WatchStatus;
  rating: number | null;
  review: string | null;
  title: string;
  poster_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}
