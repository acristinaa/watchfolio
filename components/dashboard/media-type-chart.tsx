"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MediaTypeChartProps {
  movies: number;
  tv: number;
}

const COLORS = ["#6366f1", "#f59e0b"];

export function MediaTypeChart({ movies, tv }: MediaTypeChartProps) {
  const data = [
    { name: "Movies", value: movies },
    { name: "TV Shows", value: tv },
  ];

  if (movies === 0 && tv === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No data yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
          aria-label="Media type distribution chart">
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ fontSize: "12px" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
