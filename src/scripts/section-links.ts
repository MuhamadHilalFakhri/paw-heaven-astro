import { scrollToSection } from "../components/interactive/section-navigation";

document.addEventListener("click", event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
  if (!link || link.hasAttribute("data-booking") || link.hasAttribute("data-adoption-inquiry")) return;
  const href = link.getAttribute("href");
  if (!href || href === "#" || !document.getElementById(href.slice(1))) return;
  event.preventDefault();
  scrollToSection(href);
});
