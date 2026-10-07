import { useEffect, useRef, type RefObject } from "react";
import { petFrames, type PetSpecies, type PetTravel } from "./pet-frames";

type Props = {
  species: PetSpecies;
  pose: "walk" | "idle" | "play" | "treat";
  travel: RefObject<PetTravel>;
  reduced: boolean;
  compact: boolean;
};

const preloaded = new Set<string>();
const CAT_WALK = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const DOG_WALK = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11];

export function PetSprite({ species, pose, travel, reduced, compact }: Props) {
  const art = useRef<HTMLSpanElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const frames = petFrames[species];
  const restingFrame = pose === "play" ? 14 : pose === "treat" ? 15 : 12;

  useEffect(() => {
    frames.forEach(src => {
      if (preloaded.has(src)) return;
      preloaded.add(src);
      const preload = new Image();
      preload.src = src;
      void preload.decode().catch(() => preloaded.delete(src));
    });
  }, [frames]);

  useEffect(() => {
    const node = art.current;
    const img = image.current;
    if (!node || !img) return;
    const startDistance = travel.current.distance;
    const stride = (species === "cat" ? 38 : 42) * (compact ? 68 / 88 : 1);
    const walkFrames = species === "cat" ? CAT_WALK : DOG_WALK;
    const startTime = performance.now();
    let frameId = -1;
    let request = 0;
    const tick = (now: number) => {
      const phase = ((travel.current.distance - startDistance) / stride) % 1;
      const blink = ((now - startTime) % 4700) > 4460 && ((now - startTime) % 4700) < 4590;
      const next = pose === "walk" && !reduced ? walkFrames[Math.floor(phase * walkFrames.length)]
        : pose === "idle" && blink && !reduced ? 13 : restingFrame;
      if (next !== frameId && frames[next]) {
        img.src = frames[next];
        frameId = next;
      }
      const lift = pose === "walk" && !reduced ? -0.65 * (1 - Math.cos(phase * Math.PI * 4)) / 2 : 0;
      node.style.setProperty("--pet-lift", `${lift.toFixed(3)}px`);
      if (!reduced && (pose === "walk" || pose === "idle")) request = requestAnimationFrame(tick);
    };
    tick(startTime);
    return () => cancelAnimationFrame(request);
  }, [frames, pose, travel, reduced, species, compact, restingFrame]);

  return <span ref={art} className="pet-companion__art" data-pose={pose} aria-hidden="true">
    <img ref={image} src={frames[restingFrame]} alt="" width={192} height={192} draggable={false} />
  </span>;
}
