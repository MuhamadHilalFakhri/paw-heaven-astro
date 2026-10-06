import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { plans } from "../../data/site-content";
import ChoiceSelect from "./ChoiceSelect";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "../ui/table";

const options = [
  { value: "all", label: "Explore all plans" },
  { value: "starter", label: "Essential bathing, nail & ear care" },
  { value: "wellness", label: "Grooming, coat care & wellness benefits" },
  { value: "club", label: "Frequent grooming & extra perks" },
];
const rows = [
  { label: "Monthly price, billed annually", values: plans.map(plan => plan.price) },
  { label: "Bath, brush & blow-dry", values: ["Included", "Included", "Included"] },
  { label: "Nail & ear care", values: ["Included", "Included", "Included"] },
  { label: "Full grooming & coat care", values: ["—", "Included", "Included"] },
  { label: "Wellness check", values: ["—", "Included", "Included"] },
  { label: "2 full grooming sessions", values: ["—", "—", "Included"] },
  { label: "Monthly gift box", values: ["—", "—", "Included"] },
];

export default function PlanFinder() {
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
      <ChoiceSelect id="plan-needs" label="What are you looking for?" value={choice} placeholder="Explore all plans" options={options} onChange={setChoice} />
      <p id="plan-recommendation" role="status" aria-live="polite">{selected ? `${selected.name} matches the benefits you selected. Confirm suitability and pricing with our team.` : "Choose a preference to highlight a plan worth exploring."}</p>
    </div>
    <Accordion type="single" collapsible className="plan-comparison" onValueChange={() => window.setTimeout(() => ScrollTrigger.refresh(), 250)}>
      <AccordionItem value="compare"><AccordionTrigger>Compare all plan benefits</AccordionTrigger><AccordionContent>
        <ScrollArea horizontal className="comparison-scroll" type="always" aria-label="Care plan comparison">
          <Table><TableCaption>Benefits shown on this site; confirm current prices and terms with the team.</TableCaption>
            <TableHeader><TableRow><TableHead>Benefit</TableHead>{plans.map(plan => <TableHead key={plan.name}>{plan.name}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{rows.map(row => <TableRow key={row.label}><TableHead scope="row">{row.label}</TableHead>{row.values.map((value, index) => <TableCell key={index}>{value}</TableCell>)}</TableRow>)}</TableBody>
          </Table>
        </ScrollArea>
      </AccordionContent></AccordionItem>
    </Accordion>
  </>;
}
