import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PetProfile } from "../../data/community-content";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import ActionLink from "./ActionLink";

export default function AdoptionProfiles({ pets }: { pets: PetProfile[] }) {
  const [species, setSpecies] = useState("All");
  const filtered = pets.filter(pet => species === "All" || pet.species === species);
  useEffect(() => { ScrollTrigger.refresh(); }, [species]);
  return <>
    <ToggleGroup type="single" value={species} onValueChange={value => { if (value) setSpecies(value); }} className="pet-filters" aria-label="Filter adoption profiles">
      {["All", "Cat", "Dog"].map(item => <ToggleGroupItem key={item} value={item}>{item === "All" ? "All companions" : `${item}s`}</ToggleGroupItem>)}
    </ToggleGroup>
    <p className="pet-results" role="status" aria-live="polite">{filtered.length ? `${filtered.length} companion profiles` : `Ask our team about ${species === "All" ? "cats and dogs" : species.toLowerCase() + "s"} available for adoption.`}</p>
    {filtered.length ? <div className="pet-grid">{filtered.map(pet => <Card key={pet.name} className="pet-profile">
      <img {...pet.photo} loading="lazy" decoding="async" />
      <div><Badge className="pet-status">{pet.status}</Badge><h3>{pet.name}</h3><dl><dt>Age</dt><dd>{pet.age}</dd><dt>Character</dt><dd>{pet.character}</dd></dl>
        <Accordion type="single" collapsible><AccordionItem value="profile"><AccordionTrigger>Get to know {pet.name}</AccordionTrigger><AccordionContent><p>{pet.description}</p></AccordionContent></AccordionItem></Accordion>
        <ActionLink href="#contact" data-booking data-booking-service="adoption" data-booking-pet={pet.species} data-booking-context={`Adoption enquiry: ${pet.name}`}>Ask about {pet.name}</ActionLink>
      </div>
    </Card>)}</div> : <Card className="community-callout">
      <h3>Let’s find the right match</h3><p>Tell us about your home and the companion you hope to adopt. Our team can discuss available pets, their ages, and personalities with you.</p>
      <ActionLink href="#contact" data-booking data-booking-service="adoption" data-booking-pet={species === "All" ? undefined : species} data-booking-context={`Adoption enquiry: ${species === "All" ? "any companion" : species.toLowerCase() + "s"}`}>Ask about available pets</ActionLink>
    </Card>}
  </>;
}
