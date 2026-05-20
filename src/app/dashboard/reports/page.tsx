"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/components/dashboard/business-provider";
import { getReports } from "@/lib/db";
import { DEMO_REPORT } from "@/lib/demo-data";
import { StarRating } from "@/components/ui/star-rating";
import { SentimentPie } from "@/components/dashboard/sentiment-chart";
import type { ReputationReport } from "@/types";
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
  const { business, loading: bizLoading } = useBusiness();
  const [report, setReport] = useState<ReputationReport>(DEMO_REPORT);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      if (business) {
        const reports = await getReports(business.id);
        if (reports.length > 0) setReport(reports[0]);
      }
      setLoading(false);
    }
    if (!bizLoading) load();
  }, [business, bizLoading]);

  async function handleGenerateReport() {
    if (!business) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id }),
      });
      const data = await res.json();
      if (data.report) setReport(data.report);
    } catch {
      // Use existing report as fallback
    } finally {
      setGenerating(false);
    }
  }

  if (loading || bizLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reputation Reports</h1>
          <p className="mt-1 text-sm text-white/40">
            Monthly analysis of your review performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {generating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            {generating ? "Generating..." : "Generate Report"}
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.05]">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
        <div className="border-b border-white/[0.06] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
              <BarChart3 size={20} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Monthly Reputation Report
              </h2>
              <p className="flex items-center gap-1.5 text-sm text-white/40">
                <Calendar size={14} />
                {format(new Date(report.period_start), "dd MMM yyyy")} –{" "}
                {format(new Date(report.period_end), "dd MMM yyyy")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-sm text-white/50">Total Reviews</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-white">
              <MessageSquare size={20} className="text-cyan-400" />
              {report.total_reviews}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-sm text-white/50">Average Rating</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                {report.average_rating.toFixed(1)}
              </span>
              <StarRating rating={Math.round(report.average_rating)} size={16} />
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-sm text-white/50">Response Rate</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-white">
              <TrendingUp size={20} className="text-emerald-400" />
              {Math.round(report.response_rate * 100)}%
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-sm text-white/50">Negative Reviews</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-white">
              <AlertTriangle size={20} className="text-red-400" />
              {report.sentiment_breakdown.negative}
            </p>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <SentimentPie data={report.sentiment_breakdown} />

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
            <h3 className="text-sm font-medium text-white/50">Top Keywords</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {report.top_keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 text-sm font-medium text-cyan-400"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Lightbulb size={20} className="text-amber-500" />
            AI Recommendations
          </h3>
          <ul className="mt-4 space-y-3">
            {report.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-300"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
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
