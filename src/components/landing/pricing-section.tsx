"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/payfast";

gsap.registerPlugin(ScrollTrigger);

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current?.querySelectorAll(".reveal") ?? [], {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      const cards = sectionRef.current?.querySelectorAll(".price-card") ?? [];
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 100,
          opacity: 0,
          rotationX: -10,
          duration: 1,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const plans = Object.entries(SUBSCRIPTION_PLANS);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-32 bg-[#0a0a0f] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div ref={titleRef} className="text-center mb-20">
          <p className="reveal text-sm font-medium tracking-[0.2em] uppercase text-cyan-400 mb-4">
            — Pricing
          </p>
          <h2 className="reveal text-4xl md:text-6xl font-black text-white tracking-tight">
            Simple pricing.{" "}
            <span className="text-white/30">No surprises.</span>
          </h2>
          <p className="reveal mt-6 text-lg text-white/40">
            All prices in South African Rand. Cancel anytime.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto" style={{ perspective: "1000px" }}>
          {plans.map(([key, plan], idx) => (
            <div
              key={key}
              className={`price-card group relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                idx === 1
                  ? "bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-2 border-cyan-400/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]"
                  : "bg-white/[0.02] border border-white/5 hover:border-white/10"
              }`}
            >
              {idx === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0a0f] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-bold text-white">{plan.name}</h3>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-sm text-white/40">R</span>
                <span className="text-5xl font-black text-white tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-white/30 ml-1">/month</span>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-white/50 group-hover:text-white/70 transition-colors"
                  >
                    <CheckCircle2
                      size={16}
                      className={`mt-0.5 shrink-0 ${
                        idx === 1 ? "text-cyan-400" : "text-white/20"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`mt-8 flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-all duration-300 ${
                  idx === 1
                    ? "bg-white text-[#0a0a0f] hover:bg-cyan-400"
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                Get Started
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
