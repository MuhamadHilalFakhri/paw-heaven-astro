import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PetProfile } from "../../data/community-content";
import type { LocaleProps } from "../../i18n/config";
import { getMessages, formatMessage } from "../../i18n/messages";
import { getAdoptionExtras } from "../../i18n/adoption-extras";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import AdoptionCard from "./AdoptionCard";
import AdoptionCarouselControls from "./AdoptionCarouselControls";
import AdoptionQuiz from "./AdoptionQuiz";
import type { ProfileCard, ShowcaseImages } from "./adoption-model";

type Filter = "All" | "Cat" | "Dog" | "Favorite";
export default function AdoptionProfiles({ pets, showcaseImages, locale }: LocaleProps & { pets: PetProfile[]; showcaseImages: ShowcaseImages }) {
  const { adoption: t } = getMessages(locale);
  const extra = getAdoptionExtras(locale);
  const [filter, setFilter] = useState<Filter>("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recommended, setRecommended] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const allProfiles: ProfileCard[] = pets.length ? pets : t.demoProfiles;
  const profiles = useMemo(() => allProfiles.filter(pet => filter === "All" || (filter === "Favorite" ? favorites.includes(pet.name) : pet.species === filter)), [allProfiles, filter, favorites]);
  const changeFilter = (value: string) => {
    if (!["All", "Cat", "Dog", "Favorite"].includes(value)) return;
    setFilter(value as Filter); setRecommended(null);
  };
  const recommend = (name: string) => { setFilter("All"); setRecommended(name); };
  useEffect(() => { ScrollTrigger.refresh(); }, [filter, favorites, recommended]);
  useEffect(() => {
    if (!api || !recommended) return;
    const index = profiles.findIndex(pet => pet.name === recommended);
    if (index >= 0) api.scrollTo(Math.min(index, api.scrollSnapList().length - 1));
  }, [api, recommended, profiles]);

  return <>
    <AdoptionQuiz locale={locale} profiles={allProfiles} images={showcaseImages} onRecommend={recommend} />
    <ToggleGroup type="single" value={filter} onValueChange={changeFilter} className="pet-filters" aria-label={t.filterLabel}>
      {(["All", "Cat", "Dog"] as const).map(item => <ToggleGroupItem key={item} value={item}>{t.filters[item]}</ToggleGroupItem>)}
      <ToggleGroupItem value="Favorite"><Heart aria-hidden="true" />{extra.favorites} ({favorites.length})</ToggleGroupItem>
    </ToggleGroup>
    <p className="pet-results" role="status" aria-live="polite">{profiles.length ? formatMessage(t.count, { count: profiles.length }) : filter === "Favorite" ? extra.emptyFavorites : t.empty}</p>
    {profiles.length > 0 ? <Carousel key={filter} setApi={setApi} opts={{ align: "start", slidesToScroll: 1 }} className="pet-carousel" aria-label={t.carouselLabel}>
      <CarouselContent className="pet-carousel-track">{profiles.map(pet => <CarouselItem key={pet.name} className="pet-carousel-slide">
        <AdoptionCard locale={locale} pet={pet} demo={!pets.length} image={pets.length ? pet.photo?.src : showcaseImages[pet.name]}
          favorite={favorites.includes(pet.name)} recommended={recommended === pet.name}
          onFavorite={() => setFavorites(previous => previous.includes(pet.name) ? previous.filter(name => name !== pet.name) : [...previous, pet.name])} />
      </CarouselItem>)}</CarouselContent>
      <AdoptionCarouselControls locale={locale} total={profiles.length} />
    </Carousel> : <Card className="pet-empty"><Heart aria-hidden="true" /><p>{filter === "Favorite" ? extra.favoriteHint : t.empty}</p><Button type="button" variant="outline" onClick={() => changeFilter("All")}>{extra.showAll}</Button></Card>}
  </>;
}
