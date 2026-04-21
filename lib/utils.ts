import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn's cn() helper, merges Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
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
  return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p"}/${size}${path}`;
}
