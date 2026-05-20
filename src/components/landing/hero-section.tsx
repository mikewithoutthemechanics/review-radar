"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const FloatingScene = dynamic(
  () => import("@/components/three/floating-scene").then((mod) => mod.FloatingScene),
  { ssr: false }
);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(tagRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
      })
        .from(
          headlineRef.current?.querySelectorAll(".word") ?? [],
          {
            y: 120,
            opacity: 0,
            rotationX: -40,
            duration: 1.2,
            stagger: 0.08,
          },
          "-=0.4"
        )
        .from(
          subRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 1,
          },
          "-=0.6"
        )
        .from(
          ctaRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        );

      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: -100,
        opacity: 0.3,
        scale: 0.95,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const words = ["Never", "Miss", "a", "Review.", "Always", "Respond", "Right."];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]"
    >
      <FloatingScene />

      {/* Grain overlay for anti-AI feel */}
      <div
        className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hand-drawn circle SVG accent */}
      <svg
        className="absolute top-[15%] right-[10%] w-32 h-32 text-cyan-500/10 z-10 animate-spin-slow"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <path d="M50 5 C75 5, 95 25, 95 50 C95 78, 72 97, 50 95 C25 93, 3 73, 5 50 C7 25, 28 3, 50 5" />
      </svg>

      <div className="relative z-20 mx-auto max-w-7xl px-6 py-32 lg:px-8 text-center">
        <div
          ref={tagRef}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 mb-10 backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm text-white/60 tracking-wide uppercase">
            Built for South African Businesses
          </span>
        </div>

        <h1
          ref={headlineRef}
          className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-tighter text-white"
          style={{ perspective: "1000px" }}
        >
          {words.map((word, i) => (
            <span key={i} className="word inline-block mr-[0.3em]">
              {i === 3 || i === 6 ? (
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {word}
                </span>
              ) : (
                word
              )}
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          className="mt-8 mx-auto max-w-2xl text-lg md:text-xl text-white/50 leading-relaxed font-light"
        >
          AI-powered review management that saves you 2+ hours per week.
          Auto-respond in your brand voice. Flag issues instantly.
          Track your reputation effortlessly.
        </p>

        <div ref={ctaRef} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/signup"
            className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-[#0a0a0f] overflow-hidden transition-transform hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 group-hover:text-white transition-colors">
              Start Free Trial
            </span>
            <ArrowRight size={18} className="relative z-10 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-base font-medium text-white/70 hover:text-white hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            View Live Demo
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent relative overflow-hidden">
            <div className="absolute top-0 w-full h-4 bg-cyan-400 animate-scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
