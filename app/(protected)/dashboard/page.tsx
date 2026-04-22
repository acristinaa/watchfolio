import { Film, Tv, Eye, BookmarkCheck, Star, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RatingBar } from "@/components/dashboard/rating-bar";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { MediaTypeChart } from "@/components/dashboard/media-type-chart";
import { StatusChart } from "@/components/dashboard/status-chart";
import { computeStats } from "@/lib/stats";
import type { WatchlistEntry } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Watchfolio",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: watchlistData } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false });

  const watchlist: WatchlistEntry[] = watchlistData ?? [];
  const stats = computeStats(watchlist);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.email}
        </p>
      </div>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Your statistics
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatsCard
            title="Total Tracked"
            value={stats.total}
            icon={BookmarkCheck}
          />
          <StatsCard
            title="Watched"
            value={stats.watched}
            icon={Check}
            className="text-green-600"
          />
          <StatsCard
            title="Watching"
            value={stats.watching}
            icon={Eye}
            className="text-yellow-600"
          />
          <StatsCard
            title="Watchlist"
            value={stats.onWatchlist}
            icon={BookmarkCheck}
          />
          <StatsCard title="Movies" value={stats.totalMovies} icon={Film} />
          <StatsCard title="TV Shows" value={stats.totalTV} icon={Tv} />
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusChart
              watched={stats.watched}
              watching={stats.watching}
              onWatchlist={stats.onWatchlist}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Movies vs TV Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaTypeChart movies={stats.totalMovies} tv={stats.totalTV} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Average rating */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                aria-hidden="true"
              />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.averageRating !== null ? (
              <div>
                <p className="text-4xl font-bold">
                  {stats.averageRating.toFixed(1)}
                  <span className="text-lg font-normal text-muted-foreground">
                    {" "}
                    / 10
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {stats.ratedEntries.length} rated title
                  {stats.ratedEntries.length !== 1 ? "s" : ""}
                </p>
                <div className="mt-4 space-y-1">
                  {stats.ratedEntries
                    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                    .slice(0, 5)
                    .map((entry) => (
                      <RatingBar key={entry.id} entry={entry} />
                    ))}
                </div>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Rate some titles to see your average.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recently Added</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity entries={stats.recentlyAdded} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
