"use client";

import { Search, X, Film, Tv } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MovieGrid } from "@/components/movies/movie-grid";
import { useSearch } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";

const filters = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
] as const;

export default function SearchPage() {
  const {
    query,
    setQuery,
    filter,
    setFilter,
    results,
    isLoading,
    isError,
    clearSearch,
  } = useSearch();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Discover movies and TV shows to add to your watchlist
        </p>
      </div>

      {/* Search input + filters */}
      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search movies and TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 pr-11 h-12 text-base rounded-xl"
            aria-label="Search movies and TV shows"
            autoFocus
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-4 justify-center" role="group" aria-label="Filter results">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                filter === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
              aria-pressed={filter === value}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div
          role="alert"
          className="mx-auto max-w-2xl rounded-lg bg-destructive/10 p-4 text-destructive text-sm text-center">
          Something went wrong. Please try again.
        </div>
      )}

      {/* Results or empty prompt */}
      {query.length >= 2 ? (
        <MovieGrid
          movies={results?.movies}
          tvShows={results?.tvShows}
          isLoading={isLoading}
          emptyMessage={`No results for "${query}"`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-5 text-muted-foreground">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-muted p-5">
              <Film className="h-8 w-8" />
            </div>
            <div className="rounded-2xl bg-muted p-5">
              <Tv className="h-8 w-8" />
            </div>
          </div>
          <p className="text-base">Type at least 2 characters to search</p>
        </div>
      )}
    </div>
  );
}
