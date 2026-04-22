import { describe, it, expect } from "vitest";
import {
  watchlistEntrySchema,
  updateWatchlistSchema,
} from "@/lib/validations/watchlist";

describe("watchlistEntrySchema", () => {
  it("accepts a valid watchlist entry", () => {
    const result = watchlistEntrySchema.safeParse({
      tmdb_id: 550,
      media_type: "movie",
      status: "watchlist",
      title: "Fight Club",
      poster_path: "/poster.jpg",
      rating: null,
      review: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid media_type", () => {
    const result = watchlistEntrySchema.safeParse({
      tmdb_id: 550,
      media_type: "book",
      status: "watchlist",
      title: "Fight Club",
      poster_path: null,
      rating: null,
      review: null,
    });
    expect(result.success).toBe(false);
  });

  it("rejects rating above 10", () => {
    const result = watchlistEntrySchema.safeParse({
      tmdb_id: 550,
      media_type: "movie",
      status: "watched",
      title: "Fight Club",
      poster_path: null,
      rating: 11,
      review: null,
    });
    expect(result.success).toBe(false);
  });

  it("rejects rating below 1", () => {
    const result = watchlistEntrySchema.safeParse({
      tmdb_id: 550,
      media_type: "movie",
      status: "watched",
      title: "Fight Club",
      poster_path: null,
      rating: 0,
      review: null,
    });
    expect(result.success).toBe(false);
  });

  it("rejects review over 1000 characters", () => {
    const result = watchlistEntrySchema.safeParse({
      tmdb_id: 550,
      media_type: "movie",
      status: "watched",
      title: "Fight Club",
      poster_path: null,
      rating: 8,
      review: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });
});

describe("updateWatchlistSchema", () => {
  it("accepts partial updates", () => {
    const result = updateWatchlistSchema.safeParse({ status: "watched" });
    expect(result.success).toBe(true);
  });

  it("accepts rating null to clear it", () => {
    const result = updateWatchlistSchema.safeParse({ rating: null });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = updateWatchlistSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
