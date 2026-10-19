import {
  CTA,
  FAQ,
  Features,
  Hero,
  HowItWorks,
  Value,
} from "@/components/landing";
import { Footer } from "@/components/ui";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Value />
      <FAQ />
      <CTA />
      <Footer utility={true} />
    </>
  );
}
