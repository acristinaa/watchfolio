"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground mt-1">Find movies and TV shows</p>
      </div>

      {/* Search input */}
      <div className="relative max-w-xl">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search movies and TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-9"
          aria-label="Search movies and TV shows"
          autoFocus
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2" role="group" aria-label="Filter results">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
            aria-pressed={filter === value}>
            {label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {isError && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 p-4 text-destructive">
          Something went wrong. Please try again.
        </div>
      )}

      {/* Results */}
      {query.length >= 2 ? (
        <MovieGrid
          movies={results?.movies}
          tvShows={results?.tvShows}
          isLoading={isLoading}
          emptyMessage={`No results for "${query}"`}
        />
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  );
}
