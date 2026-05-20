"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AlertTriangle,
  ThumbsDown,
  Clock,
  TrendingDown,
  Radar,
  Zap,
  Shield,
  MessageSquare,
  TrendingUp,
  Star,
  Users,
  DollarSign,
  BarChart3,
  Mail,
  Phone,
  Bell,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ModelViewer = dynamic(
  () => import("@/components/three/model-viewer").then((mod) => mod.ModelViewer),
  { ssr: false }
);

/* ──────────────────────────────────────
   SECTION 1: THE PAIN — Unresponded Reviews
   ────────────────────────────────────── */
function PainSection() {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pain-stat", {
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
      });
      gsap.from(textRef.current, {
        scrollTrigger: { trigger: ref.current, start: "top 65%" },
        x: -80,
        opacity: 0,
        duration: 1.2,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center py-24 lg:py-32 overflow-hidden"
    >
      {/* Red warning gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#1a0505] to-[#0a0a0f] opacity-60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div ref={textRef}>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300/80 uppercase tracking-wider font-medium">
              The Problem
            </span>
          </div>

          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[0.95] tracking-tight text-white mb-6">
            Your Customers{" "}
            <span className="text-red-400">Are Talking.</span>
            <br />
            Are You{" "}
            <span className="relative inline-block">
              Listening?
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8 C50 2, 150 2, 198 8" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-lg">
            50% of South African businesses never respond to their Google reviews.
            Every ignored review tells your customers: &ldquo;We don&apos;t care about your feedback.&rdquo;
          </p>

          <div className="space-y-4">
            {[
              { icon: ThumbsDown, text: "Unanswered reviews signal you don't value customers", color: "text-red-400" },
              { icon: Clock, text: "Manual responses eat 2+ hours every single week", color: "text-orange-400" },
              { icon: TrendingDown, text: "Slow responses tank your Google ranking", color: "text-red-500" },
            ].map(({ icon: Icon, text, color }, i) => (
              <div key={i} className="pain-stat flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className={`p-2 rounded-lg bg-red-500/10 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3D MacBook with unresponded reviews */}
        <div className="relative">
          <ModelViewer
            modelUrl="/models/macbook-reviews.glb"
            mood="danger"
            scale={1.8}
            rotation={[0.2, -0.3, 0]}
            className="w-full h-[500px]"
          />

          {/* Floating notification badges */}
          <div className="absolute top-10 right-10 pain-stat flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 backdrop-blur-sm animate-pulse">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-xs text-red-300 font-medium">23 unread reviews</span>
          </div>

          <div className="absolute bottom-20 left-5 pain-stat flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/15 border border-orange-500/20 backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs text-orange-300">Avg response: 12 days</span>
          </div>

          <div className="absolute top-1/2 left-0 pain-stat flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600/15 border border-red-600/20 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs text-red-300">Rating dropping: 3.2★</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────
   SECTION 2: THE IMPACT — What Ignoring Reviews Costs
   ────────────────────────────────────── */
function ImpactSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".impact-card", {
        scrollTrigger: { trigger: ref.current, start: "top 65%" },
        y: 80,
        opacity: 0,
        rotationX: -15,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const impacts = [
    {
      stat: "86%",
      label: "of customers won't buy from a business with unanswered negative reviews",
      icon: ThumbsDown,
      color: "from-red-500/20 to-red-600/5",
      accent: "text-red-400",
    },
    {
      stat: "R47K",
      label: "average annual revenue lost per location from poor review management",
      icon: DollarSign,
      color: "from-orange-500/20 to-orange-600/5",
      accent: "text-orange-400",
    },
    {
      stat: "3.4×",
      label: "more likely customers choose competitors who respond to reviews",
      icon: Users,
      color: "from-amber-500/20 to-amber-600/5",
      accent: "text-amber-400",
    },
    {
      stat: "-22%",
      label: "drop in Google ranking when reviews go unanswered for 7+ days",
      icon: TrendingDown,
      color: "from-red-600/20 to-red-700/5",
      accent: "text-red-500",
    },
  ];

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight text-white mb-4">
          What It <span className="text-red-400">Costs</span> You
        </h2>
        <p className="text-white/40 text-lg mb-16 max-w-xl mx-auto">
          Ignoring reviews isn&apos;t just rude — it&apos;s costing your South African business real money.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impacts.map(({ stat, label, icon: Icon, color, accent }, i) => (
            <div
              key={i}
              className={`impact-card relative p-6 rounded-2xl bg-gradient-to-b ${color} border border-white/[0.04] text-left`}
              style={{ perspective: "800px" }}
            >
              <Icon className={`w-8 h-8 ${accent} mb-4`} />
              <p className={`text-3xl font-black ${accent} mb-2`}>{stat}</p>
              <p className="text-sm text-white/50 leading-relaxed">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────
   SECTION 3: THE SOLUTION — Introducing ReviewRadar
   ────────────────────────────────────── */
function SolutionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
      });
      gsap.from(".solution-feature", {
        scrollTrigger: { trigger: ref.current, start: "top 50%" },
        x: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Zap, title: "AI Auto-Response", desc: "Respond to every review in seconds, in your brand voice. Your customers feel heard instantly.", color: "bg-cyan-500/10 text-cyan-400" },
    { icon: Shield, title: "Smart Escalation", desc: "Negative reviews get flagged and assigned to your team. Nothing slips through the cracks.", color: "bg-blue-500/10 text-blue-400" },
    { icon: MessageSquare, title: "Brand Voice Engine", desc: "Train the AI on your tone — whether it's professional, warm, or uniquely South African.", color: "bg-purple-500/10 text-purple-400" },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center py-24 lg:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#051a1a] to-[#0a0a0f] opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: 3D Radar model */}
        <div className="relative order-2 lg:order-1">
          <ModelViewer
            modelUrl="/models/solution-radar.glb"
            mood="solution"
            scale={2.0}
            rotation={[0.3, 0, 0]}
            className="w-full h-[500px]"
          />

          {/* Floating success indicators */}
          <div className="absolute top-10 left-5 solution-feature flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/20 backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-cyan-300">Auto-responded in 8s</span>
          </div>

          <div className="absolute bottom-20 right-5 solution-feature flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/15 border border-green-500/20 backdrop-blur-sm">
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-300">Rating: 4.8★ ↑</span>
          </div>
        </div>

        {/* Right: Text + Features */}
        <div ref={headingRef} className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 mb-6">
            <Radar className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300/80 uppercase tracking-wider font-medium">
              The Solution
            </span>
          </div>

          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[0.95] tracking-tight text-white mb-6">
            Meet{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              ReviewRadar
            </span>
          </h2>

          <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-lg">
            Your AI-powered reputation manager built specifically for South African businesses.
            Never miss a review. Always respond right.
          </p>

          <div className="space-y-5">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <div key={i} className="solution-feature flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/20 transition-colors">
                <div className={`p-2.5 rounded-xl ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────
   SECTION 4: THE GROWTH — More Sales, Better Reputation
   ────────────────────────────────────── */
function GrowthSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".growth-item", {
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Animate counter numbers
      const counters = ref.current?.querySelectorAll(".counter-value") ?? [];
      counters.forEach((el) => {
        const target = parseInt(el.getAttribute("data-target") || "0");
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: "top 80%" },
          textContent: target,
          duration: 2,
          snap: { textContent: 1 },
          ease: "power2.out",
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center py-24 lg:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#051a0a] to-[#0a0a0f] opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-1.5 mb-6">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300/80 uppercase tracking-wider font-medium">
              The Result
            </span>
          </div>

          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[0.95] tracking-tight text-white mb-6">
            Watch Your{" "}
            <span className="text-green-400">Sales Grow</span>
            <br />
            While You Sleep
          </h2>

          <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-lg">
            Proactive, attentive responses make customers feel valued.
            When customers feel valued, they come back — and bring their friends.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { value: 94, suffix: "%", label: "Response rate", color: "text-green-400" },
              { value: 35, suffix: "%", label: "More repeat customers", color: "text-cyan-400" },
              { value: 4, suffix: ".8★", label: "Average rating achieved", color: "text-amber-400" },
              { value: 2, suffix: "hrs", label: "Saved per week", color: "text-blue-400" },
            ].map(({ value, suffix, label, color }, i) => (
              <div key={i} className="growth-item p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <p className={`text-2xl font-black ${color}`}>
                  <span className="counter-value" data-target={value}>0</span>
                  {suffix}
                </p>
                <p className="text-xs text-white/40 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3D Growth model */}
        <div className="relative">
          <ModelViewer
            modelUrl="/models/growth-sales.glb"
            mood="growth"
            scale={1.6}
            rotation={[0.2, -0.5, 0]}
            className="w-full h-[500px]"
          />

          {/* Success badges */}
          <div className="absolute top-10 right-5 growth-item flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/15 border border-green-500/20 backdrop-blur-sm">
            <DollarSign className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-300">Revenue +R47K/yr</span>
          </div>

          <div className="absolute bottom-20 left-5 growth-item flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/20 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-amber-300">5-star reviews +340%</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────
   SECTION 5: THE DATA — Reports & Delivery
   ────────────────────────────────────── */
function DataSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".data-feature", {
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const channels = [
    { icon: Mail, name: "Email Reports", desc: "Monthly reputation reports delivered to your inbox with sentiment trends, response rates, and AI recommendations.", color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: Phone, name: "WhatsApp Alerts", desc: "Instant negative review alerts and daily summaries straight to your WhatsApp. Never miss a critical review.", color: "text-green-400", bg: "bg-green-500/10" },
    { icon: Bell, name: "Telegram Updates", desc: "Real-time notifications for your team. Assign staff to handle escalations directly from chat.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  ];

  const reportFeatures = [
    "Sentiment analysis breakdown per month",
    "Response rate and average response time",
    "Top positive and negative keywords",
    "Staff performance on escalations",
    "Competitor benchmark comparison",
    "AI-generated improvement recommendations",
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center py-24 lg:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a051a] to-[#0a0a0f] opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: 3D Report model */}
        <div className="relative">
          <ModelViewer
            modelUrl="/models/data-report.glb"
            mood="data"
            scale={2.0}
            rotation={[0.2, -0.3, 0]}
            className="w-full h-[500px]"
          />

          <div className="absolute top-10 left-5 data-feature flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/15 border border-purple-500/20 backdrop-blur-sm">
            <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-purple-300">Monthly report ready</span>
          </div>
        </div>

        {/* Right: Text + Delivery Channels */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 mb-6">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300/80 uppercase tracking-wider font-medium">
              The Intelligence
            </span>
          </div>

          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.95] tracking-tight text-white mb-6">
            Data That{" "}
            <span className="text-purple-400">Drives Action</span>
          </h2>

          <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-lg">
            Assign staff to handle escalated reviews. Get monthly reputation reports
            delivered where your team already works — email, WhatsApp, or Telegram.
          </p>

          {/* Delivery Channels */}
          <div className="space-y-4 mb-10">
            {channels.map(({ icon: Icon, name, desc, color, bg }, i) => (
              <div key={i} className="data-feature flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/20 transition-colors">
                <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Report features list */}
          <div className="data-feature p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">
              In Every Report
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reportFeatures.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-white/50">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────
   SECTION 6: CTA — Get Started
   ────────────────────────────────────── */
function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
        y: 40,
        opacity: 0,
        duration: 1.2,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#051218] to-[#0a0a0f]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <Radar className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[0.95] tracking-tight text-white mb-6">
          Stop Losing Customers.
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Start Building Trust.
          </span>
        </h2>

        <p className="text-lg text-white/40 mb-10 max-w-xl mx-auto">
          Join hundreds of South African businesses using ReviewRadar
          to turn every review into a growth opportunity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-base font-bold text-white transition-transform hover:scale-105"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-4 text-base font-medium text-white/60 hover:text-white hover:border-white/20 transition-colors"
          >
            Sign In
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/30">
          No credit card required • ZAR pricing • POPIA compliant
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────
   EXPORT ALL STORY SECTIONS
   ────────────────────────────────────── */
export { PainSection, ImpactSection, SolutionSection, GrowthSection, DataSection, FinalCTA };
