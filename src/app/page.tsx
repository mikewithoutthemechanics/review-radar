"use client";

import { LenisProvider } from "@/components/landing/lenis-provider";
import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ScrollytellingSection } from "@/components/landing/scrollytelling-section";
import { StatsSection } from "@/components/landing/stats-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function HomePage() {
  return (
    <LenisProvider>
      <main className="bg-[#0a0a0f]">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <ScrollytellingSection />
        <StatsSection />
        <PricingSection />
        <CTASection />
        <FooterSection />
      </main>
    </LenisProvider>
  );
}
