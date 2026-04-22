import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { getTMDBImageUrl } from "@/lib/utils";
import type { WatchlistEntry } from "@/types";

interface RatingBarProps {
  entry: WatchlistEntry;
}

export function RatingBar({ entry }: RatingBarProps) {
  const percentage = ((entry.rating ?? 0) / 10) * 100;

  return (
    <Link
      href={`/movies/${entry.media_type}/${entry.tmdb_id}`}
      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${entry.title} — rated ${entry.rating} out of 10`}>
      <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded">
        <Image
          src={getTMDBImageUrl(entry.poster_path, "w200")}
          alt={`${entry.title} poster`}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{entry.title}</p>
        <div className="mt-1 flex items-center gap-2">
          <div
            className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={entry.rating ?? 0}
            aria-valuemin={0}
            aria-valuemax={10}>
            <div
              className="h-full rounded-full bg-yellow-400 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="flex items-center gap-0.5 text-xs font-medium shrink-0">
            <Star
              className="h-3 w-3 fill-yellow-400 text-yellow-400"
              aria-hidden="true"
            />
            {entry.rating}/10
          </span>
        </div>
      </div>
    </Link>
  );
}
