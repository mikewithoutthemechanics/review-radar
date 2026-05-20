"use client";

import { DEMO_METRICS } from "@/lib/demo-data";
import { MetricCard } from "@/components/ui/metric-card";
import { ReviewCard } from "@/components/dashboard/review-card";
import { RatingChart, SentimentPie } from "@/components/dashboard/sentiment-chart";
import {
  MessageSquare,
  Star,
  BarChart3,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const metrics = DEMO_METRICS;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your review performance and reputation
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Reviews"
          value={metrics.totalReviews}
          subtitle={`${metrics.reviewsThisMonth} this month`}
          icon={<MessageSquare size={20} />}
        />
        <MetricCard
          title="Average Rating"
          value={metrics.averageRating.toFixed(1)}
          trend={metrics.ratingTrend}
          icon={<Star size={20} />}
        />
        <MetricCard
          title="Response Rate"
          value={`${Math.round(metrics.responseRate * 100)}%`}
          subtitle="Target: 95%"
          icon={<BarChart3 size={20} />}
        />
        <MetricCard
          title="Pending Escalations"
          value={metrics.pendingEscalations}
          subtitle="Needs attention"
          icon={<AlertTriangle size={20} />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <RatingChart data={metrics.ratingOverTime} />
        <SentimentPie data={metrics.sentimentBreakdown} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <TrendingUp size={20} />
            Recent Reviews
          </h2>
        </div>
        <div className="space-y-4">
          {metrics.recentReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
