import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { gsap } from "gsap";
import type { PetSpecies, PetTravel } from "./pet-frames";

import { findPetLane, type PetLane } from "./pet-safe-lane";
type DragStart = { x: number; left: number; moved: boolean };
const EDGE = 4;

export function usePetMotion(enabled: boolean, compact: boolean, suspended = false, species: PetSpecies = "cat") {
  const ref = useRef<HTMLDivElement>(null);
  const position = useRef({ x: EDGE });
  const travel = useRef<PetTravel>({ distance: 0 });
  const lane = useRef<PetLane>({ left: EDGE, right: EDGE });
  const drag = useRef<DragStart | null>(null);
  const suppressClick = useRef(false);
  const [reduced, setReduced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [moving, setMoving] = useState(false);
  const clamp = useCallback((x: number) => Math.max(lane.current.left, Math.min(x, lane.current.right)), []);
  const write = useCallback((x: number) => {
    const node = ref.current;
    if (!node) return;
    const next = clamp(x);
    const delta = next - position.current.x;
    if (Math.abs(delta) > 0.02) node.dataset.facing = delta < 0 ? "left" : "right";
    travel.current.distance += Math.abs(delta);
    position.current.x = next;
    node.style.setProperty("--pet-x", `${next}px`);
  }, [clamp]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const proxy = { x: clamp(position.current.x) };
    write(proxy.x);
    let journey: gsap.core.Timeline | undefined;
    let pause: gsap.core.Tween | undefined;
    const active = enabled && !reduced && !dragging && !suspended;
    const walk = () => {
      const { left, right } = lane.current;
      if (right - left < 24) return;
      const span = Math.max(1, right - left);
      const goingRight = proxy.x < (left + right) / 2;
      const progress = goingRight ? 0.7 + Math.random() * 0.28 : Math.random() * 0.28;
      const target = left + span * progress;
      const distance = Math.abs(target - proxy.x);
      const direction = Math.sign(target - proxy.x);
      const pace = (species === "cat" ? 36 : 40) * (compact ? 68 / 88 : 1) * (0.92 + Math.random() * 0.16);
      const easingDistance = Math.min(pace * 0.65 / 2, distance / 3);
      const rampDuration = easingDistance * 2 / pace;
      const cruiseDistance = distance - easingDistance * 2;
      setMoving(true);
      journey = gsap.timeline({
        onUpdate: () => write(proxy.x),
        onComplete: () => {
          setMoving(false);
          pause = gsap.delayedCall(1.1 + Math.random() * 1.7, walk);
        },
      });
      journey.to(proxy, { x: proxy.x + direction * easingDistance, duration: rampDuration, ease: "power1.in" });
      journey.to(proxy, { x: target - direction * easingDistance, duration: cruiseDistance / pace, ease: "none" });
      journey.to(proxy, { x: target, duration: rampDuration, ease: "power1.out" });
    };
    const resize = () => {
      const next = findPetLane(node, position.current.x);
      node.dataset.safe = String(Boolean(next));
      if (next && next.left === lane.current.left && next.right === lane.current.right) return;
      lane.current = next ?? { left: EDGE, right: EDGE };
      journey?.kill();
      pause?.kill();
      setMoving(false);
      proxy.x = clamp(position.current.x);
      write(proxy.x);
      if (active) pause = gsap.delayedCall(0.35, walk);
    };
    setMoving(false);
    if (active) pause = gsap.delayedCall(0.35, walk);
    resize();
    window.addEventListener("resize", resize);
    let frame = 0;
    const scroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(resize); };
    document.addEventListener("scroll", scroll, true);
    const observer = new ResizeObserver(scroll);
    const shell = document.querySelector(".site-shell");
    if (shell) observer.observe(shell);
    return () => { journey?.kill(); pause?.kill(); cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener("scroll", scroll, true); window.removeEventListener("resize", resize); };
  }, [enabled, reduced, dragging, compact, suspended, species, clamp, write]);

  const onPointerDown = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, left: ref.current?.getBoundingClientRect().left ?? EDGE, moved: false };
    setDragging(true);
  }, []);
  const onPointerMove = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const delta = event.clientX - drag.current.x;
    if (Math.abs(delta) > 5) drag.current.moved = true;
    write(drag.current.left + delta);
  }, [write]);
  const onPointerUp = useCallback(() => {
    if (drag.current?.moved) {
      suppressClick.current = true;
      window.setTimeout(() => { suppressClick.current = false; }, 120);
    }
    drag.current = null;
    setDragging(false);
  }, []);
  const moveBy = useCallback((delta: number) => write(position.current.x + delta), [write]);
  const consumeClick = useCallback(() => { const dragged = suppressClick.current; suppressClick.current = false; return dragged; }, []);
  return { ref, travel, reduced, dragging, moving, onPointerDown, onPointerMove, onPointerUp, moveBy, consumeClick };
}
