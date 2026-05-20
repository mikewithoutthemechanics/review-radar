"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/components/dashboard/business-provider";
import { updateBusiness } from "@/lib/db";
import {
  Building2,
  Mic,
  Bell,
  CreditCard,
  Save,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/payfast";

export default function SettingsPage() {
  const { business, loading: bizLoading, reload } = useBusiness();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    businessName: "",
    industry: "general",
    googlePlaceId: "",
    facebookPageId: "",
    brandVoice:
      "Professional yet warm. We care deeply about our customers and want them to feel valued. Use South African English.",
    autoRespond: true,
    escalationThreshold: 2,
    emailNotifications: true,
    escalationAlerts: true,
    weeklyDigest: true,
    currentPlan: "free" as string,
  });

  useEffect(() => {
    if (business) {
      setSettings({
        businessName: business.name,
        industry: business.industry,
        googlePlaceId: business.google_place_id ?? "",
        facebookPageId: business.facebook_page_id ?? "",
        brandVoice: business.brand_voice,
        autoRespond: business.auto_respond,
        escalationThreshold: business.escalation_threshold,
        emailNotifications: true,
        escalationAlerts: true,
        weeklyDigest: true,
        currentPlan: business.subscription_tier,
      });
    }
  }, [business]);

  async function handleSave() {
    if (!business) return;
    setSaving(true);
    await updateBusiness(business.id, {
      name: settings.businessName,
      industry: settings.industry,
      google_place_id: settings.googlePlaceId || null,
      facebook_page_id: settings.facebookPageId || null,
      brand_voice: settings.brandVoice,
      auto_respond: settings.autoRespond,
      escalation_threshold: settings.escalationThreshold,
    });
    await reload();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateSetting<K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (bizLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="mt-1 text-sm text-white/40">
            Configure your business profile and AI behaviour
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {saved ? <CheckCircle2 size={16} /> : saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Business Profile */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Building2 size={20} />
            Business Profile
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/60">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => updateSetting("businessName", e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60">Industry</label>
              <select
                value={settings.industry}
                onChange={(e) => updateSetting("industry", e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none [&>option]:bg-[#0c0c14]"
              >
                <option value="general">General Business</option>
                <option value="dental">Dental Practice</option>
                <option value="medical">Medical Practice</option>
                <option value="restaurant">Restaurant / Café</option>
                <option value="salon">Salon / Spa</option>
                <option value="automotive">Automotive / Mechanic</option>
                <option value="retail">Retail Store</option>
                <option value="hospitality">Hospitality / B&B</option>
                <option value="fitness">Gym / Fitness</option>
                <option value="legal">Legal Services</option>
                <option value="accounting">Accounting / Financial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60">
                Google Place ID
              </label>
              <input
                type="text"
                value={settings.googlePlaceId}
                onChange={(e) => updateSetting("googlePlaceId", e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                placeholder="ChIJ..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60">
                Facebook Page ID
              </label>
              <input
                type="text"
                value={settings.facebookPageId}
                onChange={(e) => updateSetting("facebookPageId", e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                placeholder="Enter Facebook Page ID"
              />
            </div>
          </div>
        </div>

        {/* AI Brand Voice */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Mic size={20} />
            AI Brand Voice
          </h2>
          <p className="mt-1 text-sm text-white/40">
            Describe how you want the AI to respond to reviews. The more detail, the
            better the responses.
          </p>
          <textarea
            value={settings.brandVoice}
            onChange={(e) => updateSetting("brandVoice", e.target.value)}
            rows={4}
            className="mt-4 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
          />
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.autoRespond}
                onChange={(e) => updateSetting("autoRespond", e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/[0.03] text-cyan-500 focus:ring-cyan-500/30"
              />
              <span className="text-sm text-white/60">Enable auto-respond</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Escalate reviews rated</span>
              <select
                value={settings.escalationThreshold}
                onChange={(e) =>
                  updateSetting("escalationThreshold", Number(e.target.value))
                }
                className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-sm text-white focus:border-cyan-500/50 focus:outline-none [&>option]:bg-[#0c0c14]"
              >
                <option value={1}>1 star</option>
                <option value={2}>2 stars or below</option>
                <option value={3}>3 stars or below</option>
              </select>
              <span className="text-sm text-white/60">and below</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Bell size={20} />
            Notifications
          </h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => updateSetting("emailNotifications", e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/[0.03] text-cyan-500 focus:ring-cyan-500/30"
              />
              <div>
                <span className="text-sm font-medium text-white/70">
                  Email notifications for new reviews
                </span>
                <p className="text-xs text-white/40">
                  Get notified when a new review is posted
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.escalationAlerts}
                onChange={(e) => updateSetting("escalationAlerts", e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/[0.03] text-cyan-500 focus:ring-cyan-500/30"
              />
              <div>
                <span className="text-sm font-medium text-white/70">
                  Escalation alerts
                </span>
                <p className="text-xs text-white/40">
                  Instant notification when a review is escalated
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) => updateSetting("weeklyDigest", e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/[0.03] text-cyan-500 focus:ring-cyan-500/30"
              />
              <div>
                <span className="text-sm font-medium text-white/70">Weekly digest</span>
                <p className="text-xs text-white/40">
                  Summary of review activity sent every Monday
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <CreditCard size={20} />
            Subscription
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-xl border p-4 ${
                  settings.currentPlan === key
                    ? "border-cyan-500/30 bg-cyan-500/10 ring-2 ring-cyan-500/20"
                    : "border-white/[0.06] bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{plan.name}</h3>
                  {settings.currentPlan === key && (
                    <span className="rounded-full bg-cyan-500 px-2 py-0.5 text-xs text-white">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-1 text-2xl font-bold text-white">
                  R{plan.price}
                  <span className="text-sm font-normal text-white/40">/mo</span>
                </p>
                {settings.currentPlan !== key && (
                  <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-white/[0.06] py-2 text-sm font-medium text-white/60 hover:bg-white/[0.05]">
                    <ExternalLink size={14} />
                    Upgrade
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/40">
            Payments processed securely via PayFast. All prices in ZAR.
          </p>
        </div>
      </div>
    </div>
  );
}
