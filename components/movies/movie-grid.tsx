import { MovieCard } from "./movie-card";
import { Skeleton } from "@/components/ui/skeleton";
import { type TMDBMovie, type TMDBTVShow } from "@/lib/tmdb/types";

interface MovieGridProps {
  movies?: TMDBMovie[];
  tvShows?: TMDBTVShow[];
  isLoading?: boolean;
  emptyMessage?: string;
}

function CardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-2/3 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function MovieGrid({
  movies = [],
  tvShows = [],
  isLoading = false,
  emptyMessage = "No results found",
}: MovieGridProps) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        aria-label="Loading results"
        aria-busy="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const hasContent = movies.length > 0 || tvShows.length > 0;

  if (!hasContent) {
    return (
      <p className="py-12 text-center text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <div className="space-y-8">
      {movies.length > 0 && (
        <section aria-labelledby="movies-heading">
          <h2 id="movies-heading" className="mb-4 text-xl font-semibold">
            Movies{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({movies.length})
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} media={movie} mediaType="movie" />
            ))}
          </div>
        </section>
      )}

      {tvShows.length > 0 && (
        <section aria-labelledby="tv-heading">
          <h2 id="tv-heading" className="mb-4 text-xl font-semibold">
            TV Shows{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({tvShows.length})
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {tvShows.map((show) => (
              <MovieCard key={show.id} media={show} mediaType="tv" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
