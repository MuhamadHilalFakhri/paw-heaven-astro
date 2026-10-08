import { Heart } from "lucide-react";
import type { LocaleProps } from "../../i18n/config";
import { getMessages, formatMessage } from "../../i18n/messages";
import { getAdoptionExtras } from "../../i18n/adoption-extras";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import ActionLink from "./ActionLink";
import type { ProfileCard } from "./adoption-model";

type Props = LocaleProps & { pet: ProfileCard; image?: string; demo: boolean; favorite: boolean; recommended: boolean; onFavorite: () => void };
export default function AdoptionCard({ pet, image, demo, favorite, recommended, onFavorite, locale }: Props) {
  const { adoption: t, interactive: ui } = getMessages(locale);
  const extra = getAdoptionExtras(locale);
  return <Card className={`pet-profile${demo ? " demo-pet-card" : ""}${recommended ? " is-match" : ""}`} data-profile-name={pet.name} tabIndex={-1}>
    <div className={demo ? "demo-pet-art" : "pet-profile-art"}><img src={image} alt={demo ? pet.imageAlt ?? pet.name : pet.photo?.alt ?? pet.name} loading="lazy" decoding="async" /></div>
    <div className="pet-profile-content">
      <div className="pet-card-status"><Badge className={demo ? "demo-badge" : "pet-status"}>{demo ? ui.demoLabel : t.status[pet.status!]}</Badge>
        <Button type="button" variant="ghost" size="icon" className="pet-favorite" aria-pressed={favorite}
          aria-label={formatMessage(favorite ? extra.removeFavorite : extra.addFavorite, { name: pet.name })} onClick={onFavorite}>
          <Heart aria-hidden="true" fill={favorite ? "currentColor" : "none"} />
        </Button>
      </div>
      <h3>{pet.name}</h3>{recommended && <Badge className="match-badge">{extra.matchBadge}</Badge>}
      <dl><dt>{t.age}</dt><dd>{pet.age}</dd><dt>{t.character}</dt><dd>{pet.character}</dd>{demo && <><dt>{t.availability}</dt><dd>{t.simulated}</dd></>}</dl>
      <Accordion type="single" collapsible><AccordionItem value="profile"><AccordionTrigger>{formatMessage(t.knowPet, { name: pet.name })}</AccordionTrigger><AccordionContent><p>{pet.description}</p></AccordionContent></AccordionItem></Accordion>
      <ActionLink href="#contact" data-adoption-inquiry data-adoption-pet={pet.species} data-adoption-context={pet.name}>{formatMessage(t.askPet, { name: pet.name })}</ActionLink>
    </div>
  </Card>;
}
