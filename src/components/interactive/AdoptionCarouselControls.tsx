import { useEffect, useState } from "react";
import type { LocaleProps } from "../../i18n/config";
import { getMessages, formatMessage } from "../../i18n/messages";
import { getAdoptionExtras } from "../../i18n/adoption-extras";
import { Button } from "../ui/button";
import { CarouselNext, CarouselPrevious } from "../ui/carousel";
import { useCarousel } from "../ui/carousel-context";

export default function AdoptionCarouselControls({ total, locale }: LocaleProps & { total: number }) {
  const { api } = useCarousel();
  const { adoption: t } = getMessages(locale);
  const extra = getAdoptionExtras(locale);
  const [position, setPosition] = useState({ selected: 0, snaps: 1, visible: 1 });
  useEffect(() => {
    if (!api) return;
    const sync = () => {
      const first = api.slideNodes()[0];
      const viewport = api.containerNode().parentElement;
      const visible = first && viewport ? Math.max(1, Math.round(viewport.clientWidth / first.getBoundingClientRect().width)) : 1;
      setPosition({ selected: api.selectedScrollSnap(), snaps: api.scrollSnapList().length, visible });
    };
    sync(); api.on("select", sync); api.on("reInit", sync);
    return () => { api.off("select", sync); api.off("reInit", sync); };
  }, [api]);
  const start = Math.min(position.selected + 1, total);
  const end = Math.min(start + position.visible - 1, total);
  return <div className="adoption-navigation">
    <div className="pet-carousel-controls">
      <CarouselPrevious className="static size-11 translate-y-0"><span className="sr-only">{t.previous}</span></CarouselPrevious>
      <div className="carousel-position"><p role="status" aria-live="polite">{formatMessage(start === end ? extra.position : extra.range, { start, end, total })}</p>
        <div className="carousel-dots">{Array.from({ length: position.snaps }, (_, index) => <Button key={index} type="button" size="icon" variant="ghost"
          aria-label={formatMessage(extra.goTo, { position: index + 1 })} aria-current={position.selected === index ? "true" : undefined} onClick={() => api?.scrollTo(index)}><span /></Button>)}</div>
      </div>
      <CarouselNext className="static size-11 translate-y-0"><span className="sr-only">{t.next}</span></CarouselNext>
    </div><p className="carousel-hint">{t.browseHint}</p>
  </div>;
}
