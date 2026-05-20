import { NextRequest, NextResponse } from "next/server";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase";

function classifySentiment(rating: number, text: string): "positive" | "neutral" | "negative" {
  if (rating <= 2) return "negative";
  if (rating === 3) {
    const negWords = ["bad", "terrible", "awful", "worst", "poor", "disappointing", "rude", "horrible"];
    const lower = text.toLowerCase();
    if (negWords.some((w) => lower.includes(w))) return "negative";
    return "neutral";
  }
  return "positive";
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
    }

    const supabase = getServiceClient();

    const { data: business } = await supabase
      .from("businesses")
      .select("google_place_id")
      .eq("id", businessId)
      .single();

    if (!business?.google_place_id) {
      return NextResponse.json({ error: "No Google Place ID configured" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Google Places API key not configured" }, { status: 503 });
    }

    const placeId = business.google_place_id;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.result?.reviews) {
      return NextResponse.json({ error: "Failed to fetch reviews from Google", details: data.status }, { status: 502 });
    }

    const reviews = data.result.reviews;
    let synced = 0;

    for (const review of reviews) {
      const sentiment = classifySentiment(review.rating, review.text || "");

      const { error } = await supabase.from("reviews").upsert(
        {
          business_id: businessId,
          source: "google",
          source_review_id: `google-${review.time}-${review.author_name?.replace(/\s/g, "")}`,
          author_name: review.author_name || "Anonymous",
          author_avatar: review.profile_photo_url || null,
          rating: review.rating,
          text: review.text || "",
          sentiment,
          source_created_at: new Date(review.time * 1000).toISOString(),
        },
        { onConflict: "business_id,source,source_review_id" }
      );

      if (!error) synced++;
    }

    return NextResponse.json({
      synced,
      total: reviews.length,
      message: `Synced ${synced} reviews from Google`,
    });
  } catch (error) {
    console.error("Error syncing Google reviews:", error);
    return NextResponse.json(
      { error: "Failed to sync reviews" },
      { status: 500 }
    );
  }
}
