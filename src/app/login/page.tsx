"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Radar, Mail, Lock, Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
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
          <label className="block text-sm font-medium text-white/70">Email</label>
          <div className="relative mt-1">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
              placeholder="Enter your password"
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
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="mt-4 text-center text-sm text-white/40">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-cyan-400 hover:text-cyan-300">
          Start free trial
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
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
          <h1 className="mt-6 text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-white/50">
            Sign in to manage your business reviews
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
