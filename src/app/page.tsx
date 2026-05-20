"use client";

import { LenisProvider } from "@/components/landing/lenis-provider";
import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import {
  PainSection,
  ImpactSection,
  SolutionSection,
  GrowthSection,
  DataSection,
  FinalCTA,
} from "@/components/landing/story-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function HomePage() {
  return (
    <LenisProvider>
      <main className="bg-[#0a0a0f]">
        <Navbar />
        <HeroSection />
        {/* Narrative Story Flow */}
        <PainSection />
        <ImpactSection />
        <SolutionSection />
        <GrowthSection />
        <DataSection />
        {/* Pricing + CTA */}
        <PricingSection />
        <FinalCTA />
        <FooterSection />
      </main>
    </LenisProvider>
  );
}
