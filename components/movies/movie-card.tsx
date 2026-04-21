import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTMDBImageUrl, formatVoteAverage } from "@/lib/utils";
import {
  type TMDBMovie,
  type TMDBTVShow,
  getMediaTitle,
  getMediaDate,
  isMovie,
} from "@/lib/tmdb/types";

interface MovieCardProps {
  media: TMDBMovie | TMDBTVShow;
  mediaType: "movie" | "tv";
}

export function MovieCard({ media, mediaType }: MovieCardProps) {
  const title = getMediaTitle(media);
  const date = getMediaDate(media);
  const year = date ? new Date(date).getFullYear() : null;
  const href = `/movies/${mediaType}/${media.id}`;

  return (
    <Link
      href={href}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
      <Card className="overflow-hidden transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="relative aspect-[2/3] bg-muted">
          <Image
            src={getTMDBImageUrl(media.poster_path, "w300")}
            alt={`${title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 text-xs font-semibold">
              <Star
                className="h-3 w-3 fill-yellow-400 text-yellow-400"
                aria-hidden="true"
              />
              {formatVoteAverage(media.vote_average)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {title}
          </h3>
          <div className="mt-1 flex items-center justify-between">
            {year && (
              <span className="text-xs text-muted-foreground">{year}</span>
            )}
            <Badge variant="outline" className="text-xs capitalize">
              {mediaType === "movie" ? "Movie" : "TV"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
