import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PetProfile } from "../../data/community-content";
import type { LocaleProps } from "../../i18n/config";
import { getMessages, formatMessage } from "../../i18n/messages";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import ActionLink from "./ActionLink";

type ShowcaseImages = { cat: string; dog: string };

export default function AdoptionProfiles({ pets, showcaseImages, locale }: LocaleProps & { pets: PetProfile[]; showcaseImages: ShowcaseImages }) {
  const { adoption: t } = getMessages(locale);
  const showcaseProfiles = [{ species: "Cat", ...t.cat }, { species: "Dog", ...t.dog }] as const;
  const [species, setSpecies] = useState<"All" | "Cat" | "Dog">("All");
  const filtered = pets.filter(pet => species === "All" || pet.species === species);
  const filteredShowcase = showcaseProfiles.filter(pet => species === "All" || pet.species === species);
  useEffect(() => { ScrollTrigger.refresh(); }, [species]);
  return <>
    <ToggleGroup type="single" value={species} onValueChange={value => { if (value === "All" || value === "Cat" || value === "Dog") setSpecies(value); }} className="pet-filters" aria-label={t.filterLabel}>
      {(["All", "Cat", "Dog"] as const).map(item => <ToggleGroupItem key={item} value={item}>{t.filters[item]}</ToggleGroupItem>)}
    </ToggleGroup>
    <p className="pet-results" role="status" aria-live="polite">{filtered.length ? formatMessage(t.count, { count: filtered.length }) : formatMessage(t.illustrations, { species: species === "All" ? t.allSpecies : t.speciesNames[species] })}</p>
    {filtered.length ? <div className="pet-grid">{filtered.map(pet => <Card key={pet.name} className="pet-profile">
      <img {...pet.photo} loading="lazy" decoding="async" />
      <div><Badge className="pet-status">{t.status[pet.status]}</Badge><h3>{pet.name}</h3><dl><dt>{t.age}</dt><dd>{pet.age}</dd><dt>{t.character}</dt><dd>{pet.character}</dd></dl>
        <Accordion type="single" collapsible><AccordionItem value="profile"><AccordionTrigger>{formatMessage(t.knowPet, { name: pet.name })}</AccordionTrigger><AccordionContent><p>{pet.description}</p></AccordionContent></AccordionItem></Accordion>
        <ActionLink href="#contact" data-adoption-inquiry data-adoption-pet={pet.species} data-adoption-context={pet.name}>{formatMessage(t.askPet, { name: pet.name })}</ActionLink>
      </div>
    </Card>)}</div> : <div className="pet-grid companion-showcase">{filteredShowcase.map(pet => <Card key={pet.species} className="companion-showcase-card" data-species={pet.species}>
      <div className="companion-showcase-art"><img src={showcaseImages[pet.species.toLowerCase() as "cat" | "dog"]} alt={pet.alt} loading="lazy" decoding="async" /></div>
      <div className="companion-showcase-copy"><span className="companion-kind">{pet.kind}</span><h3>{pet.title}</h3><p>{pet.description}</p>
        <ActionLink href="#contact" data-adoption-inquiry data-adoption-pet={pet.species} data-adoption-context={pet.title}>{pet.ask}</ActionLink>
      </div>
    </Card>)}</div>}
  </>;
}
