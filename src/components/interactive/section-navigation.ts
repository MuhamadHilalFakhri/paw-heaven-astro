import type { MouseEvent } from "react";

export function isSectionClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function scrollToSection(href: string, updateHistory = true) {
  const viewport = document.querySelector<HTMLElement>(".page-scroll-viewport");
  const header = document.querySelector<HTMLElement>(".paw-header");
  const target = document.getElementById(href.slice(1));
  if (!viewport || !header || !target) return;
  const headerInset = Number.parseFloat(getComputedStyle(header).top) || 0;

  // Scroll only the page viewport, preserving the sticky header and outer document.
  const top = href === "#top" ? 0 : Math.max(0,
    viewport.scrollTop + target.getBoundingClientRect().top - viewport.getBoundingClientRect().top - header.offsetHeight - headerInset - 14,
  );
  if (updateHistory && window.location.hash !== href) window.history.pushState(null, "", href);
  viewport.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}
