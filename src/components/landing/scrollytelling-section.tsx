"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Connect",
    subtitle: "Link your Google & Facebook profiles",
    description:
      "One-click integration. We pull in all your existing reviews and start monitoring for new ones in real-time. Zero manual setup.",
    visual: "connect",
  },
  {
    number: "02",
    title: "Respond",
    subtitle: "AI crafts perfect replies in your voice",
    description:
      "Every review gets a thoughtful, personalised response within minutes. Positive, neutral, or negative — the AI adapts. You approve or let it run autonomously.",
    visual: "respond",
  },
  {
    number: "03",
    title: "Escalate",
    subtitle: "Negative reviews flagged instantly",
    description:
      "1-star reviews? Billing complaints? The system flags them, notifies your team, and creates a case for human follow-up. Nothing slips through.",
    visual: "escalate",
  },
  {
    number: "04",
    title: "Grow",
    subtitle: "Reputation reports drive improvement",
    description:
      "Monthly AI-generated reports show exactly what&apos;s working and what isn&apos;t. Sentiment trends, keyword analysis, and action items your team can execute immediately.",
    visual: "grow",
  },
];

function StepVisual({ type, progress }: { type: string; progress: number }) {
  const colors: Record<string, string> = {
    connect: "#06b6d4",
    respond: "#3b82f6",
    escalate: "#ef4444",
    grow: "#10b981",
  };

  const color = colors[type] || "#06b6d4";

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Abstract visualization */}
      <div
        className="relative w-64 h-64 md:w-80 md:h-80"
        style={{ transform: `scale(${0.8 + progress * 0.2}) rotate(${progress * 10}deg)` }}
      >
        {/* Outer ring */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity={0.2}
            strokeDasharray={`${progress * 565} 565`}
          />
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke={color}
            strokeWidth="0.3"
            opacity={0.1}
          />
        </svg>

        {/* Center element */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0.3 + progress * 0.7 }}
        >
          <div
            className="w-32 h-32 rounded-3xl border border-white/10 backdrop-blur-xl flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at center, ${color}15, transparent)`,
              transform: `rotateY(${progress * 15}deg)`,
            }}
          >
            <span className="text-5xl font-black" style={{ color }}>
              {type === "connect" && "⟡"}
              {type === "respond" && "✦"}
              {type === "escalate" && "⚡"}
              {type === "grow" && "◈"}
            </span>
          </div>
        </div>

        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: color,
              opacity: 0.1 + progress * 0.3,
              top: `${50 + Math.sin((i / 6) * Math.PI * 2) * 40}%`,
              left: `${50 + Math.cos((i / 6) * Math.PI * 2) * 40}%`,
              transform: `translate(-50%, -50%) scale(${0.5 + Math.sin(progress * Math.PI + i) * 0.5})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ScrollytellingSection() {
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

      const stepElements = sectionRef.current?.querySelectorAll(".step-panel") ?? [];
      stepElements.forEach((el) => {
        gsap.from(el, {
          x: 100,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            end: "top 40%",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-32 bg-[#0a0a0f] overflow-hidden"
    >
      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent hidden lg:block" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-24">
          <p className="reveal text-sm font-medium tracking-[0.2em] uppercase text-cyan-400 mb-4">
            — How it Works
          </p>
          <h2 className="reveal text-4xl md:text-6xl font-black text-white tracking-tight">
            Four steps.{" "}
            <span className="text-white/30">Zero friction.</span>
          </h2>
        </div>

        <div className="space-y-32 lg:space-y-48">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`step-panel grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
              style={{ direction: i % 2 === 1 ? "rtl" : "ltr" }}
            >
              <div style={{ direction: "ltr" }}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-7xl font-black text-white/[0.04] leading-none select-none">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-black text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-cyan-400 mt-1">{step.subtitle}</p>
                  </div>
                </div>
                <p className="text-base text-white/40 leading-relaxed max-w-md">
                  {step.description}
                </p>

                {/* Hand-drawn underline */}
                <svg
                  className="mt-6 w-24 h-3 text-white/10"
                  viewBox="0 0 100 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M0 5 Q25 0 50 5 Q75 10 100 5" />
                </svg>
              </div>

              <div
                className="h-80 lg:h-96 relative"
                style={{ direction: "ltr" }}
              >
                <StepVisual type={step.visual} progress={0.8} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
