import { NextRequest, NextResponse } from "next/server";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/lib/api-auth";
import { z } from "zod";

const exportSchema = z.object({
  businessId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);
    if (!user) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await req.json();
    const parsed = exportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { businessId } = parsed.data;

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
    }

    const supabase = getServiceClient();

    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("user_id, name")
      .eq("id", businessId)
      .single();

    if (bizError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    if (business.user_id !== user.id) {
      return forbiddenResponse("Access denied");
    }

    const [{ data: reviews }, { data: responses }, { data: escalations }, { data: reports }] = await Promise.all([
      supabase.from("reviews").select("*").eq("business_id", businessId),
      supabase.from("review_responses").select("*").eq("business_id", businessId),
      supabase.from("escalations").select("*").eq("business_id", businessId),
      supabase.from("reputation_reports").select("*").eq("business_id", businessId),
    ]);

    const exportData = {
      business: {
        id: businessId,
        name: business.name,
        exported_at: new Date().toISOString(),
      },
      reviews: reviews ?? [],
      responses: responses ?? [],
      escalations: escalations ?? [],
      reports: reports ?? [],
    };

    return NextResponse.json({
      success: true,
      data: exportData,
      summary: {
        reviews_count: reviews?.length ?? 0,
        responses_count: responses?.length ?? 0,
        escalations_count: escalations?.length ?? 0,
        reports_count: reports?.length ?? 0,
      },
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}