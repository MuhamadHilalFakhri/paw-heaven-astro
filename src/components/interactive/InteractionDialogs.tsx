import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { services } from "../../data/site-content";
import { serviceDetails } from "../../data/service-details";
import BookingForm from "./BookingForm";
import ActionLink from "./ActionLink";
import type { BookingPreset } from "./booking-model";

type Selection = { kind: "booking"; preset: BookingPreset } | { kind: "service"; key: string } | { kind: "gallery"; src: string; alt: string };

export default function InteractionDialogs() {
  const [selection, setSelection] = useState<Selection>({ kind: "booking", preset: {} });
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const show = (next: Selection) => {
      if (!open && document.activeElement instanceof HTMLElement) opener.current = document.activeElement;
      setSelection(next); setOpen(true);
    };
    const click = (event: MouseEvent) => {
      const button = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-booking], [data-service-details], [data-gallery-src]") : null;
      if (!button) return;
      event.preventDefault();
      if (button.hasAttribute("data-booking")) show({ kind: "booking", preset: { service: button.dataset.bookingService, pet: button.dataset.bookingPet, plan: button.dataset.bookingPlan, context: button.dataset.bookingContext } });
      else if (button.dataset.serviceDetails) show({ kind: "service", key: button.dataset.serviceDetails });
      else if (button.dataset.gallerySrc) show({ kind: "gallery", src: button.dataset.gallerySrc, alt: button.dataset.galleryAlt || "Clinic photo" });
    };
    const book = (event: Event) => show({ kind: "booking", preset: (event as CustomEvent<BookingPreset>).detail || {} });
    document.addEventListener("click", click);
    window.addEventListener("paw:booking", book);
    return () => { document.removeEventListener("click", click); window.removeEventListener("paw:booking", book); };
  }, [open]);
  useEffect(() => {
    document.body.classList.toggle("dialog-open", open);
    return () => { document.body.classList.remove("dialog-open"); };
  }, [open]);
  const service = selection.kind === "service" ? services.find(item => item.image === selection.key) : undefined;
  const title = selection.kind === "booking" ? "Request an appointment" : selection.kind === "gallery" ? "Around the clinic" : service?.title || "Explore our services";
  const description = selection.kind === "booking" ? "Choose your preferences. Our team will confirm availability, duration, and pricing." : selection.kind === "gallery" ? selection.alt : service?.text || "Discover care for your companion.";
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="paw-dialog shadcn-dialog" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus({ preventScroll: true }); }}>
      <ScrollArea className="dialog-scroll" type="always">
        <div className="dialog-panel">
          <header className="dialog-heading">
            <div><p className="eyebrow">{selection.kind === "booking" ? "Let’s plan your visit" : "Care that fits your companion"}</p><DialogTitle>{title}</DialogTitle></div>
            <DialogClose asChild><Button type="button" variant="ghost" size="icon" className="dialog-close" aria-label="Close dialog"><X /></Button></DialogClose>
          </header>
          <DialogDescription className="dialog-intro">{description}</DialogDescription>
          {selection.kind === "booking" && <BookingForm preset={selection.preset} />}
          {selection.kind === "service" && service && <>
            <h3>What to discuss with the team</h3>
            <ul className="detail-list">{serviceDetails[service.image].includes.map(text => <li key={text}>{text}</li>)}</ul>
            <div className="detail-note"><h3>Before your visit</h3><p>{serviceDetails[service.image].preparation}</p></div>
            <p className="field-hint">The team will confirm the price and expected duration for your pet before you agree to a visit.</p>
            <div className="dialog-actions">{service.image === "emergency" ? <ActionLink href="tel:+861815785051">Call the clinic</ActionLink> : <ActionLink href="#contact" data-booking data-booking-service={service.image}>Request this service</ActionLink>}</div>
          </>}
          {selection.kind === "gallery" && <img src={selection.src} alt={selection.alt} className="gallery-photo" />}
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>;
}
