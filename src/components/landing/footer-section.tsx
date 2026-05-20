"use client";

import Link from "next/link";
import { Radar } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="relative bg-[#0a0a0f] border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Radar className="h-6 w-6 text-cyan-400" />
              <span className="text-lg font-bold text-white">
                Review<span className="text-cyan-400">Radar</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/30 max-w-sm leading-relaxed">
              AI-powered review management built for South African local
              businesses. Save time, protect your reputation, grow your business.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-4">
              Product
            </h4>
            <div className="space-y-3">
              {["Features", "Pricing", "Dashboard Demo", "API Docs"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    className="block text-sm text-white/25 hover:text-white/60 transition-colors"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-4">
              Company
            </h4>
            <div className="space-y-3">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="block text-sm text-white/25 hover:text-white/60 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} ReviewRadar. Built in South Africa.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/20">
            <Link href="#" className="hover:text-white/40 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white/40 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white/40 transition-colors">
              POPIA
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
