import { NextRequest, NextResponse } from "next/server";
import { generateReportInsights } from "@/lib/groq";
import { DEMO_METRICS, DEMO_REPORT } from "@/lib/demo-data";

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    // In production, fetch real data from Supabase
    const metrics = DEMO_METRICS;

    let recommendations: string[];
    try {
      recommendations = await generateReportInsights(
        {
          totalReviews: metrics.totalReviews,
          averageRating: metrics.averageRating,
          responseRate: metrics.responseRate,
          sentimentBreakdown: metrics.sentimentBreakdown,
          topKeywords: DEMO_REPORT.top_keywords,
        },
        "Demo Business"
      );
    } catch {
      recommendations = DEMO_REPORT.recommendations;
    }

    const report = {
      ...DEMO_REPORT,
      id: `rpt-${Date.now()}`,
      business_id: businessId,
      recommendations,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
