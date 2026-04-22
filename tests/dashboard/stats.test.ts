import { describe, it, expect } from "vitest";
import { computeStats } from "@/lib/stats";
import type { WatchlistEntry } from "@/types";

const makeEntry = (overrides: Partial<WatchlistEntry>): WatchlistEntry => ({
  id: "1",
  user_id: "user-1",
  tmdb_id: 550,
  media_type: "movie",
  status: "watched",
  title: "Fight Club",
  poster_path: null,
  rating: null,
  review: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

describe("computeStats", () => {
  it("returns zero stats for empty watchlist", () => {
    const stats = computeStats([]);
    expect(stats.total).toBe(0);
    expect(stats.watched).toBe(0);
    expect(stats.watching).toBe(0);
    expect(stats.onWatchlist).toBe(0);
    expect(stats.averageRating).toBeNull();
  });

  it("counts entries by status correctly", () => {
    const entries = [
      makeEntry({ id: "1", status: "watched" }),
      makeEntry({ id: "2", status: "watching" }),
      makeEntry({ id: "3", status: "watchlist" }),
      makeEntry({ id: "4", status: "watched" }),
    ];
    const stats = computeStats(entries);
    expect(stats.total).toBe(4);
    expect(stats.watched).toBe(2);
    expect(stats.watching).toBe(1);
    expect(stats.onWatchlist).toBe(1);
  });

  it("counts media types correctly", () => {
    const entries = [
      makeEntry({ id: "1", media_type: "movie" }),
      makeEntry({ id: "2", media_type: "movie" }),
      makeEntry({ id: "3", media_type: "tv" }),
    ];
    const stats = computeStats(entries);
    expect(stats.totalMovies).toBe(2);
    expect(stats.totalTV).toBe(1);
  });

  it("computes average rating correctly", () => {
    const entries = [
      makeEntry({ id: "1", rating: 8 }),
      makeEntry({ id: "2", rating: 6 }),
      makeEntry({ id: "3", rating: null }),
    ];
    const stats = computeStats(entries);
    expect(stats.averageRating).toBe(7);
    expect(stats.ratedEntries).toHaveLength(2);
  });

  it("returns null average rating when no entries are rated", () => {
    const entries = [
      makeEntry({ id: "1", rating: null }),
      makeEntry({ id: "2", rating: null }),
    ];
    const stats = computeStats(entries);
    expect(stats.averageRating).toBeNull();
  });

  it("returns up to 5 recently added entries sorted by date", () => {
    const entries = Array.from({ length: 7 }, (_, i) =>
      makeEntry({
        id: String(i),
        created_at: new Date(2024, 0, i + 1).toISOString(),
      }),
    );
    const stats = computeStats(entries);
    expect(stats.recentlyAdded).toHaveLength(5);
    expect(stats.recentlyAdded[0].id).toBe("6");
  });
});
