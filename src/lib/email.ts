import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

const FROM_EMAIL = process.env.EMAIL_FROM || "ReviewRadar <noreply@reviewradar.co.za>";

export async function sendEscalationAlert(
  toEmail: string,
  businessName: string,
  reviewerName: string,
  reviewText: string,
  rating: number
) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: `[Escalation] Negative review from ${reviewerName} — ${businessName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Review Escalation Alert</h2>
        <p>A negative review has been flagged for <strong>${businessName}</strong>:</p>
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>${reviewerName}</strong> — ${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
          <p style="color: #666;">${reviewText}</p>
        </div>
        <p>Please log in to <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://reviewradar.co.za"}/dashboard/escalations">ReviewRadar</a> to respond.</p>
      </div>
    `,
  });
}

export async function sendWeeklyDigest(
  toEmail: string,
  businessName: string,
  stats: {
    totalReviews: number;
    newReviews: number;
    avgRating: number;
    responseRate: number;
    pendingEscalations: number;
  }
) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: `Weekly Review Digest — ${businessName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">ReviewRadar Weekly Digest</h2>
        <p>Here's your review performance for <strong>${businessName}</strong> this week:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>New Reviews</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${stats.newReviews}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total Reviews</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${stats.totalReviews}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Average Rating</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${stats.avgRating.toFixed(1)} / 5</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Response Rate</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${Math.round(stats.responseRate * 100)}%</td></tr>
          <tr><td style="padding: 8px;"><strong>Pending Escalations</strong></td><td style="padding: 8px;">${stats.pendingEscalations}</td></tr>
        </table>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://reviewradar.co.za"}/dashboard">View Full Dashboard →</a></p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(toEmail: string, businessName: string) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: `Welcome to ReviewRadar — ${businessName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">Welcome to ReviewRadar! 🎉</h2>
        <p>Hi there! Your account for <strong>${businessName}</strong> has been created.</p>
        <p>Here's what to do next:</p>
        <ol>
          <li>Go to <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://reviewradar.co.za"}/dashboard/settings">Settings</a> and add your Google Place ID</li>
          <li>Configure your AI brand voice so responses match your tone</li>
          <li>Sync your reviews and let the AI start drafting responses</li>
        </ol>
        <p>Your 14-day free trial is now active. No credit card required.</p>
        <p>Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://reviewradar.co.za"}">website</a>.</p>
      </div>
    `,
  });
}
