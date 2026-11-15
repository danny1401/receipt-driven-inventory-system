import { Footer, FooterDescription } from "@/components/structure";
import { Header } from "@/components/landing";
import {
  CTA,
  FAQ,
  Features,
  Hero,
  HowItWorks,
  Value,
} from "@/components/landing";
import { getToken, preloadAuthQuery } from "@/lib/authServer";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const token = await getToken();

  if (token) {
    const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser);
    if (preloadedUser) {
      redirect("/dashboard");
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        <Hero />
        <Features />
        <HowItWorks />
        <Value />
        <FAQ />
        <CTA />
        <FooterDescription />
      </main>
      <Footer />
    </>
  );
}
