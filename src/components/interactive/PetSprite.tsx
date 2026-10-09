import { useEffect, useRef, useState, type RefObject } from "react";
import { petFrames, petWalkFrames, type PetSpecies, type PetTravel } from "./pet-frames";
import { getPetGait } from "./pet-gait";

type Props = {
  species: PetSpecies;
  pose: "walk" | "idle" | "play" | "treat";
  travel: RefObject<PetTravel>;
  reduced: boolean;
  compact: boolean;
};

const preloaded = new Map<string, Promise<void>>();
function preload(src: string) {
  if (!preloaded.has(src)) {
    const image = new Image();
    image.src = src;
    preloaded.set(src, image.decode());
  }
  return preloaded.get(src)!;
}

export function PetSprite({ species, pose, travel, reduced, compact }: Props) {
  const art = useRef<HTMLSpanElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const gaitDistance = useRef(travel.current.distance);
  const frames = petFrames[species];
  const walkingFrames = petWalkFrames[species];
  const [readySpecies, setReadySpecies] = useState<PetSpecies | null>(null);
  const restingFrame = pose === "play" ? 14 : pose === "treat" ? 15 : 12;

  useEffect(() => {
    let cancelled = false;
    Promise.all([...walkingFrames, ...frames.slice(12)].map(preload))
      .then(() => { if (!cancelled) setReadySpecies(species); })
      .catch(() => { if (!cancelled) setReadySpecies(null); });
    return () => { cancelled = true; };
  }, [frames, walkingFrames, species]);

  useEffect(() => {
    const node = art.current;
    const img = image.current;
    if (!node || !img) return;
    const { stride } = getPetGait(species, compact);
    const startTime = performance.now();
    let previousTime = startTime;
    let currentSource = "";
    let request = 0;
    const tick = (now: number) => {
      const elapsed = Math.min(0.1, Math.max(0, (now - previousTime) / 1000));
      previousTime = now;
      const distance = travel.current.distance;
      if (pose !== "walk" || reduced || Math.abs(distance - gaitDistance.current) > stride * 2) {
        gaitDistance.current = distance;
      } else {
        gaitDistance.current += (distance - gaitDistance.current) * (1 - Math.exp(-elapsed / 0.075));
      }
      const phase = (gaitDistance.current / stride) % 1;
      const blink = ((now - startTime) % 4700) > 4460 && ((now - startTime) % 4700) < 4590;
      const walking = pose === "walk" && !reduced;
      const source = walking && readySpecies === species
        ? walkingFrames[Math.floor(phase * walkingFrames.length)]
        : frames[pose === "idle" && blink && !reduced ? 13 : restingFrame];
      if (source && source !== currentSource) {
        img.src = source;
        currentSource = source;
      }
      const lift = walking ? -0.3 * (1 - Math.cos(phase * Math.PI * 4)) / 2 : 0;
      node.style.setProperty("--pet-lift", `${lift.toFixed(3)}px`);
      if (!reduced && (pose === "walk" || pose === "idle")) request = requestAnimationFrame(tick);
    };
    tick(startTime);
    return () => cancelAnimationFrame(request);
  }, [frames, walkingFrames, readySpecies, pose, travel, reduced, species, compact, restingFrame]);

  return <span ref={art} className="pet-companion__art" data-pose={pose} aria-hidden="true">
    <img ref={image} src={frames[restingFrame]} alt="" width={192} height={192} draggable={false} />
  </span>;
}
