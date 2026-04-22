"use client";

import {
  Plus,
  Check,
  Eye,
  BookmarkCheck,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import type { WatchStatus } from "@/types";

interface WatchlistButtonProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
}

const statusConfig: Record<
  WatchStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  watchlist: {
    label: "In Watchlist",
    icon: BookmarkCheck,
    className: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  watching: {
    label: "Watching",
    icon: Eye,
    className: "bg-yellow-500 hover:bg-yellow-600 text-white",
  },
  watched: {
    label: "Watched",
    icon: Check,
    className: "bg-green-500 hover:bg-green-600 text-white",
  },
};

export function WatchlistButton({
  tmdbId,
  mediaType,
  title,
  posterPath,
}: WatchlistButtonProps) {
  const { getEntryForMedia, add, update, remove, isAdding, isRemoving } =
    useWatchlist();
  const { showNotification } = useUIStore();
  const entry = getEntryForMedia(tmdbId, mediaType);
  const isPending = isAdding || isRemoving;

  function handleAdd(status: WatchStatus) {
    add(
      {
        tmdb_id: tmdbId,
        media_type: mediaType,
        status,
        title,
        poster_path: posterPath,
        rating: null,
        review: null,
      },
      {
        onSuccess: () =>
          showNotification(`Added "${title}" to ${status}`, "success"),
        onError: () => showNotification("Something went wrong", "error"),
      },
    );
  }

  function handleStatusChange(status: WatchStatus) {
    if (!entry) return;
    update(
      { id: entry.id, updates: { status } },
      {
        onSuccess: () => showNotification(`Moved to ${status}`, "success"),
        onError: () => showNotification("Something went wrong", "error"),
      },
    );
  }

  function handleRemove() {
    if (!entry) return;
    remove(entry.id, {
      onSuccess: () => showNotification(`Removed "${title}"`, "success"),
      onError: () => showNotification("Something went wrong", "error"),
    });
  }

  if (!entry) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button disabled={isPending} className="gap-2" />}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Plus className="h-4 w-4" aria-hidden="true" />
          )}
          Add to Watchlist
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleAdd("watchlist")}>
            <BookmarkCheck className="mr-2 h-4 w-4" aria-hidden="true" />
            Add to Watchlist
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAdd("watching")}>
            <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
            Currently Watching
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAdd("watched")}>
            <Check className="mr-2 h-4 w-4" aria-hidden="true" />
            Mark as Watched
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const config = statusConfig[entry.status];
  const Icon = config.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className={cn("gap-2", config.className)}
            disabled={isPending}
          />
        }>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Icon className="h-4 w-4" aria-hidden="true" />
        )}
        {config.label}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(statusConfig) as WatchStatus[])
          .filter((s) => s !== entry.status)
          .map((status) => {
            const { label, icon: ItemIcon } = statusConfig[status];
            return (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusChange(status)}>
                <ItemIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                {label}
              </DropdownMenuItem>
            );
          })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleRemove}
          className="text-destructive focus:text-destructive">
          Remove from list
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
