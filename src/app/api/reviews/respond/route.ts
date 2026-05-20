import { NextRequest, NextResponse } from "next/server";
import { generateReviewResponse } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { reviewText, rating, authorName, brandVoice, businessName } =
      await req.json();

    const response = await generateReviewResponse(
      reviewText,
      rating,
      authorName,
      brandVoice || "Professional, warm, and appreciative",
      businessName || "Our Business"
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
