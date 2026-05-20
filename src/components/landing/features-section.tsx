"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Zap,
  Shield,
  BarChart3,
  MessageSquare,
  Brain,
  Fingerprint,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Zap />,
    title: "Instant AI Responses",
    description:
      "Every review answered in seconds, not hours. Your brand voice, perfectly replicated every time.",
    accent: "from-cyan-400 to-blue-500",
  },
  {
    icon: <Shield />,
    title: "Smart Escalation",
    description:
      "Negative reviews flagged instantly. Your team gets notified before it becomes a problem.",
    accent: "from-red-400 to-orange-500",
  },
  {
    icon: <BarChart3 />,
    title: "Reputation Intel",
    description:
      "Monthly reports with sentiment trends, keyword analysis, and AI-generated action plans.",
    accent: "from-purple-400 to-pink-500",
  },
  {
    icon: <MessageSquare />,
    title: "Multi-Platform",
    description:
      "Google. Facebook. One dashboard. See every review across all platforms at a glance.",
    accent: "from-green-400 to-emerald-500",
  },
  {
    icon: <Brain />,
    title: "Sentiment Engine",
    description:
      "AI reads between the lines. Understands context, sarcasm, and urgency before you even see it.",
    accent: "from-yellow-400 to-amber-500",
  },
  {
    icon: <Fingerprint />,
    title: "Brand Voice DNA",
    description:
      "Train the AI on your unique tone. Professional, warm, casual — your personality, amplified.",
    accent: "from-blue-400 to-indigo-500",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current?.querySelectorAll(".reveal") ?? [], {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      const cards = cardsRef.current?.querySelectorAll(".feature-card") ?? [];
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          rotationY: i % 2 === 0 ? -5 : 5,
          duration: 1,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 60%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-32 bg-[#0a0a0f] overflow-hidden"
    >
      {/* Organic shape backgrounds */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[100px] translate-x-1/3 translate-y-1/3" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div ref={titleRef} className="max-w-3xl">
          <p className="reveal text-sm font-medium tracking-[0.2em] uppercase text-cyan-400 mb-4">
            — Features
          </p>
          <h2 className="reveal text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Everything you need.{" "}
            <span className="text-white/30">Nothing you don&apos;t.</span>
          </h2>
          <p className="reveal mt-6 text-lg text-white/40 max-w-xl">
            Built specifically for SA local businesses who are tired of losing
            customers to unanswered reviews.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="feature-card group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm hover:border-white/10 transition-all duration-500 overflow-hidden"
              style={{ perspective: "800px" }}
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              {/* Hand-drawn number */}
              <span className="absolute top-6 right-6 text-[80px] font-black text-white/[0.02] leading-none select-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} text-white mb-6`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                {feature.title}
              </h3>

              <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${feature.accent} group-hover:w-full transition-all duration-700`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
