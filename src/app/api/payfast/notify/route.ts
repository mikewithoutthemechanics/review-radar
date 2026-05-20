import { NextRequest, NextResponse } from "next/server";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import { createHash } from "crypto";

function validatePayFastSignature(data: Record<string, string>, passphrase?: string): boolean {
  const signature = data.signature;
  if (!signature) return false;

  const params = { ...data };
  delete params.signature;

  const orderedKeys = Object.keys(params).sort();
  let paramString = orderedKeys
    .filter((key) => params[key] !== "")
    .map((key) => `${key}=${encodeURIComponent(params[key]).replace(/%20/g, "+")}`)
    .join("&");

  if (passphrase) {
    paramString += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`;
  }

  const hash = createHash("md5").update(paramString).digest("hex");
  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const data: Record<string, string> = {};
    params.forEach((value, key) => {
      data[key] = value;
    });

    const passphrase = process.env.PAYFAST_PASSPHRASE;
    if (passphrase && !validatePayFastSignature(data, passphrase)) {
      console.error("PayFast ITN: Invalid signature");
      return new NextResponse("Invalid signature", { status: 403 });
    }

    const paymentStatus = data.payment_status;
    const paymentId = data.m_payment_id;
    const customStr1 = data.custom_str1;

    console.log(`PayFast ITN: payment ${paymentId} status ${paymentStatus}`);

    if (paymentStatus === "COMPLETE" && isSupabaseConfigured() && customStr1) {
      const supabase = getServiceClient();

      const tier = data.custom_str2 || "pro";
      await supabase
        .from("businesses")
        .update({ subscription_tier: tier })
        .eq("id", customStr1);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("PayFast ITN error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
