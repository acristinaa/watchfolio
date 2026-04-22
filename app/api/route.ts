import { z } from "zod";

export const watchlistEntrySchema = z.object({
  tmdb_id: z.number().int().positive(),
  media_type: z.enum(["movie", "tv"]),
  status: z.enum(["watchlist", "watching", "watched"]),
  title: z.string().min(1),
  poster_path: z.string().nullable(),
  rating: z.number().int().min(1).max(10).nullable(),
  review: z.string().max(1000).nullable(),
});

export const updateWatchlistSchema = z.object({
  status: z.enum(["watchlist", "watching", "watched"]).optional(),
  rating: z.number().int().min(1).max(10).nullable().optional(),
  review: z.string().max(1000).nullable().optional(),
});

export type WatchlistEntryInput = z.infer<typeof watchlistEntrySchema>;
export type UpdateWatchlistInput = z.infer<typeof updateWatchlistSchema>;
