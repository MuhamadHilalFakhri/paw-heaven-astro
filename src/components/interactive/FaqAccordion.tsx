import type { LocaleProps } from "../../i18n/config";
import { getSiteContent } from "../../data/site-content";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FaqAccordion({ locale }: LocaleProps) {
  const { questions } = getSiteContent(locale);
  return <Accordion type="single" collapsible defaultValue="question-0" className="faq-list" onValueChange={() => {
    window.setTimeout(() => ScrollTrigger.refresh(), 250);
  }}>
    {questions.map((item, index) => <AccordionItem key={item.question} value={`question-${index}`} className="paw-faq-item">
      <AccordionTrigger className="paw-faq-trigger">{item.question}</AccordionTrigger>
      <AccordionContent><p className="paw-faq-answer">{item.answer}</p></AccordionContent>
    </AccordionItem>)}
  </Accordion>;
}
