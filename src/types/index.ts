export type ReviewSource = "google" | "facebook";
export type ReviewSentiment = "positive" | "neutral" | "negative";
export type EscalationStatus = "pending" | "in_progress" | "resolved" | "dismissed";
export type SubscriptionTier = "free" | "starter" | "pro" | "enterprise";

export interface AuditLog {
  id: string;
  business_id: string | null;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  industry: string;
  google_place_id: string | null;
  facebook_page_id: string | null;
  brand_voice: string;
  auto_respond: boolean;
  escalation_threshold: number;
  subscription_tier: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  source: ReviewSource;
  source_review_id: string;
  author_name: string;
  author_avatar: string | null;
  rating: number;
  text: string;
  sentiment: ReviewSentiment;
  responded: boolean;
  escalated: boolean;
  created_at: string;
  source_created_at: string;
}

export interface ReviewResponse {
  id: string;
  review_id: string;
  business_id: string;
  response_text: string;
  ai_generated: boolean;
  approved: boolean;
  posted: boolean;
  created_at: string;
}

export interface Escalation {
  id: string;
  review_id: string;
  business_id: string;
  status: EscalationStatus;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  resolved_at: string | null;
  review?: Review;
}

export interface ReputationReport {
  id: string;
  business_id: string;
  period_start: string;
  period_end: string;
  total_reviews: number;
  average_rating: number;
  response_rate: number;
  sentiment_breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  top_keywords: string[];
  recommendations: string[];
  created_at: string;
}

export interface DashboardMetrics {
  totalReviews: number;
  averageRating: number;
  responseRate: number;
  pendingEscalations: number;
  reviewsThisMonth: number;
  ratingTrend: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentReviews: Review[];
  ratingOverTime: { date: string; rating: number; count: number }[];
}
