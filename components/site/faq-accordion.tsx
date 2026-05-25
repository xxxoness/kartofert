import { faqItems } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQAccordion({ items = faqItems }: { items?: typeof faqItems }) {
  return (
    <Accordion type="single" collapsible className="rounded-[8px] border border-white/10 bg-white/[0.06] px-5">
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`item-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
