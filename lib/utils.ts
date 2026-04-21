import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TMDB_IMAGE_BASE } from "@/lib/validations/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "Unknown date";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getTMDBImageUrl(
  path: string | null,
  size: "w200" | "w300" | "w500" | "original" = "w300",
): string {
  if (!path) return "/placeholder-poster.png";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return "Unknown";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatVoteAverage(vote: number): string {
  return vote.toFixed(1);
}
