"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Radar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });

    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Radar className="h-7 w-7 text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-lg font-bold text-white tracking-tight">
              Review<span className="text-cyan-400">Radar</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-white/60 hover:text-white transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0a0a0f] hover:bg-cyan-400 hover:text-[#0a0a0f] transition-all duration-300"
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={progressRef}
        className="h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </nav>
  );
}
