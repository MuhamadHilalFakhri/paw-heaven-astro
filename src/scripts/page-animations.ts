import { gsap } from "./motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ scroller: ".page-scroll-viewport" });

const media = gsap.matchMedia();
media.add(
  {
    desktop: "(min-width: 761px)",
    mobile: "(max-width: 760px)",
    reduced: "(prefers-reduced-motion: reduce)",
  },
  (context) => {
    const { mobile, reduced } = context.conditions!;
    if (reduced) return;

    const distance = mobile ? 18 : 32;
    gsap.timeline({ defaults: { ease: "power2.out", duration: 0.65 } })
      .from(".paw-hero h1, .paw-hero > p, .hero-action", {
        opacity: 0, y: distance, stagger: 0.12, clearProps: "opacity,transform",
      })
      .from(".hero-illustration", {
        opacity: 0, y: distance, clearProps: "opacity,transform",
      }, "-=0.3");

    const groups = [
      ".intro-section h2", ".feature-card", ".testimonial-band > :not(span)",
      ".services-section .section-heading", ".service-card", ".adoption-section > *",
      ".vaccine-card", ".plans-section .section-heading", ".plan-card",
      ".faq-section h2", ".faq-illustration", ".faq-questions",
      ".footer-illustration", ".footer-grid > div", ".footer-bottom",
      ".community-section .section-heading", ".community-card",
    ];
    groups.forEach((selector) => {
      gsap.utils.toArray<HTMLElement>(selector).forEach((element, index) => {
        gsap.from(element, {
          opacity: 0, y: distance, duration: mobile ? 0.45 : 0.65,
          delay: mobile ? 0 : (index % 3) * 0.06, ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: element, start: "top 94%", once: true },
        });
      });
    });

    if (!mobile) {
      gsap.utils.toArray<HTMLElement>(".hero-mark, .trust-leaf, .trust-star")
        .forEach((element, index) => {
          const float = gsap.to(element, {
            y: index % 2 ? 7 : -7, duration: 2.4 + index * 0.15,
            repeat: -1, yoyo: true, ease: "sine.inOut", paused: true,
          });
          ScrollTrigger.create({
            trigger: element, start: "top bottom", end: "bottom top",
            onToggle: (self) => { if (self.isActive) float.play(); else float.pause(); },
          });
        });
    }
  },
);

// Image dimensions reserve their space; refreshing on every lazy load interrupts native anchor scrolling.
document.fonts.ready.then(() => ScrollTrigger.refresh());
