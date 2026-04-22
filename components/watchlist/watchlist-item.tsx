"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTMDBImageUrl, formatDate } from "@/lib/utils";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useUIStore } from "@/store/uiStore";
import type { WatchlistEntry, WatchStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusColors: Record<WatchStatus, string> = {
  watchlist: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  watching: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  watched: "bg-green-500/10 text-green-600 border-green-500/20",
};

const statusLabels: Record<WatchStatus, string> = {
  watchlist: "Watchlist",
  watching: "Watching",
  watched: "Watched",
};

interface WatchlistItemProps {
  entry: WatchlistEntry;
}

export function WatchlistItem({ entry }: WatchlistItemProps) {
  const { remove, isRemoving } = useWatchlist();
  const { openRatingDialog, showNotification } = useUIStore();

  function handleRemove() {
    remove(entry.id, {
      onSuccess: () => showNotification(`Removed "${entry.title}"`, "success"),
      onError: () => showNotification("Failed to remove", "error"),
    });
  }

  return (
    <article className="flex gap-4 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
      <Link
        href={`/movies/${entry.media_type}/${entry.tmdb_id}`}
        className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        aria-label={`View details for ${entry.title}`}>
        <div className="relative h-24 w-16 overflow-hidden rounded">
          <Image
            src={getTMDBImageUrl(entry.poster_path, "w200")}
            alt={`${entry.title} poster`}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/movies/${entry.media_type}/${entry.tmdb_id}`}
              className="font-semibold hover:underline truncate">
              {entry.title}
            </Link>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 capitalize text-xs",
                statusColors[entry.status],
              )}>
              {statusLabels[entry.status]}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground mt-1 capitalize">
            {entry.media_type === "movie" ? "Movie" : "TV Show"} · Added{" "}
            {formatDate(entry.created_at)}
          </p>

          {entry.rating && (
            <div className="mt-1 flex items-center gap-1 text-sm">
              <Star
                className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                aria-hidden="true"
              />
              <span className="font-medium">{entry.rating}/10</span>
            </div>
          )}

          {entry.review && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 italic">
              &ldquo;{entry.review}&rdquo;
            </p>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          {entry.status === "watched" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openRatingDialog(entry.id)}
              className="h-7 text-xs gap-1"
              aria-label={`Rate ${entry.title}`}>
              <Edit className="h-3 w-3" aria-hidden="true" />
              {entry.rating ? "Edit rating" : "Add rating"}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            disabled={isRemoving}
            className="h-7 text-xs text-destructive hover:text-destructive gap-1"
            aria-label={`Remove ${entry.title} from watchlist`}>
            <Trash2 className="h-3 w-3" aria-hidden="true" />
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
}
