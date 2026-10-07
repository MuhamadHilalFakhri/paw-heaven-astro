import type { LocaleProps } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { getSiteContent } from "../../data/site-content";
import { getServiceDetails } from "../../data/service-details";
import BookingForm from "./BookingForm";
import AdoptionInquiryForm from "./AdoptionInquiryForm";
import ActionLink from "./ActionLink";
import type { BookingPreset } from "./booking-model";

type Selection = { kind: "booking"; preset: BookingPreset } | { kind: "adoption"; pet?: string; context?: string } | { kind: "service"; key: string } | { kind: "gallery"; src: string; alt: string };

export default function InteractionDialogs({ locale }: LocaleProps) {
  const { interactive: t } = getMessages(locale);
  const { services } = getSiteContent(locale);
  const serviceDetails = getServiceDetails(locale);
  const [selection, setSelection] = useState<Selection>({ kind: "booking", preset: {} });
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const show = (next: Selection) => {
      if (!open && document.activeElement instanceof HTMLElement) opener.current = document.activeElement;
      setSelection(next); setOpen(true);
    };
    const click = (event: MouseEvent) => {
      const button = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-booking], [data-adoption-inquiry], [data-service-details], [data-gallery-src]") : null;
      if (!button) return;
      event.preventDefault();
      if (button.hasAttribute("data-adoption-inquiry")) show({ kind: "adoption", pet: button.dataset.adoptionPet, context: button.dataset.adoptionContext });
      else if (button.hasAttribute("data-booking")) show({ kind: "booking", preset: { service: button.dataset.bookingService, pet: button.dataset.bookingPet, plan: button.dataset.bookingPlan, context: button.dataset.bookingContext } });
      else if (button.dataset.serviceDetails) show({ kind: "service", key: button.dataset.serviceDetails });
      else if (button.dataset.gallerySrc) show({ kind: "gallery", src: button.dataset.gallerySrc, alt: button.dataset.galleryAlt || t.clinicPhoto });
    };
    const book = (event: Event) => show({ kind: "booking", preset: (event as CustomEvent<BookingPreset>).detail || {} });
    document.addEventListener("click", click);
    window.addEventListener("paw:booking", book);
    return () => { document.removeEventListener("click", click); window.removeEventListener("paw:booking", book); };
  }, [open, locale]);
  useEffect(() => {
    document.body.classList.toggle("dialog-open", open);
    return () => { document.body.classList.remove("dialog-open"); };
  }, [open, locale]);
  const service = selection.kind === "service" ? services.find(item => item.image === selection.key) : undefined;
  const title = selection.kind === "booking" ? t.bookingTitle : selection.kind === "adoption" ? t.adoptionTitle : selection.kind === "gallery" ? t.galleryTitle : service?.title || t.serviceTitle;
  const description = selection.kind === "booking" ? t.bookingDescription : selection.kind === "adoption" ? t.adoptionDescription : selection.kind === "gallery" ? selection.alt : service?.text || t.serviceDescription;
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="paw-dialog shadcn-dialog" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus({ preventScroll: true }); }}>
      <ScrollArea className="dialog-scroll" type="always">
        <div className="dialog-panel">
          <header className="dialog-heading">
            <div><p className="eyebrow">{selection.kind === "booking" ? t.bookingEyebrow : selection.kind === "adoption" ? t.adoptionEyebrow : t.serviceEyebrow}</p><DialogTitle>{title}</DialogTitle></div>
            <DialogClose asChild><Button type="button" variant="ghost" size="icon" className="dialog-close" aria-label={t.closeDialog}><X /></Button></DialogClose>
          </header>
          <DialogDescription className="dialog-intro">{description}</DialogDescription>
          {selection.kind === "booking" && <BookingForm locale={locale} preset={selection.preset} />}
          {open && selection.kind === "adoption" && <AdoptionInquiryForm locale={locale} key={`${selection.pet || "any"}-${selection.context || "adoption"}`} pet={selection.pet} context={selection.context} />}
          {selection.kind === "service" && service && <>
            <h3>{t.discuss}</h3>
            <ul className="detail-list">{serviceDetails[service.image].includes.map(text => <li key={text}>{text}</li>)}</ul>
            <div className="detail-note"><h3>{t.beforeVisit}</h3><p>{serviceDetails[service.image].preparation}</p></div>
            <p className="field-hint">{t.priceHint}</p>
            <div className="dialog-actions">{service.image === "emergency" ? <ActionLink href="tel:+861815785051">{t.callClinic}</ActionLink> : <ActionLink href="#contact" data-booking data-booking-service={service.image}>{t.requestService}</ActionLink>}</div>
          </>}
          {selection.kind === "gallery" && <img src={selection.src} alt={selection.alt} className="gallery-photo" />}
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>;
}
