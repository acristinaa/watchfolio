"use client";

import { useState } from "react";
import { List } from "lucide-react";
import { WatchlistItem } from "@/components/watchlist/watchlist-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";
import type { WatchStatus } from "@/types";

const tabs: { value: WatchStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "watchlist", label: "Watchlist" },
  { value: "watching", label: "Watching" },
  { value: "watched", label: "Watched" },
];

export default function WatchlistPage() {
  const { watchlist, isLoading, isError } = useWatchlist();
  const [activeTab, setActiveTab] = useState<WatchStatus | "all">("all");

  const filtered =
    activeTab === "all"
      ? watchlist
      : watchlist.filter((e) => e.status === activeTab);

  const counts = {
    all: watchlist.length,
    watchlist: watchlist.filter((e) => e.status === "watchlist").length,
    watching: watchlist.filter((e) => e.status === "watching").length,
    watched: watchlist.filter((e) => e.status === "watched").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        <p className="text-muted-foreground mt-1">
          {watchlist.length} title{watchlist.length !== 1 ? "s" : ""} tracked
        </p>
      </div>

      <div
        className="flex gap-2 flex-wrap"
        role="tablist"
        aria-label="Filter watchlist">
        {tabs.map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            aria-selected={activeTab === value}
            onClick={() => setActiveTab(value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}>
            {label}
            <span className="ml-1.5 text-xs opacity-70">({counts[value]})</span>
          </button>
        ))}
      </div>

      {isError && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 p-4 text-destructive">
          Failed to load watchlist. Please refresh the page.
        </div>
      )}

      {isLoading && (
        <div
          className="space-y-3"
          aria-label="Loading watchlist"
          aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <List
            className="h-12 w-12 text-muted-foreground mb-4"
            aria-hidden="true"
          />
          <p className="text-lg font-medium">Nothing here yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Search for movies and TV shows to add them to your list.
          </p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div
          className="space-y-3"
          role="list"
          aria-label={`${activeTab === "all" ? "All" : activeTab} watchlist items`}>
          {filtered.map((entry) => (
            <div key={entry.id} role="listitem">
              <WatchlistItem entry={entry} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
