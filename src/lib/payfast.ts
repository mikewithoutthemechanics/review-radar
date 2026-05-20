import CryptoJS from "crypto-js";

interface PayFastParams {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first?: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  subscription_type?: string;
  billing_date?: string;
  recurring_amount?: string;
  frequency?: string;
  cycles?: string;
}

export function generatePayFastSignature(
  data: Record<string, string>,
  passphrase?: string
): string {
  const orderedKeys = Object.keys(data).sort();
  let pfParamString = orderedKeys
    .filter((key) => data[key] !== undefined && data[key] !== "")
    .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
    .join("&");

  if (passphrase) {
    pfParamString += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`;
  }

  return CryptoJS.MD5(pfParamString).toString();
}

export function buildPayFastForm(params: PayFastParams, passphrase?: string): string {
  const signature = generatePayFastSignature(
    params as unknown as Record<string, string>,
    passphrase
  );

  const isSandbox = params.merchant_id === "10000100";
  const baseUrl = isSandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

  const hiddenFields = Object.entries(params)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}" />`)
    .join("\n");

  return `
    <form action="${baseUrl}" method="POST" id="payfast-form">
      ${hiddenFields}
      <input type="hidden" name="signature" value="${signature}" />
    </form>
  `;
}

export const SUBSCRIPTION_PLANS = {
  starter: {
    name: "Starter",
    price: 499,
    reviews: 100,
    features: [
      "Up to 100 reviews/month",
      "AI auto-responses",
      "Basic sentiment analysis",
      "Email escalation alerts",
    ],
  },
  pro: {
    name: "Professional",
    price: 999,
    reviews: 500,
    features: [
      "Up to 500 reviews/month",
      "AI auto-responses",
      "Advanced sentiment analysis",
      "Priority escalation workflow",
      "Monthly reputation reports",
      "Brand voice customisation",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 2499,
    reviews: -1,
    features: [
      "Unlimited reviews",
      "AI auto-responses",
      "Advanced sentiment analysis",
      "Priority escalation workflow",
      "Weekly reputation reports",
      "Custom brand voice",
      "Multi-location support",
      "Dedicated account manager",
      "API access",
    ],
  },
} as const;
