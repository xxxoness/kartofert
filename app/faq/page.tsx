import type { Metadata } from "next";
import { faqItems } from "@/data/faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Вопросы и ответы",
  description: "FAQ магазина KartoFert: расчёт, доставка, цены, заявки и нормы внесения."
};

export default function FAQPage() {
  return (
    <section className="container-shell py-10 md:py-14">
      <div className="max-w-3xl">
        <span className="rounded-[8px] bg-[#fff1be] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#8c5b00]">FAQ</span>
        <h1 className="mt-5 text-[40px] font-black leading-[1] tracking-[-0.06em] text-[#071a10] md:text-[62px]">
          Вопросы о товарах, расчёте и доставке
        </h1>
      </div>
      <Accordion type="single" collapsible className="mt-8 rounded-[18px] border border-[#173c25]/10 bg-white px-6 shadow-[0_18px_48px_rgba(45,35,17,.08)]">
        {faqItems.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left text-[#102116] hover:text-[#063b23]">{item.question}</AccordionTrigger>
            <AccordionContent className="text-[#5e6858]">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
