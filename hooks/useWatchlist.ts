"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { WatchlistEntry } from "@/types";
import type {
  WatchlistEntryInput,
  UpdateWatchlistInput,
} from "@/lib/validations/watchlist";

const WATCHLIST_KEY = ["watchlist"];

async function fetchWatchlist(): Promise<WatchlistEntry[]> {
  const res = await fetch("/api/watchlist");
  if (!res.ok) throw new Error("Failed to fetch watchlist");
  return res.json();
}

async function addToWatchlist(
  entry: WatchlistEntryInput,
): Promise<WatchlistEntry> {
  const res = await fetch("/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Failed to add to watchlist");
  return res.json();
}

async function updateWatchlistEntry(
  id: string,
  updates: UpdateWatchlistInput,
): Promise<WatchlistEntry> {
  const res = await fetch(`/api/watchlist/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update watchlist entry");
  return res.json();
}

async function removeFromWatchlist(id: string): Promise<void> {
  const res = await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove from watchlist");
}

export function useWatchlist() {
  const queryClient = useQueryClient();

  const {
    data: watchlist = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: WATCHLIST_KEY,
    queryFn: fetchWatchlist,
    staleTime: 1000 * 60 * 2,
  });

  const addMutation = useMutation({
    mutationFn: addToWatchlist,
    onMutate: async (newEntry) => {
      await queryClient.cancelQueries({ queryKey: WATCHLIST_KEY });
      const previous =
        queryClient.getQueryData<WatchlistEntry[]>(WATCHLIST_KEY);

      // Optimistic update
      queryClient.setQueryData<WatchlistEntry[]>(WATCHLIST_KEY, (old = []) => [
        {
          ...newEntry,
          id: `temp-${Date.now()}`,
          user_id: "",
          rating: newEntry.rating ?? null,
          review: newEntry.review ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ...old,
      ]);

      return { previous };
    },
    onError: (_err, _entry, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WATCHLIST_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateWatchlistInput;
    }) => updateWatchlistEntry(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: WATCHLIST_KEY });
      const previous =
        queryClient.getQueryData<WatchlistEntry[]>(WATCHLIST_KEY);

      queryClient.setQueryData<WatchlistEntry[]>(WATCHLIST_KEY, (old = []) =>
        old.map((entry) =>
          entry.id === id ? { ...entry, ...updates } : entry,
        ),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WATCHLIST_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWatchlist,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: WATCHLIST_KEY });
      const previous =
        queryClient.getQueryData<WatchlistEntry[]>(WATCHLIST_KEY);

      queryClient.setQueryData<WatchlistEntry[]>(WATCHLIST_KEY, (old = []) =>
        old.filter((entry) => entry.id !== id),
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WATCHLIST_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY });
    },
  });

  function getEntryForMedia(tmdbId: number, mediaType: "movie" | "tv") {
    return (
      watchlist.find(
        (e) => e.tmdb_id === tmdbId && e.media_type === mediaType,
      ) ?? null
    );
  }

  return {
    watchlist,
    isLoading,
    isError,
    getEntryForMedia,
    add: addMutation.mutate,
    update: updateMutation.mutate,
    remove: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
