import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const data: Record<string, string> = {};
    params.forEach((value, key) => {
      data[key] = value;
    });

    const paymentStatus = data.payment_status;
    const paymentId = data.m_payment_id;

    console.log(`PayFast ITN: payment ${paymentId} status ${paymentStatus}`);

    if (paymentStatus === "COMPLETE") {
      // In production, update subscription status in Supabase
      // await supabase.from('businesses').update({ subscription_tier: 'pro' }).eq('id', paymentId);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("PayFast ITN error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
