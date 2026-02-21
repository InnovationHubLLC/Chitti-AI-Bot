import { HeroSection } from "@/components/sections/hero-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { IndustriesSection } from "@/components/sections/industries-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { SocialProofSection } from "@/components/sections/social-proof-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <IndustriesSection />
      <PricingSection />
      <SocialProofSection />
    </main>
  );
}
