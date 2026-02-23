import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { BentoSection } from "@/components/home/BentoSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

/**
 * Landing page — visible only to unauthenticated users.
 * Composed from standalone section components.
 * All text/data is centralized in `src/constants/homepage.ts`.
 */
export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <BentoSection />
      <CTASection />
      <Footer />
    </div>
  );
}