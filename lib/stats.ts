import type { WatchlistEntry } from "@/types";

export interface WatchlistStats {
  total: number;
  watched: number;
  watching: number;
  onWatchlist: number;
  totalMovies: number;
  totalTV: number;
  averageRating: number | null;
  topGenres: { genre: string; count: number }[];
  recentlyAdded: WatchlistEntry[];
  ratedEntries: WatchlistEntry[];
}

export function computeStats(watchlist: WatchlistEntry[]): WatchlistStats {
  const watched = watchlist.filter((e) => e.status === "watched");
  const watching = watchlist.filter((e) => e.status === "watching");
  const onWatchlist = watchlist.filter((e) => e.status === "watchlist");
  const movies = watchlist.filter((e) => e.media_type === "movie");
  const tv = watchlist.filter((e) => e.media_type === "tv");

  const ratedEntries = watchlist.filter((e) => e.rating !== null);
  const averageRating =
    ratedEntries.length > 0
      ? ratedEntries.reduce((sum, e) => sum + (e.rating ?? 0), 0) /
        ratedEntries.length
      : null;

  const recentlyAdded = [...watchlist]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  return {
    total: watchlist.length,
    watched: watched.length,
    watching: watching.length,
    onWatchlist: onWatchlist.length,
    totalMovies: movies.length,
    totalTV: tv.length,
    averageRating,
    topGenres: [],
    recentlyAdded,
    ratedEntries,
  };
}
