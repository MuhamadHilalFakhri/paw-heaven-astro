import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Menu } from "lucide-react";
import { getSiteContent } from "../../data/site-content";
import type { LocaleProps } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import ActionLink from "./ActionLink";
import { isSectionClick, scrollToSection } from "./section-navigation";

export default function HeaderNav({ locale }: LocaleProps) {
  const { navigationLinks } = getSiteContent(locale);
  const { page: t } = getMessages(locale);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const pendingSection = useRef<string | null>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string, mobile = false) => {
    if (!isSectionClick(event)) return;
    event.preventDefault();
    if (mobile) { pendingSection.current = href; setOpen(false); }
    else { setActive(href); scrollToSection(href); }
  };
  useEffect(() => {
    const viewport = document.querySelector<HTMLElement>(".page-scroll-viewport");
    const header = document.querySelector<HTMLElement>(".paw-header");
    if (!viewport || !header) return;
    let frame = 0;
    const update = () => {
      let current = "#top", closest = -Infinity;
      navigationLinks.forEach(link => {
        const top = document.querySelector(link.href)?.getBoundingClientRect().top;
        if (top !== undefined && top <= header.offsetHeight + 90 && top > closest) {
          closest = top; current = link.href;
        }
      });
      setActive(current);
      header.classList.toggle("is-scrolled", viewport.scrollTop > 80);
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const wide = window.matchMedia("(min-width: 901px)");
    const onWide = () => { if (wide.matches) setOpen(false); };
    const onHistory = () => scrollToSection(window.location.hash || "#top", false);
    viewport.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    wide.addEventListener("change", onWide);
    window.addEventListener("popstate", onHistory);
    update();
    return () => { viewport.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); wide.removeEventListener("change", onWide); window.removeEventListener("popstate", onHistory); cancelAnimationFrame(frame); };
  }, [navigationLinks]);
  return <>
    <a href="#top" className="paw-brand" onClick={event => navigate(event, "#top")}><img src="/pawcare-mark.svg" width="48" height="48" alt="" /><span>PawCare+</span></a>
    <nav aria-label={t.mainNav} className="desktop-nav">
      {navigationLinks.map(link => <Button key={link.href} asChild variant="ghost" className={active === link.href ? "active" : ""}><a href={link.href} onClick={event => navigate(event, link.href)} aria-current={active === link.href ? "location" : undefined}>{link.label}</a></Button>)}
    </nav>
    <div className="header-book"><ActionLink href="#contact" data-booking>{t.book}</ActionLink></div>
    <LanguageSwitcher locale={locale} />
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild><Button ref={menuTrigger} variant="ghost" size="icon" className="mobile-toggle" aria-label={t.openMenu}><Menu /></Button></SheetTrigger>
      <SheetContent className="paw-sheet" closeLabel={t.close} onCloseAutoFocus={event => {
        if (!pendingSection.current) return;
        event.preventDefault();
        const href = pendingSection.current;
        pendingSection.current = null;
        menuTrigger.current?.focus({ preventScroll: true });
        setActive(href); scrollToSection(href);
      }}>
        <SheetHeader><SheetTitle>{t.explore}</SheetTitle><SheetDescription>{t.menuDescription}</SheetDescription></SheetHeader>
        <ScrollArea className="sheet-scroll">
          <nav aria-label={t.mobileNav} className="sheet-navigation">
            {navigationLinks.map(link => <Button key={link.href} asChild variant="ghost" className={active === link.href ? "active" : ""}><a href={link.href} onClick={event => navigate(event, link.href, true)} aria-current={active === link.href ? "location" : undefined}>{link.label}</a></Button>)}
          </nav>
          <Button className="paw-button" onClick={() => {
            setOpen(false);
            requestAnimationFrame(() => window.dispatchEvent(new CustomEvent("paw:booking", { detail: {} })));
          }}>{t.book}</Button>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  </>;
}

