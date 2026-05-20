"use client";

import { useState } from "react";
import {
  Building2,
  Mic,
  Bell,
  CreditCard,
  Save,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/payfast";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    businessName: "Smile Dental Sandton",
    industry: "dental",
    googlePlaceId: "",
    facebookPageId: "",
    brandVoice:
      "Professional yet warm. We care deeply about our patients and want them to feel valued. Use South African English. Be empathetic with complaints and offer to resolve issues personally.",
    autoRespond: true,
    escalationThreshold: 2,
    emailNotifications: true,
    escalationAlerts: true,
    weeklyDigest: true,
    currentPlan: "pro" as const,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateSetting<K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure your business profile and AI behaviour
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Business Profile */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Building2 size={20} />
            Business Profile
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => updateSetting("businessName", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <select
                value={settings.industry}
                onChange={(e) => updateSetting("industry", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="dental">Dental Practice</option>
                <option value="medical">Medical Practice</option>
                <option value="restaurant">Restaurant / Café</option>
                <option value="salon">Salon / Spa</option>
                <option value="automotive">Automotive / Mechanic</option>
                <option value="retail">Retail Store</option>
                <option value="hospitality">Hospitality / B&B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Google Place ID
              </label>
              <input
                type="text"
                value={settings.googlePlaceId}
                onChange={(e) => updateSetting("googlePlaceId", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="ChIJ..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facebook Page ID
              </label>
              <input
                type="text"
                value={settings.facebookPageId}
                onChange={(e) => updateSetting("facebookPageId", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter Facebook Page ID"
              />
            </div>
          </div>
        </div>

        {/* AI Brand Voice */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Mic size={20} />
            AI Brand Voice
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Describe how you want the AI to respond to reviews. The more detail, the
            better the responses.
          </p>
          <textarea
            value={settings.brandVoice}
            onChange={(e) => updateSetting("brandVoice", e.target.value)}
            rows={4}
            className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="mt-4 flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.autoRespond}
                onChange={(e) => updateSetting("autoRespond", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable auto-respond</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Escalate reviews rated</span>
              <select
                value={settings.escalationThreshold}
                onChange={(e) =>
                  updateSetting("escalationThreshold", Number(e.target.value))
                }
                className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value={1}>1 star</option>
                <option value={2}>2 stars or below</option>
                <option value={3}>3 stars or below</option>
              </select>
              <span className="text-sm text-gray-700">and below</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Bell size={20} />
            Notifications
          </h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => updateSetting("emailNotifications", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Email notifications for new reviews
                </span>
                <p className="text-xs text-gray-500">
                  Get notified when a new review is posted
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.escalationAlerts}
                onChange={(e) => updateSetting("escalationAlerts", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Escalation alerts
                </span>
                <p className="text-xs text-gray-500">
                  Instant notification when a review is escalated
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) => updateSetting("weeklyDigest", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Weekly digest</span>
                <p className="text-xs text-gray-500">
                  Summary of review activity sent every Monday
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <CreditCard size={20} />
            Subscription
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-xl border p-4 ${
                  settings.currentPlan === key
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                  {settings.currentPlan === key && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  R{plan.price}
                  <span className="text-sm font-normal text-gray-500">/mo</span>
                </p>
                {settings.currentPlan !== key && (
                  <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <ExternalLink size={14} />
                    Upgrade
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Payments processed securely via PayFast. All prices in ZAR.
          </p>
        </div>
      </div>
    </div>
  );
}
