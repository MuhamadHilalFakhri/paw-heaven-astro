import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PetProfile } from "../../data/community-content";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import ActionLink from "./ActionLink";

type ShowcaseImages = { cat: string; dog: string };

const showcaseProfiles = [
  { species: "Cat", title: "Curious cats", alt: "Three friendly cats: an orange tabby, a gray-and-white cat, and a cream kitten", description: "Ask our team about cats who may be a good fit for your home." },
  { species: "Dog", title: "Friendly dogs", alt: "Three cheerful dogs: a golden retriever, a beagle, and a fluffy white dog", description: "Ask our team about dogs who may be a good fit for your home." },
] as const;

export default function AdoptionProfiles({ pets, showcaseImages }: { pets: PetProfile[]; showcaseImages: ShowcaseImages }) {
  const [species, setSpecies] = useState("All");
  const filtered = pets.filter(pet => species === "All" || pet.species === species);
  const filteredShowcase = showcaseProfiles.filter(pet => species === "All" || pet.species === species);
  useEffect(() => { ScrollTrigger.refresh(); }, [species]);
  return <>
    <ToggleGroup type="single" value={species} onValueChange={value => { if (value) setSpecies(value); }} className="pet-filters" aria-label="Filter adoption profiles">
      {["All", "Cat", "Dog"].map(item => <ToggleGroupItem key={item} value={item}>{item === "All" ? "All companions" : `${item}s`}</ToggleGroupItem>)}
    </ToggleGroup>
    <p className="pet-results" role="status" aria-live="polite">{filtered.length ? `${filtered.length} companion profiles` : `Showing ${species === "All" ? "cat and dog" : species.toLowerCase()} illustrations. Ask our team about current adoption availability.`}</p>
    {filtered.length ? <div className="pet-grid">{filtered.map(pet => <Card key={pet.name} className="pet-profile">
      <img {...pet.photo} loading="lazy" decoding="async" />
      <div><Badge className="pet-status">{pet.status}</Badge><h3>{pet.name}</h3><dl><dt>Age</dt><dd>{pet.age}</dd><dt>Character</dt><dd>{pet.character}</dd></dl>
        <Accordion type="single" collapsible><AccordionItem value="profile"><AccordionTrigger>Get to know {pet.name}</AccordionTrigger><AccordionContent><p>{pet.description}</p></AccordionContent></AccordionItem></Accordion>
        <ActionLink href="#contact" data-adoption-inquiry data-adoption-pet={pet.species} data-adoption-context={pet.name}>Ask about {pet.name}</ActionLink>
      </div>
    </Card>)}</div> : <div className="pet-grid companion-showcase">{filteredShowcase.map(pet => <Card key={pet.species} className="companion-showcase-card" data-species={pet.species}>
      <div className="companion-showcase-art"><img src={showcaseImages[pet.species.toLowerCase() as "cat" | "dog"]} alt={pet.alt} loading="lazy" decoding="async" /></div>
      <div className="companion-showcase-copy"><span className="companion-kind">{pet.species} companions</span><h3>{pet.title}</h3><p>{pet.description}</p>
        <ActionLink href="#contact" data-adoption-inquiry data-adoption-pet={pet.species} data-adoption-context={pet.title}>Ask about {pet.species.toLowerCase()}s</ActionLink>
      </div>
    </Card>)}</div>}
  </>;
}
