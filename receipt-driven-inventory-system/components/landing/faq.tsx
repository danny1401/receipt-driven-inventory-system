import { FAQAccordion, SectionHeading } from "@/components/landing";

export function FAQ() {
  return (
    <section
      id="faq"
      className="scroll-mt-16 border-b border-border/60 bg-muted/30"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions & answers"
          description="Everything you need to know before you upload your first receipt."
        />
        <div className="mt-12">
          <FAQAccordion />
        </div>
      </div>
    </section>
  );
}
