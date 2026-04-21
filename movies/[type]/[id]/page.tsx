import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Clock, Calendar, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getMovieDetail, getTVDetail } from "@/lib/tmdb/client";
import {
  getTMDBImageUrl,
  formatDate,
  formatRuntime,
  formatVoteAverage,
} from "@/lib/utils";
import { isMovie } from "@/lib/tmdb/types";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ type: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, id } = await params;
  try {
    if (type === "movie") {
      const movie = await getMovieDetail(Number(id));
      return { title: `${movie.title} — Watchfolio` };
    } else {
      const show = await getTVDetail(Number(id));
      return { title: `${show.name} — Watchfolio` };
    }
  } catch {
    return { title: "Watchfolio" };
  }
}

export default async function MediaDetailPage({ params }: Props) {
  const { type, id: rawId } = await params;

  if (type !== "movie" && type !== "tv") {
    notFound();
  }

  const id = Number(rawId);
  if (isNaN(id)) notFound();

  let media;
  try {
    media = type === "movie" ? await getMovieDetail(id) : await getTVDetail(id);
  } catch {
    notFound();
  }

  const title = isMovie(media) ? media.title : media.name;
  const date = isMovie(media) ? media.release_date : media.first_air_date;
  const runtime = isMovie(media) ? media.runtime : null;
  const seasons = !isMovie(media) ? media.number_of_seasons : null;
  const episodes = !isMovie(media) ? media.number_of_episodes : null;

  return (
    <div>
      {media.backdrop_path && (
        <div className="relative -mx-4 -mt-8 mb-8 h-64 overflow-hidden sm:h-80">
          <Image
            src={getTMDBImageUrl(media.backdrop_path, "original")}
            alt={`${title} backdrop`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="relative mx-auto h-72 w-48 shrink-0 overflow-hidden rounded-lg shadow-xl sm:mx-0 sm:h-80 sm:w-52">
          <Image
            src={getTMDBImageUrl(media.poster_path, "w300")}
            alt={`${title} poster`}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {media.tagline && (
              <p className="mt-1 text-muted-foreground italic">
                {media.tagline}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                aria-hidden="true"
              />
              <strong className="text-foreground">
                {formatVoteAverage(media.vote_average)}
              </strong>
              <span>/ 10</span>
            </span>

            {date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {formatDate(date)}
              </span>
            )}

            {runtime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {formatRuntime(runtime)}
              </span>
            )}

            {seasons && (
              <span className="flex items-center gap-1">
                <Tv className="h-4 w-4" aria-hidden="true" />
                {seasons} season{seasons !== 1 ? "s" : ""} · {episodes} episodes
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Genres">
            {media.genres.map((genre) => (
              <Badge key={genre.id} variant="secondary">
                {genre.name}
              </Badge>
            ))}
          </div>

          {media.overview && (
            <div>
              <h2 className="font-semibold mb-1">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                {media.overview}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
