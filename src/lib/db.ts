import { createBrowserSupabaseClient, getServiceClient, isSupabaseConfigured } from "./supabase";
import { DEMO_REVIEWS, DEMO_ESCALATIONS, DEMO_METRICS, DEMO_REPORT } from "./demo-data";
import type { Review, Escalation, Business, ReputationReport, DashboardMetrics, EscalationStatus } from "@/types";

// ─── Business ────────────────────────────────────────────────────

export async function getBusinessForUser(userId: string): Promise<Business | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createBrowserSupabaseClient();
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

export async function createBusiness(
  userId: string,
  name: string,
  industry: string
): Promise<Business | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createBrowserSupabaseClient();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const { data } = await supabase
    .from("businesses")
    .insert({ user_id: userId, name, slug, industry })
    .select()
    .single();
  return data;
}

export async function updateBusiness(
  businessId: string,
  updates: Partial<Business>
): Promise<Business | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createBrowserSupabaseClient();
  const { data } = await supabase
    .from("businesses")
    .update(updates)
    .eq("id", businessId)
    .select()
    .single();
  return data;
}

// ─── Reviews ─────────────────────────────────────────────────────

export async function getReviews(businessId: string): Promise<Review[]> {
  if (!isSupabaseConfigured()) return DEMO_REVIEWS;
  const supabase = createBrowserSupabaseClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });
  return data ?? DEMO_REVIEWS;
}

export async function markReviewResponded(reviewId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createBrowserSupabaseClient();
  await supabase.from("reviews").update({ responded: true }).eq("id", reviewId);
}

export async function markReviewEscalated(reviewId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createBrowserSupabaseClient();
  await supabase.from("reviews").update({ escalated: true }).eq("id", reviewId);
}

// ─── Review Responses ────────────────────────────────────────────

export async function saveReviewResponse(
  reviewId: string,
  businessId: string,
  responseText: string,
  aiGenerated: boolean
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createBrowserSupabaseClient();
  await supabase.from("review_responses").insert({
    review_id: reviewId,
    business_id: businessId,
    response_text: responseText,
    ai_generated: aiGenerated,
    approved: !aiGenerated,
    posted: false,
  });
  await markReviewResponded(reviewId);
}

// ─── Escalations ─────────────────────────────────────────────────

export async function getEscalations(businessId: string): Promise<Escalation[]> {
  if (!isSupabaseConfigured()) return DEMO_ESCALATIONS;
  const supabase = createBrowserSupabaseClient();
  const { data: escalations } = await supabase
    .from("escalations")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (!escalations) return DEMO_ESCALATIONS;

  // Fetch associated reviews
  const reviewIds = escalations.map((e) => e.review_id);
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .in("id", reviewIds);

  const reviewMap = new Map((reviews ?? []).map((r) => [r.id, r]));
  return escalations.map((e) => ({ ...e, review: reviewMap.get(e.review_id) }));
}

export async function createEscalation(
  reviewId: string,
  businessId: string
): Promise<Escalation | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createBrowserSupabaseClient();
  const { data } = await supabase
    .from("escalations")
    .insert({ review_id: reviewId, business_id: businessId, status: "pending" })
    .select()
    .single();
  await markReviewEscalated(reviewId);
  return data;
}

export async function updateEscalationStatus(
  escalationId: string,
  status: EscalationStatus,
  assignedTo?: string,
  notes?: string
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createBrowserSupabaseClient();
  const updates: Record<string, unknown> = { status };
  if (status === "resolved") updates.resolved_at = new Date().toISOString();
  if (assignedTo !== undefined) updates.assigned_to = assignedTo;
  if (notes !== undefined) updates.notes = notes;
  await supabase.from("escalations").update(updates).eq("id", escalationId);
}

export async function addEscalationNote(
  escalationId: string,
  existingNotes: string | null,
  newNote: string
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createBrowserSupabaseClient();
  const combined = existingNotes ? `${existingNotes}\n${newNote}` : newNote;
  await supabase.from("escalations").update({ notes: combined }).eq("id", escalationId);
}

// ─── Reports ─────────────────────────────────────────────────────

export async function getReports(businessId: string): Promise<ReputationReport[]> {
  if (!isSupabaseConfigured()) return [DEMO_REPORT];
  const supabase = createBrowserSupabaseClient();
  const { data } = await supabase
    .from("reputation_reports")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });
  return data?.length ? data : [DEMO_REPORT];
}

export async function saveReport(report: Omit<ReputationReport, "id" | "created_at">): Promise<ReputationReport | null> {
  if (!isSupabaseConfigured()) return null;
  const serviceClient = getServiceClient();
  const { data } = await serviceClient
    .from("reputation_reports")
    .insert(report)
    .select()
    .single();
  return data;
}

// ─── Dashboard Metrics ───────────────────────────────────────────

export async function getDashboardMetrics(businessId: string): Promise<DashboardMetrics> {
  if (!isSupabaseConfigured()) return DEMO_METRICS;
  const supabase = createBrowserSupabaseClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (!reviews || reviews.length === 0) return DEMO_METRICS;

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const respondedCount = reviews.filter((r) => r.responded).length;
  const responseRate = respondedCount / totalReviews;

  const { count: pendingEscalations } = await supabase
    .from("escalations")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .in("status", ["pending", "in_progress"]);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
  const thisMonthReviews = reviews.filter((r) => r.created_at >= thirtyDaysAgo);

  const sentimentBreakdown = {
    positive: reviews.filter((r) => r.sentiment === "positive").length,
    neutral: reviews.filter((r) => r.sentiment === "neutral").length,
    negative: reviews.filter((r) => r.sentiment === "negative").length,
  };

  // Group by month for rating over time
  const monthlyData = new Map<string, { total: number; count: number }>();
  reviews.forEach((r) => {
    const month = new Date(r.created_at).toLocaleDateString("en-ZA", { month: "short" });
    const existing = monthlyData.get(month) || { total: 0, count: 0 };
    monthlyData.set(month, { total: existing.total + r.rating, count: existing.count + 1 });
  });

  const ratingOverTime = Array.from(monthlyData.entries()).map(([date, { total, count }]) => ({
    date,
    rating: Math.round((total / count) * 10) / 10,
    count,
  }));

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    responseRate,
    pendingEscalations: pendingEscalations ?? 0,
    reviewsThisMonth: thisMonthReviews.length,
    ratingTrend: 0,
    sentimentBreakdown,
    recentReviews: reviews.slice(0, 5),
    ratingOverTime,
  };
}

// ─── Server-side: Insert review from external source ─────────────

export async function insertReviewFromSource(
  businessId: string,
  source: "google" | "facebook",
  sourceReviewId: string,
  authorName: string,
  authorAvatar: string | null,
  rating: number,
  text: string,
  sentiment: "positive" | "neutral" | "negative",
  sourceCreatedAt: string
): Promise<Review | null> {
  const serviceClient = getServiceClient();
  const { data } = await serviceClient
    .from("reviews")
    .upsert(
      {
        business_id: businessId,
        source,
        source_review_id: sourceReviewId,
        author_name: authorName,
        author_avatar: authorAvatar,
        rating,
        text,
        sentiment,
        source_created_at: sourceCreatedAt,
      },
      { onConflict: "business_id,source,source_review_id" }
    )
    .select()
    .single();
  return data;
}
