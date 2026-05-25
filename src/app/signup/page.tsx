"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Radar, Mail, Lock, ExternalLink, Building2, Loader2, User } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
    industry: "general",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const industries = [
    { value: "general", label: "General Business" },
    { value: "dental", label: "Dental Practice" },
    { value: "medical", label: "Medical Practice" },
    { value: "restaurant", label: "Restaurant / Café" },
    { value: "salon", label: "Salon / Spa" },
    { value: "automotive", label: "Automotive / Mechanic" },
    { value: "retail", label: "Retail Store" },
    { value: "hospitality", label: "Hospitality / B&B" },
    { value: "fitness", label: "Gym / Fitness" },
    { value: "legal", label: "Legal Services" },
    { value: "accounting", label: "Accounting / Financial" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createBrowserSupabaseClient();

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            business_name: formData.businessName,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Create business record
      if (authData.user) {
        const slug = formData.businessName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        await supabase.from("businesses").insert({
          user_id: authData.user.id,
          name: formData.businessName,
          slug,
          industry: formData.industry,
        });
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 py-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Radar className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold text-white">ReviewRadar</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">Start your free trial</h1>
          <p className="mt-2 text-sm text-white/50">
            14 days free, no credit card required
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-xl shadow-2xl shadow-black/20"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70">Your Name</label>
              <div className="relative mt-1">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  placeholder="John Smith"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70">Business Name</label>
              <div className="relative mt-1">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  placeholder="Smile Dental Sandton"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70">Industry</label>
              <select
                value={formData.industry}
                onChange={(e) => updateField("industry", e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 pl-3 pr-10 text-sm text-white focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 [&>option]:bg-[#0f1115] [&>option]:text-white"
              >
                {industries.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70">Email</label>
              <div className="relative mt-1">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  placeholder="you@business.co.za"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70">Password</label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  placeholder="Min 8 characters"
                  minLength={8}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Creating account..." : "Create Account"}
          </button>

           <button
             type="button"
             onClick={() => {
               window.location.href = `${window.location.origin}/api/auth/signin?provider=google&next=/dashboard`;
             }}
             disabled={loading}
             className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-lg hover:bg-white/20 transition-all"
           >
             <ExternalLink size={16} className="text-red-500" />
             Continue with Google
           </button>

           <p className="mt-4 text-center text-sm text-white/40">
             Already have an account?{" "}
             <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
               Sign in
             </Link>
           </p>
        </form>
      </div>
    </div>
  );
}
