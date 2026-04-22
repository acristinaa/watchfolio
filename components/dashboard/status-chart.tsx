"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StatusChartProps {
  watched: number;
  watching: number;
  onWatchlist: number;
}

const STATUS_COLORS: Record<string, string> = {
  Watched: "#22c55e",
  Watching: "#f59e0b",
  Watchlist: "#6366f1",
};

export function StatusChart({
  watched,
  watching,
  onWatchlist,
}: StatusChartProps) {
  const data = [
    { name: "Watched", value: watched },
    { name: "Watching", value: watching },
    { name: "Watchlist", value: onWatchlist },
  ];

  if (watched === 0 && watching === 0 && onWatchlist === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No data yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={40}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={STATUS_COLORS[entry.name]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
