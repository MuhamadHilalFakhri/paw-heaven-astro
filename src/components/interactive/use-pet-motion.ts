import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { gsap } from "gsap";

type DragStart = { x: number; left: number; moved: boolean };
const EDGE = 10;

export function usePetMotion(enabled: boolean, compact: boolean, suspended = false) {
  const ref = useRef<HTMLDivElement>(null);
  const position = useRef({ x: EDGE });
  const drag = useRef<DragStart | null>(null);
  const suppressClick = useRef(false);
  const [reduced, setReduced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const clamp = useCallback((x: number) => Math.max(EDGE, Math.min(x, window.innerWidth - (ref.current?.offsetWidth ?? 112) - EDGE)), []);
  const write = useCallback((x: number) => {
    const node = ref.current;
    if (!node) return;
    const next = clamp(x);
    node.dataset.facing = next < position.current.x ? "left" : "right";
    position.current.x = next;
    node.style.left = `${next}px`;
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
    let tween: gsap.core.Tween | undefined;
    const walk = () => {
      const right = Math.max(EDGE, window.innerWidth - node.offsetWidth - EDGE);
      const target = proxy.x < right / 2 ? right : EDGE;
      tween = gsap.to(proxy, { x: target, duration: Math.max(16, right / 13), ease: "none", onUpdate: () => write(proxy.x), onComplete: walk });
    };
    if (enabled && !reduced && !dragging && !suspended) walk();
    const resize = () => { tween?.kill(); proxy.x = clamp(position.current.x); write(proxy.x); if (enabled && !reduced && !dragging && !suspended) walk(); };
    window.addEventListener("resize", resize);
    return () => { tween?.kill(); window.removeEventListener("resize", resize); };
  }, [enabled, reduced, dragging, compact, suspended, clamp, write]);

  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, left: ref.current?.getBoundingClientRect().left ?? EDGE, moved: false };
    setDragging(true);
  }, []);
  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
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
  return { ref, reduced, dragging, onPointerDown, onPointerMove, onPointerUp, moveBy, consumeClick };
}
