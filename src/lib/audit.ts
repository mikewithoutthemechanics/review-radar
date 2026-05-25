import { getServiceClient, isSupabaseConfigured } from "./supabase";
import type { AuditLog } from "@/types";

export async function logAudit(
  action: string,
  resourceType: string,
  details: Record<string, unknown> = {},
  businessId?: string,
  userId?: string,
  request?: Request
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const serviceClient = getServiceClient();

  const ipAddress = request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = request?.headers?.get("user-agent");

  await serviceClient.from("audit_logs").insert({
    business_id: businessId,
    user_id: userId,
    action,
    resource_type: resourceType,
    resource_id: details.resourceId || null,
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}

export async function getAuditLogs(
  businessId: string,
  limit = 100
): Promise<AuditLog[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getServiceClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}