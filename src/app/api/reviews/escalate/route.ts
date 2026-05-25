import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/supabase";
import { escalateSchema } from "@/lib/validations";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/api-auth";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);
    if (!user) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await req.json();
    const parsed = escalateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { reviewId, businessId } = parsed.data;

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        escalation: {
          id: `esc-${Date.now()}`,
          review_id: reviewId,
          business_id: businessId,
          status: "pending",
          assigned_to: null,
          notes: null,
          created_at: new Date().toISOString(),
          resolved_at: null,
        },
      });
    }

    const supabase = getServiceClient();

    const { data: escalation, error } = await supabase
      .from("escalations")
      .insert({
        review_id: reviewId,
        business_id: businessId,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from("reviews")
      .update({ escalated: true })
      .eq("id", reviewId);

    await logAudit(
      "create_escalation",
      "escalation",
      { reviewId, escalationId: escalation.id },
      businessId,
      user.id,
      req
    );

    return NextResponse.json({ escalation });
  } catch (error) {
    console.error("Error creating escalation:", error);
    return NextResponse.json(
      { error: "Failed to create escalation" },
      { status: 500 }
    );
  }
}