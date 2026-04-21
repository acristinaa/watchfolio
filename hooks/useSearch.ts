"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TMDBMovie, TMDBTVShow } from "@/lib/tmdb/types";

type MediaFilter = "all" | "movie" | "tv";

async function fetchSearch(query: string, filter: MediaFilter) {
  if (!query.trim()) return { movies: [], tvShows: [] };

  const params = new URLSearchParams({ query, filter });
  const res = await fetch(`/api/search?${params}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json() as Promise<{ movies: TMDBMovie[]; tvShows: TMDBTVShow[] }>;
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filter, setFilter] = useState<MediaFilter>("all");

  // Debounce the search query by 400ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["search", debouncedQuery, filter],
    queryFn: () => fetchSearch(debouncedQuery, filter),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  return {
    query,
    setQuery,
    filter,
    setFilter,
    results: data,
    isLoading: isLoading && debouncedQuery.length >= 2,
    isError,
    error,
    clearSearch,
    hasResults:
      (data?.movies?.length ?? 0) > 0 || (data?.tvShows?.length ?? 0) > 0,
  };
}
