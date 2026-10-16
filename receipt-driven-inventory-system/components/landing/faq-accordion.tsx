"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    value: "formats",
    question: "What file formats can I upload?",
    answer:
      "PDF supplier invoices and order confirmations today. The parser is built for structured receipts that carry line items, quantities, units, and prices — the documents that normally get typed into a spreadsheet by hand.",
  },
  {
    value: "accuracy",
    question: "How accurate is the extraction?",
    answer:
      "Parsing runs on Google Gemini and every result is validated against your schema. Anything the model isn't confident about is flagged for review instead of being silently imported, so a bad read never corrupts your stock counts.",
  },
  {
    value: "scale",
    question: "Does it handle multiple suppliers and locations?",
    answer:
      "Yes. Each receipt is matched to a supplier organization and a customer (restaurant), so you can track inventory, spend, and deliveries across your whole network from one place.",
  },
  {
    value: "corrections",
    question: "Can I fix a receipt that was read incorrectly?",
    answer:
      "Receipts marked for review can be corrected before they affect inventory. You keep a full record of the original PDF alongside the parsed line items.",
  },
  {
    value: "data",
    question: "Where is my data stored?",
    answer:
      "Receipts and line items live in Convex, with the original PDFs kept in file storage. Authentication is handled with Better Auth and Google sign-in.",
  },
  {
    value: "start",
    question: "How do I get started?",
    answer:
      "Sign in with Google and upload your first receipt. There is nothing to install and no spreadsheet template to maintain.",
  },
];

export function FaqAccordion() {
  return (
    <Accordion className="mx-auto w-full max-w-3xl">
      {FAQ_ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger className="text-base">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="max-w-2xl text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
