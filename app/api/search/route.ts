import { NextRequest, NextResponse } from "next/server";
import { searchMovies, searchTVShows } from "@/lib/tmdb/client";
import { z } from "zod";

const searchParamsSchema = z.object({
  query: z.string().min(1).max(100),
  filter: z.enum(["all", "movie", "tv"]).default("all"),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const parsed = searchParamsSchema.safeParse({
    query: searchParams.get("query"),
    filter: searchParams.get("filter") ?? "all",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid search parameters" },
      { status: 400 },
    );
  }

  const { query, filter } = parsed.data;

  try {
    const [moviesRes, tvRes] = await Promise.all([
      filter !== "tv" ? searchMovies(query) : Promise.resolve({ results: [] }),
      filter !== "movie"
        ? searchTVShows(query)
        : Promise.resolve({ results: [] }),
    ]);

    return NextResponse.json({
      movies: moviesRes.results,
      tvShows: tvRes.results,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 },
    );
  }
}
