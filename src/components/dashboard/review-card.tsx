"use client";

import { useState } from "react";
import { Review } from "@/types";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Send,
  Clock,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: Review;
  onRespond?: (reviewId: string, response: string) => void;
  onEscalate?: (reviewId: string) => void;
}

export function ReviewCard({ review, onRespond, onEscalate }: ReviewCardProps) {
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState("");
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/reviews/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewText: review.text,
          rating: review.rating,
          authorName: review.author_name,
        }),
      });
      const data = await res.json();
      setResponse(data.response || "Unable to generate response.");
    } catch {
      setResponse("Error generating response. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <User size={18} className="text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{review.author_name}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <StarRating rating={review.rating} size={14} />
              <Badge variant={review.source}>{review.source}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={14} />
          {formatDistanceToNow(new Date(review.source_created_at), { addSuffix: true })}
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-700">{review.text}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={review.sentiment}>{review.sentiment}</Badge>
          {review.responded && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <MessageSquare size={12} />
              Responded
            </span>
          )}
          {review.escalated && (
            <span className="flex items-center gap-1 text-xs text-red-600">
              <AlertTriangle size={12} />
              Escalated
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!review.responded && (
            <button
              onClick={() => setShowResponse(!showResponse)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <MessageSquare size={14} />
              Respond
            </button>
          )}
          {!review.escalated && review.rating <= 2 && (
            <button
              onClick={() => onEscalate?.(review.id)}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              <AlertTriangle size={14} />
              Escalate
            </button>
          )}
        </div>
      </div>

      {showResponse && (
        <div className="mt-4 space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Draft Response</p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              <Sparkles size={14} />
              {generating ? "Generating..." : "AI Generate"}
            </button>
          </div>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Write your response or use AI to generate one..."
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                onRespond?.(review.id, response);
                setShowResponse(false);
                setResponse("");
              }}
              disabled={!response.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              <Send size={14} />
              Send Response
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
