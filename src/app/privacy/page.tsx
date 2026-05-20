import { Radar } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          <Radar className="h-6 w-6 text-cyan-400" />
          <span className="text-lg font-bold text-white">ReviewRadar</span>
        </Link>

        <h1 className="mt-8 text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-white/40">
          Last updated: May 2026 — Compliant with POPIA (Protection of Personal Information Act, 2013)
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-white/60">
          <section>
            <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
            <p className="mt-2">
              We collect the following personal information when you register and use ReviewRadar:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Your name and email address (provided during registration)</li>
              <li>Business name, industry, and review platform identifiers (Google Place ID, Facebook Page ID)</li>
              <li>Reviews and ratings from connected platforms (Google, Facebook)</li>
              <li>AI-generated and manually written review responses</li>
              <li>Payment information (processed securely via PayFast — we do not store card details)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. Purpose of Processing</h2>
            <p className="mt-2">
              We process your personal information for the following purposes:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>To provide the ReviewRadar service, including review aggregation, AI response generation, and reputation reporting</li>
              <li>To authenticate your identity and secure your account</li>
              <li>To process subscription payments via PayFast</li>
              <li>To send transactional emails (escalation alerts, weekly digests, account notifications)</li>
              <li>To improve our service through anonymised, aggregated analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Lawful Basis for Processing</h2>
            <p className="mt-2">
              Under POPIA, we process your information based on: (a) your consent provided during registration;
              (b) the necessity to perform our contract with you; and (c) our legitimate interest in improving the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Data Sharing and Third Parties</h2>
            <p className="mt-2">
              We share data with the following third-party processors:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li><strong>Supabase</strong> — Database hosting and authentication (data stored in secure cloud infrastructure)</li>
              <li><strong>Groq</strong> — AI response generation (review text is sent for processing; no data is retained by Groq)</li>
              <li><strong>PayFast</strong> — Payment processing (South African payment gateway, PCI-DSS compliant)</li>
              <li><strong>Resend</strong> — Transactional email delivery</li>
              <li><strong>Google / Facebook APIs</strong> — Review data ingestion from your connected accounts</li>
            </ul>
            <p className="mt-2">
              We do not sell your personal information to any third party.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Data Retention</h2>
            <p className="mt-2">
              We retain your personal information for as long as your account is active. If you close your account,
              we will delete your personal information within 30 days, except where we are required by law to retain it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">6. Your Rights Under POPIA</h2>
            <p className="mt-2">You have the right to:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to the processing of your information</li>
              <li>Withdraw your consent at any time</li>
              <li>Lodge a complaint with the Information Regulator</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">7. Security</h2>
            <p className="mt-2">
              We implement appropriate technical and organisational measures to protect your personal information,
              including encryption in transit (TLS), Row Level Security policies in our database, and secure API authentication.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">8. Contact</h2>
            <p className="mt-2">
              For any privacy-related enquiries or to exercise your rights, please contact our Information Officer
              at <span className="text-cyan-400">privacy@reviewradar.co.za</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
