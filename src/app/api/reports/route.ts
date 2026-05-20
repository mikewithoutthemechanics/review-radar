import { NextRequest, NextResponse } from "next/server";
import { generateReportInsights } from "@/lib/groq";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import { DEMO_METRICS, DEMO_REPORT } from "@/lib/demo-data";
import { reportSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { businessId } = parsed.data;
    let metrics = { ...DEMO_METRICS };
    let businessName = "Demo Business";
    const topKeywords = [...DEMO_REPORT.top_keywords];

    if (isSupabaseConfigured()) {
      const supabase = getServiceClient();

      const { data: biz } = await supabase
        .from("businesses")
        .select("name")
        .eq("id", businessId)
        .single();
      if (biz) businessName = biz.name;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: reviews } = await supabase
        .from("reviews")
        .select("*")
        .eq("business_id", businessId)
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (reviews && reviews.length > 0) {
        const total = reviews.length;
        const avgRating =
          reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / total;
        const responded = reviews.filter((r: { responded: boolean }) => r.responded).length;
        const positive = reviews.filter((r: { sentiment: string }) => r.sentiment === "positive").length;
        const neutral = reviews.filter((r: { sentiment: string }) => r.sentiment === "neutral").length;
        const negative = reviews.filter((r: { sentiment: string }) => r.sentiment === "negative").length;

        metrics = {
          ...metrics,
          totalReviews: total,
          averageRating: avgRating,
          responseRate: responded / total,
          sentimentBreakdown: { positive, neutral, negative },
        };
      }
    }

    let recommendations: string[];
    try {
      recommendations = await generateReportInsights(
        {
          totalReviews: metrics.totalReviews,
          averageRating: metrics.averageRating,
          responseRate: metrics.responseRate,
          sentimentBreakdown: metrics.sentimentBreakdown,
          topKeywords,
        },
        businessName
      );
    } catch {
      recommendations = DEMO_REPORT.recommendations;
    }

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const report = {
      id: `rpt-${Date.now()}`,
      business_id: businessId,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      total_reviews: metrics.totalReviews,
      average_rating: metrics.averageRating,
      response_rate: metrics.responseRate,
      sentiment_breakdown: metrics.sentimentBreakdown,
      top_keywords: topKeywords,
      recommendations,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = getServiceClient();
      await supabase.from("reputation_reports").insert(report);
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
