import { env } from "@/lib/validations/env";
import type {
  TMDBMovieDetail,
  TMDBTVDetail,
  TMDBSearchResponse,
  TMDBMovie,
  TMDBTVShow,
} from "./types";

const BASE_URL = "https://api.themoviedb.org/3";

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${env.NEXT_PUBLIC_TMDB_API_KEY}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<TMDBSearchResponse<TMDBMovie>> {
  return tmdbFetch<TMDBSearchResponse<TMDBMovie>>("/search/movie", {
    query,
    page: String(page),
    include_adult: "false",
  });
}

export async function searchTVShows(
  query: string,
  page = 1,
): Promise<TMDBSearchResponse<TMDBTVShow>> {
  return tmdbFetch<TMDBSearchResponse<TMDBTVShow>>("/search/tv", {
    query,
    page: String(page),
    include_adult: "false",
  });
}

export async function getMovieDetail(id: number): Promise<TMDBMovieDetail> {
  return tmdbFetch<TMDBMovieDetail>(`/movie/${id}`);
}

export async function getTVDetail(id: number): Promise<TMDBTVDetail> {
  return tmdbFetch<TMDBTVDetail>(`/tv/${id}`);
}

export async function getTrendingMovies(): Promise<
  TMDBSearchResponse<TMDBMovie>
> {
  return tmdbFetch<TMDBSearchResponse<TMDBMovie>>("/trending/movie/week");
}

export async function getTrendingTV(): Promise<TMDBSearchResponse<TMDBTVShow>> {
  return tmdbFetch<TMDBSearchResponse<TMDBTVShow>>("/trending/tv/week");
}

export async function getMoviesByGenre(
  genreId: number,
  page = 1,
): Promise<TMDBSearchResponse<TMDBMovie>> {
  return tmdbFetch<TMDBSearchResponse<TMDBMovie>>("/discover/movie", {
    with_genres: String(genreId),
    page: String(page),
    sort_by: "popularity.desc",
  });
}
