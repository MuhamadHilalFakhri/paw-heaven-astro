import gsap from "gsap";

export { gsap };

export const motionDuration = (seconds: number) =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : seconds;
