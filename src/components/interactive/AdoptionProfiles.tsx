import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PetProfile } from "../../data/community-content";
import type { LocaleProps } from "../../i18n/config";
import { getMessages, formatMessage } from "../../i18n/messages";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import ActionLink from "./ActionLink";

type ShowcaseImages = Record<string, string>;
type ProfileCard = { name: string; species: string; age: string; character: string; description: string; status?: PetProfile["status"]; photo?: PetProfile["photo"]; imageAlt?: string };

export default function AdoptionProfiles({ pets, showcaseImages, locale }: LocaleProps & { pets: PetProfile[]; showcaseImages: ShowcaseImages }) {
  const { adoption: t, interactive: ui } = getMessages(locale);
  const [species, setSpecies] = useState<"All" | "Cat" | "Dog">("All");
  const filteredPets = pets.filter(pet => species === "All" || pet.species === species);
  const demoProfiles = pets.length ? [] : t.demoProfiles.filter(pet => species === "All" || pet.species === species);
  const profiles: ProfileCard[] = pets.length ? filteredPets : demoProfiles;
  const resultCount = profiles.length;
  useEffect(() => { ScrollTrigger.refresh(); }, [species]);

  return <>
    <ToggleGroup type="single" value={species} onValueChange={value => { if (value === "All" || value === "Cat" || value === "Dog") setSpecies(value); }} className="pet-filters" aria-label={t.filterLabel}>
      {(["All", "Cat", "Dog"] as const).map(item => <ToggleGroupItem key={item} value={item}>{t.filters[item]}</ToggleGroupItem>)}
    </ToggleGroup>
    <p className="pet-results" role="status" aria-live="polite">{pets.length && !resultCount ? t.empty : formatMessage(t.count, { count: resultCount })}</p>
    {resultCount > 0 && <Carousel opts={{ align: "start", slidesToScroll: 1 }} className="pet-carousel" aria-label={t.carouselLabel}>
      <CarouselContent className="pet-carousel-track">{profiles.map(pet => {
        const isDemo = !pets.length;
        const photo = pet.photo;
        const image = isDemo ? showcaseImages[pet.name] : photo?.src;
        const alt = isDemo ? pet.imageAlt : photo?.alt;
        return <CarouselItem key={pet.name} className="pet-carousel-slide"><Card className={`pet-profile${isDemo ? " demo-pet-card" : ""}`}>
          <div className={isDemo ? "demo-pet-art" : "pet-profile-art"}><img src={image} alt={alt ?? pet.name} loading="lazy" decoding="async" /></div>
          <div className="pet-profile-content">
            <Badge className={isDemo ? "demo-badge" : "pet-status"}>{isDemo ? ui.demoLabel : t.status[pet.status!]}</Badge><h3>{pet.name}</h3>
            <dl><dt>{t.age}</dt><dd>{pet.age}</dd><dt>{t.character}</dt><dd>{pet.character}</dd>{isDemo && <><dt>{t.availability}</dt><dd>{t.simulated}</dd></>}</dl>
            <Accordion type="single" collapsible><AccordionItem value="profile"><AccordionTrigger>{formatMessage(t.knowPet, { name: pet.name })}</AccordionTrigger><AccordionContent><p>{pet.description}</p></AccordionContent></AccordionItem></Accordion>
            <ActionLink href="#contact" data-adoption-inquiry data-adoption-pet={pet.species} data-adoption-context={pet.name}>{formatMessage(t.askPet, { name: pet.name })}</ActionLink>
          </div>
        </Card></CarouselItem>;
      })}</CarouselContent>
      {resultCount > 1 && <div className="pet-carousel-controls"><CarouselPrevious className="static size-11 translate-y-0"><span className="sr-only">{t.previous}</span></CarouselPrevious><p>{t.browseHint}</p><CarouselNext className="static size-11 translate-y-0"><span className="sr-only">{t.next}</span></CarouselNext></div>}
    </Carousel>}
  </>;
}
