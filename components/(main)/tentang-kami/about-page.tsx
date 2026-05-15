import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import { CtaSection } from "./cta-section";
import { FeatureSection } from "./feature-section";
import { HeroSection } from "./hero-section";
import { JourneySection } from "./journey-section";
import { ProblemSection } from "./problem-section";
import { RoleSection } from "./role-section";
import { TrustSection } from "./trust-section";

export default function AboutPage() {
  return (
    <div className="relative bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeatureSection />
        <RoleSection />
        <JourneySection />
        <TrustSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
