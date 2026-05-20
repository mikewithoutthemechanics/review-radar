"use client";

import Link from "next/link";
import {
  Radar,
  MessageSquare,
  Shield,
  BarChart3,
  Zap,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/payfast";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-3xl lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-200">
            <Radar size={16} />
            Built for South African Businesses
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Never Miss a Review.{" "}
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Always Respond Right.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-blue-100/80">
            AI-powered review management for local businesses. Auto-respond to Google and
            Facebook reviews in your brand voice, flag negative reviews for human
            escalation, and track your reputation with monthly reports.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-blue-900 shadow-lg transition-transform hover:scale-105"
            >
              Start Free Trial
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              View Demo Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI Auto-Responses",
      description:
        "Respond to every review in seconds with AI that writes in your unique brand voice. No more copy-paste templates.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Smart Escalation",
      description:
        "Negative reviews are automatically flagged and routed to your team for personal follow-up. Never miss a critical issue.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Reputation Reports",
      description:
        "Monthly reports with sentiment analysis, rating trends, and actionable recommendations to improve your online reputation.",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Multi-Platform",
      description:
        "Manage Google and Facebook reviews from one dashboard. See everything in one place.",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Sentiment Analysis",
      description:
        "AI analyses every review to extract sentiment, keywords, and trends. Understand what customers really think.",
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: "Brand Voice Config",
      description:
        "Train the AI on your brand voice — professional, casual, warm, or anything in between. Your responses, your style.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to Manage Your Reputation
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Save 2+ hours per week and never let a review go unanswered.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  const plans = Object.entries(SUBSCRIPTION_PLANS);

  return (
    <section className="bg-gray-50 py-24" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            All prices in South African Rand. No hidden fees.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {plans.map(([key, plan], idx) => (
            <div
              key={key}
              className={`relative rounded-2xl border p-8 ${
                idx === 1
                  ? "border-blue-600 bg-white shadow-xl ring-2 ring-blue-600"
                  : "border-gray-200 bg-white shadow-sm"
              }`}
            >
              {idx === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  R{plan.price}
                </span>
                <span className="ml-1 text-sm text-gray-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                  idx === 1
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Radar className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-gray-900">ReviewRadar</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ReviewRadar. Built for SA businesses.
          </p>
        </div>
      </div>
    </footer>
  );
}
