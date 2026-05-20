"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/components/dashboard/business-provider";
import { getReviews, saveReviewResponse, createEscalation } from "@/lib/db";
import { DEMO_REVIEWS } from "@/lib/demo-data";
import { ReviewCard } from "@/components/dashboard/review-card";
import { Review, ReviewSource, ReviewSentiment } from "@/types";
import { Search, Filter, MessageSquare, Loader2 } from "lucide-react";

export default function ReviewsPage() {
  const { business, loading: bizLoading } = useBusiness();
  const [reviews, setReviews] = useState<Review[]>(DEMO_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<ReviewSource | "all">("all");
  const [sentimentFilter, setSentimentFilter] = useState<ReviewSentiment | "all">("all");
  const [respondedFilter, setRespondedFilter] = useState<"all" | "responded" | "pending">("all");

  useEffect(() => {
    async function load() {
      if (business) {
        const data = await getReviews(business.id);
        setReviews(data);
      }
      setLoading(false);
    }
    if (!bizLoading) load();
  }, [business, bizLoading]);

  const filtered = reviews.filter((r) => {
    if (search && !r.text.toLowerCase().includes(search.toLowerCase()) && !r.author_name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (sourceFilter !== "all" && r.source !== sourceFilter) return false;
    if (sentimentFilter !== "all" && r.sentiment !== sentimentFilter) return false;
    if (respondedFilter === "responded" && !r.responded) return false;
    if (respondedFilter === "pending" && r.responded) return false;
    return true;
  });

  async function handleRespond(reviewId: string, responseText: string) {
    if (business) {
      await saveReviewResponse(reviewId, business.id, responseText, false);
    }
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, responded: true } : r))
    );
  }

  async function handleEscalate(reviewId: string) {
    if (business) {
      await createEscalation(reviewId, business.id);
    }
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, escalated: true } : r))
    );
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Reviews</h1>
        <p className="mt-1 text-sm text-white/40">
          Manage and respond to all your customer reviews
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
            placeholder="Search reviews..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter size={16} className="text-white/30" />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as ReviewSource | "all")}
            className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
          >
            <option value="all" className="bg-[#0c0c14]">All Sources</option>
            <option value="google" className="bg-[#0c0c14]">Google</option>
            <option value="facebook" className="bg-[#0c0c14]">Facebook</option>
          </select>

          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value as ReviewSentiment | "all")}
            className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
          >
            <option value="all" className="bg-[#0c0c14]">All Sentiment</option>
            <option value="positive" className="bg-[#0c0c14]">Positive</option>
            <option value="neutral" className="bg-[#0c0c14]">Neutral</option>
            <option value="negative" className="bg-[#0c0c14]">Negative</option>
          </select>

          <select
            value={respondedFilter}
            onChange={(e) =>
              setRespondedFilter(e.target.value as "all" | "responded" | "pending")
            }
            className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
          >
            <option value="all" className="bg-[#0c0c14]">All Status</option>
            <option value="responded" className="bg-[#0c0c14]">Responded</option>
            <option value="pending" className="bg-[#0c0c14]">Pending</option>
          </select>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-white/40">
        <MessageSquare size={16} />
        {filtered.length} review{filtered.length !== 1 ? "s" : ""}
        {search || sourceFilter !== "all" || sentimentFilter !== "all" || respondedFilter !== "all"
          ? " (filtered)"
          : ""}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-white/20 mb-4" />
          <p className="text-white/50">No reviews found</p>
          <p className="text-sm text-white/30 mt-1">
            {reviews.length === 0
              ? "Reviews will appear here once they are synced from Google or Facebook."
              : "Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onRespond={handleRespond}
              onEscalate={handleEscalate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
