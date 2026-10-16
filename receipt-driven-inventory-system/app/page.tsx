import { Cta } from "@/components/landing/cta";
import { Faq } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/ui/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Value } from "@/components/landing/value";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Value />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
