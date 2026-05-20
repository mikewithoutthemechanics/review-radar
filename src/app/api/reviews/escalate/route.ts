import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { reviewId, businessId } = await req.json();

    // In production, this would create an escalation record in Supabase
    // and send notification emails via Resend
    const escalation = {
      id: `esc-${Date.now()}`,
      review_id: reviewId,
      business_id: businessId,
      status: "pending",
      assigned_to: null,
      notes: null,
      created_at: new Date().toISOString(),
      resolved_at: null,
    };

    return NextResponse.json({ escalation });
  } catch (error) {
    console.error("Error creating escalation:", error);
    return NextResponse.json(
      { error: "Failed to create escalation" },
      { status: 500 }
    );
  }
}
