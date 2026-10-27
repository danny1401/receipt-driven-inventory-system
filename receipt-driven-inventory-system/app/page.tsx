import {
  CTA,
  FAQ,
  Features,
  Hero,
  HowItWorks,
  Value,
} from "@/components/landing";
import { FooterDescription } from "@/components/structure";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Value />
      <FAQ />
      <CTA />
      <FooterDescription />
    </>
  );
}
