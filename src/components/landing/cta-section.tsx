"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Radar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current?.querySelectorAll(".reveal") ?? [], {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Parallax on the background shapes
      gsap.to(sectionRef.current?.querySelectorAll(".parallax-shape") ?? [], {
        y: -80,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-[#0a0a0f] overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="parallax-shape absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-[100px]" />
        <div className="parallax-shape absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-[80px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
        <div ref={contentRef} className="text-center">
          <div className="reveal inline-flex items-center justify-center mb-8">
            <div className="relative">
              <Radar className="h-16 w-16 text-cyan-400" />
              <div className="absolute inset-0 h-16 w-16 rounded-full bg-cyan-400/20 animate-ping" />
            </div>
          </div>

          <h2 className="reveal text-4xl md:text-7xl font-black text-white tracking-tight leading-[1]">
            Stop losing customers
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              to silence.
            </span>
          </h2>

          <p className="reveal mt-8 text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
            Every unanswered review is a missed opportunity. Every slow response
            is a customer choosing your competitor. Start responding in minutes,
            not days.
          </p>

          <div className="reveal mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-10 py-5 text-base font-bold text-[#0a0a0f] overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_rgba(6,182,212,0.3)]"
            >
              <span className="relative z-10">Start Free — 14 Days</span>
              <ArrowRight
                size={18}
                className="relative z-10 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <p className="reveal mt-6 text-sm text-white/20">
            No credit card required &middot; Cancel anytime &middot; Setup in 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
