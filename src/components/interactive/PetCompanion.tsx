import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Bone, Cat, Dog, Maximize2, Minimize2, Pause, PawPrint, Play, Sparkles, X } from "lucide-react";
import miloSheet from "../../assets/clear/pet-companion-milo.webp";
import cocoSheet from "../../assets/clear/pet-companion-coco.webp";
import type { LocaleProps } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { usePetMotion } from "./use-pet-motion";

type Species = "cat" | "dog";
type Reaction = "toy" | "treat" | null;

export default function PetCompanion({ locale }: LocaleProps) {
  const { interactive: t } = getMessages(locale);
  const [species, setSpecies] = useState<Species>("cat");
  const [walking, setWalking] = useState(true);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mobileMode, setMobileMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [reaction, setReaction] = useState<Reaction>(null);
  const timeout = useRef<number | undefined>(undefined);
  const motion = usePetMotion(walking, compact, hidden || busy || mobileMode || open || reaction === "treat");
  const petName = species === "cat" ? "Milo" : "Coco";
  const sprite = species === "cat" ? miloSheet.src : cocoSheet.src;
  const pose = reaction === "toy" ? "play" : reaction === "treat" ? "treat" : motion.dragging || motion.moving ? "walk" : "idle";
  const autoIsRunning = walking && !motion.reduced;

  useEffect(() => {
    const inspect = () => {
      const dialog = document.querySelector('[data-slot="dialog-content"][data-state="open"], [data-slot="sheet-content"][data-state="open"], dialog[open]');
      const active = document.activeElement;
      const formFocus = active instanceof HTMLElement && active.matches("input, textarea, select, [contenteditable='true']");
      setBusy(Boolean(dialog || formFocus || document.body.classList.contains("dialog-open")));
    };
    const observer = new MutationObserver(inspect);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "data-state"] });
    const checkAfterFocus = () => window.requestAnimationFrame(inspect);
    document.addEventListener("focusin", inspect);
    document.addEventListener("focusout", checkAfterFocus);
    inspect();
    return () => { observer.disconnect(); document.removeEventListener("focusin", inspect); document.removeEventListener("focusout", checkAfterFocus); };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const sync = () => setMobileMode(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => { if (mobileMode) setOpen(false); }, [mobileMode]);

  useEffect(() => () => window.clearTimeout(timeout.current), []);
  const react = (next: Exclude<Reaction, null>) => {
    setReaction(next);
    window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setReaction(null), 1500);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault(); motion.moveBy(event.key === "ArrowLeft" ? -28 : 28);
    }
  };
  const onPetClick = (event: MouseEvent<HTMLButtonElement>) => { if (motion.consumeClick()) event.preventDefault(); };
  const message = reaction === "toy" ? t.petToyReaction : reaction === "treat" ? t.petTreatReaction : "";

  if (hidden || busy || mobileMode) return hidden && !busy && !mobileMode ? <button type="button" className="pet-companion-restore" onClick={() => setHidden(false)} aria-label={t.petShow}><PawPrint aria-hidden="true" /></button> : null;

  return <Popover open={open} onOpenChange={setOpen}>
    <div ref={motion.ref} className={`pet-companion${compact ? " is-compact" : ""}`} data-facing="right" role="group" aria-label={t.petCompanionLabel}>
      {message && <span className="pet-companion__bubble" role="status" aria-live="polite">{message}</span>}
      {reaction && <span className="pet-companion__toss" data-kind={reaction} aria-hidden="true">{reaction === "toy" ? "🧶" : "🦴"}</span>}
      <PopoverTrigger asChild><button type="button" className="pet-companion__avatar" aria-label={`${t.petSettings}: ${petName}`}
        aria-haspopup="dialog" aria-expanded={open} onClick={onPetClick} onKeyDown={onKeyDown} onPointerDown={motion.onPointerDown}
        onPointerMove={motion.onPointerMove} onPointerUp={motion.onPointerUp} onPointerCancel={motion.onPointerUp}>
        <span className="pet-companion__art" data-pose={pose} style={{ backgroundImage: `url("${sprite}")` }} />
        <span className="pet-companion__name">{petName}</span>
      </button></PopoverTrigger>
      <PopoverContent side="top" align="center" sideOffset={10} collisionPadding={12} className="pet-companion__panel">
        <p className="pet-companion__heading">{t.petChoose}</p>
        <div className="pet-companion__choices" role="group" aria-label={t.petChoose}>
          <Button type="button" size="sm" variant={species === "cat" ? "default" : "outline"} aria-pressed={species === "cat"} onClick={() => setSpecies("cat")}><Cat aria-hidden="true" />{t.petCat}</Button>
          <Button type="button" size="sm" variant={species === "dog" ? "default" : "outline"} aria-pressed={species === "dog"} onClick={() => setSpecies("dog")}><Dog aria-hidden="true" />{t.petDog}</Button>
        </div>
        <div className="pet-companion__actions">
          <Button type="button" size="sm" variant="outline" onClick={() => react("toy")}><Sparkles aria-hidden="true" />{t.petToy}</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => react("treat")}><Bone aria-hidden="true" />{t.petTreat}</Button>
        </div>
        <div className="pet-companion__footer">
          <Button type="button" size="sm" variant="ghost" disabled={motion.reduced} aria-pressed={autoIsRunning} onClick={() => setWalking(value => !value)}>{autoIsRunning ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}{autoIsRunning ? t.petPause : t.petResume}</Button>
          <Button type="button" size="icon-sm" variant="ghost" aria-label={t.petSize} title={compact ? t.petLarge : t.petSmall} onClick={() => setCompact(value => !value)}>{compact ? <Maximize2 aria-hidden="true" /> : <Minimize2 aria-hidden="true" />}</Button>
          <Button type="button" size="icon-sm" variant="ghost" aria-label={t.petHide} onClick={() => { setOpen(false); setHidden(true); }}><X aria-hidden="true" /></Button>
        </div>
        {motion.reduced && <p className="pet-companion__note">{t.petReduced}</p>}
      </PopoverContent>
    </div>
  </Popover>;
}
