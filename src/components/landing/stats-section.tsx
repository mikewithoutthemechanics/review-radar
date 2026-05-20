"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 50, suffix: "%", label: "of SA businesses never respond to reviews" },
  { value: 2, suffix: "hrs", label: "per week saved on manual responses" },
  { value: 4.6, suffix: "x", label: "faster response time with AI" },
  { value: 89, suffix: "%", label: "of consumers read business responses" },
];

function AnimatedCounter({
  target,
  suffix,
  triggered,
}: {
  target: number;
  suffix: string;
  triggered: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => setValue(Number(obj.val.toFixed(target % 1 === 0 ? 0 : 1))),
    });
  }, [triggered, target]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => setTriggered(true),
      });

      gsap.from(sectionRef.current?.querySelectorAll(".stat-item") ?? [], {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
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
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-item text-center relative"
            >
              {/* Separator */}
              {i > 0 && (
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/5" />
              )}

              <div className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-3">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  triggered={triggered}
                />
              </div>

              <p className="text-sm text-white/30 max-w-[180px] mx-auto leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Social proof strip */}
        <div className="mt-24 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-8">
            Trusted by businesses in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-white/15 text-lg font-bold">
            {[
              "Johannesburg",
              "Cape Town",
              "Durban",
              "Pretoria",
              "Port Elizabeth",
              "Bloemfontein",
            ].map((city) => (
              <span key={city} className="hover:text-white/30 transition-colors duration-300">
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
