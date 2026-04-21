import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getTrendingMovies, getTrendingTV } from "@/lib/tmdb/client";
import { MovieCard } from "@/components/movies/movie-card";

export default async function HomePage() {
  const [moviesRes, tvRes] = await Promise.all([
    getTrendingMovies(),
    getTrendingTV(),
  ]);

  const trendingMovies = moviesRes.results.slice(0, 5);
  const trendingTV = tvRes.results.slice(0, 5);

  return (
    <main className="min-h-screen">
      <section className="bg-linear-to-b from-primary/10 to-background py-20 text-center px-4">
        <h1 className="text-5xl font-extrabold tracking-tight">Watchfolio</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-xl mx-auto">
          Track every movie and show you watch. Never lose your place again.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className={buttonVariants({ size: "lg" })}>
            Get started for free
          </Link>
          <Link
            href="/search"
            className={buttonVariants({ size: "lg", variant: "outline" })}>
            Browse movies
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 space-y-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} media={movie} mediaType="movie" />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Trending TV Shows</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {trendingTV.map((show) => (
              <MovieCard key={show.id} media={show} mediaType="tv" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
