import { NextRequest, NextResponse } from "next/server";
import { generateReviewResponse } from "@/lib/groq";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import { respondSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimit(`respond:${ip}`, 10, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = respondSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { reviewId, reviewText, rating, authorName, brandVoice, businessName, businessId } = parsed.data;

    const response = await generateReviewResponse(
      reviewText,
      rating,
      authorName,
      brandVoice || "Professional, warm, and appreciative",
      businessName || "Our Business"
    );

    if (isSupabaseConfigured() && reviewId && businessId) {
      const supabase = getServiceClient();

      await supabase.from("review_responses").insert({
        review_id: reviewId,
        business_id: businessId,
        response_text: response,
        ai_generated: true,
      });

      await supabase
        .from("reviews")
        .update({ responded: true })
        .eq("id", reviewId);
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
