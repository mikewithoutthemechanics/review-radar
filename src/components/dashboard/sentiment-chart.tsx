"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const SENTIMENT_COLORS = {
  positive: "#10b981",
  neutral: "#f59e0b",
  negative: "#ef4444",
};

interface RatingChartProps {
  data: { date: string; rating: number; count: number }[];
}

export function RatingChart({ data }: RatingChartProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-white/50">Rating Trend</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.35)" }} stroke="rgba(255,255,255,0.1)" />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: "rgba(255,255,255,0.35)" }} stroke="rgba(255,255,255,0.1)" />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "rgba(12,12,20,0.95)",
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
              }}
            />
            <Bar dataKey="rating" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface SentimentPieProps {
  data: { positive: number; neutral: number; negative: number };
}

export function SentimentPie({ data }: SentimentPieProps) {
  const chartData = [
    { name: "Positive", value: data.positive },
    { name: "Neutral", value: data.neutral },
    { name: "Negative", value: data.negative },
  ];

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-white/50">Sentiment Breakdown</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    SENTIMENT_COLORS[
                      entry.name.toLowerCase() as keyof typeof SENTIMENT_COLORS
                    ]
                  }
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "rgba(12,12,20,0.95)",
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-center gap-4">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor:
                  SENTIMENT_COLORS[
                    entry.name.toLowerCase() as keyof typeof SENTIMENT_COLORS
                  ],
              }}
            />
            <span className="text-xs text-white/50">
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
