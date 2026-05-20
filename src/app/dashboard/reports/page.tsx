"use client";

import { useState } from "react";
import { DEMO_REPORT } from "@/lib/demo-data";
import { StarRating } from "@/components/ui/star-rating";
import { SentimentPie } from "@/components/dashboard/sentiment-chart";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

export default function ReportsPage() {
  const [report] = useState(DEMO_REPORT);
  const [generating, setGenerating] = useState(false);

  async function handleGenerateReport() {
    setGenerating(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: "biz-1" }),
      });
      await res.json();
    } catch {
      // Use demo data as fallback
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reputation Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monthly analysis of your review performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {generating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            {generating ? "Generating..." : "Generate Report"}
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <BarChart3 size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Monthly Reputation Report
              </h2>
              <p className="flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar size={14} />
                {format(new Date(report.period_start), "dd MMM yyyy")} –{" "}
                {format(new Date(report.period_end), "dd MMM yyyy")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Total Reviews</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <MessageSquare size={20} className="text-blue-500" />
              {report.total_reviews}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Average Rating</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {report.average_rating.toFixed(1)}
              </span>
              <StarRating rating={Math.round(report.average_rating)} size={16} />
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Response Rate</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <TrendingUp size={20} className="text-emerald-500" />
              {Math.round(report.response_rate * 100)}%
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Negative Reviews</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <AlertTriangle size={20} className="text-red-500" />
              {report.sentiment_breakdown.negative}
            </p>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <SentimentPie data={report.sentiment_breakdown} />

          <div className="rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">Top Keywords</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {report.top_keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Lightbulb size={20} className="text-amber-500" />
            AI Recommendations
          </h3>
          <ul className="mt-4 space-y-3">
            {report.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-900"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
