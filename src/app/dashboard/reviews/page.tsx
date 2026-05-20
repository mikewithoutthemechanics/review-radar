"use client";

import { useState } from "react";
import { DEMO_REVIEWS } from "@/lib/demo-data";
import { ReviewCard } from "@/components/dashboard/review-card";
import { Review, ReviewSource, ReviewSentiment } from "@/types";
import { Search, Filter, MessageSquare } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(DEMO_REVIEWS);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<ReviewSource | "all">("all");
  const [sentimentFilter, setSentimentFilter] = useState<ReviewSentiment | "all">("all");
  const [respondedFilter, setRespondedFilter] = useState<"all" | "responded" | "pending">(
    "all"
  );

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleRespond(reviewId: string, responseText: string) {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, responded: true } : r))
    );
  }

  function handleEscalate(reviewId: string) {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, escalated: true } : r))
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
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
            placeholder="Search reviews..."
          />
        </div>

        <div className="flex items-center gap-2">
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

      <div className="space-y-4">
        {filtered.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onRespond={handleRespond}
            onEscalate={handleEscalate}
          />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-12 text-center">
            <MessageSquare size={40} className="mx-auto text-white/20" />
            <p className="mt-4 text-sm text-white/40">No reviews found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
