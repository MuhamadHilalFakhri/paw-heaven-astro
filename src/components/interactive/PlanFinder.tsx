import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LocaleProps } from "../../i18n/config";
import { getMessages, formatMessage } from "../../i18n/messages";
import { getSiteContent } from "../../data/site-content";
import { formatPrice } from "../../i18n/config";
import ChoiceSelect from "./ChoiceSelect";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "../ui/table";

export default function PlanFinder({ locale }: LocaleProps) {
  const { planFinder: t } = getMessages(locale);
  const { plans } = getSiteContent(locale);
  const options = ["all", "starter", "wellness", "club"].map(value => ({ value, label: t[value as "all" | "starter" | "wellness" | "club"] }));
  const rows = [
    { label: t.rows[0], values: plans.map(plan => formatPrice(plan.price, locale)) },
    { label: t.rows[1], values: [t.included, t.included, t.included] },
    { label: t.rows[2], values: [t.included, t.included, t.included] },
    { label: t.rows[3], values: ["—", t.included, t.included] },
    { label: t.rows[4], values: ["—", t.included, t.included] },
    { label: t.rows[5], values: ["—", "—", t.included] },
    { label: t.rows[6], values: ["—", "—", t.included] },
  ];
  const [choice, setChoice] = useState("all");
  const selected = plans.find(plan => plan.image === choice);
  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-plan]").forEach(card => {
      const match = card.dataset.plan === choice;
      card.classList.toggle("is-recommended", match);
      const badge = card.querySelector<HTMLElement>("[data-plan-badge]");
      if (badge) badge.hidden = !match;
    });
    ScrollTrigger.refresh();
  }, [choice]);
  return <>
    <div className="plan-finder">
      <ChoiceSelect id="plan-needs" label={t.label} value={choice} placeholder={t.all} options={options} onChange={setChoice} />
      <p id="plan-recommendation" role="status" aria-live="polite">{selected ? formatMessage(t.recommendation, { name: selected.name }) : t.hint}</p>
    </div>
    <Accordion type="single" collapsible className="plan-comparison" onValueChange={() => window.setTimeout(() => ScrollTrigger.refresh(), 250)}>
      <AccordionItem value="compare"><AccordionTrigger>{t.compare}</AccordionTrigger><AccordionContent>
        <ScrollArea horizontal className="comparison-scroll" type="always" aria-label={t.comparisonLabel}>
          <Table><TableCaption>{t.caption}</TableCaption>
            <TableHeader><TableRow><TableHead>{t.benefit}</TableHead>{plans.map(plan => <TableHead key={plan.name}>{plan.name}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{rows.map(row => <TableRow key={row.label}><TableHead scope="row">{row.label}</TableHead>{row.values.map((value, index) => <TableCell key={index}>{value}</TableCell>)}</TableRow>)}</TableBody>
          </Table>
        </ScrollArea>
      </AccordionContent></AccordionItem>
    </Accordion>
  </>;
}
