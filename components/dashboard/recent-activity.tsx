import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getTMDBImageUrl, formatDate } from "@/lib/utils";
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

interface RecentActivityProps {
  entries: WatchlistEntry[];
}

export function RecentActivity({ entries }: RecentActivityProps) {
  if (entries.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No activity yet. Start adding movies and shows!
      </p>
    );
  }

  return (
    <ul className="space-y-2" aria-label="Recently added titles">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={`/movies/${entry.media_type}/${entry.tmdb_id}`}
            className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <div className="relative h-12 w-8 shrink-0 overflow-hidden rounded">
              <Image
                src={getTMDBImageUrl(entry.poster_path, "w200")}
                alt={`${entry.title} poster`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{entry.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(entry.created_at)}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn("text-xs shrink-0", statusColors[entry.status])}>
              {statusLabels[entry.status]}
            </Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
