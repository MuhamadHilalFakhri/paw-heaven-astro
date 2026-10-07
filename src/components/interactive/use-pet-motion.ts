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
  const [moving, setMoving] = useState(false);
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
    let pause: gsap.core.Tween | undefined;
    const active = enabled && !reduced && !dragging && !suspended;
    const walk = () => {
      const right = Math.max(EDGE, window.innerWidth - node.offsetWidth - EDGE);
      const span = Math.max(1, right - EDGE);
      const goingRight = proxy.x < right / 2;
      const progress = goingRight ? 0.7 + Math.random() * 0.28 : Math.random() * 0.28;
      const target = EDGE + span * progress;
      const distance = Math.abs(target - proxy.x);
      setMoving(true);
      tween = gsap.to(proxy, {
        x: target,
        duration: Math.max(3.2, distance / (34 + Math.random() * 9)),
        ease: "sine.inOut",
        onUpdate: () => write(proxy.x),
        onComplete: () => {
          setMoving(false);
          pause = gsap.delayedCall(1.1 + Math.random() * 1.7, walk);
        },
      });
    };
    const resize = () => {
      tween?.kill();
      pause?.kill();
      proxy.x = clamp(position.current.x);
      write(proxy.x);
      if (active) pause = gsap.delayedCall(0.35, walk);
    };
    setMoving(false);
    if (active) pause = gsap.delayedCall(0.35, walk);
    window.addEventListener("resize", resize);
    return () => { tween?.kill(); pause?.kill(); window.removeEventListener("resize", resize); };
  }, [enabled, reduced, dragging, compact, suspended, clamp, write]);

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
  return { ref, reduced, dragging, moving, onPointerDown, onPointerMove, onPointerUp, moveBy, consumeClick };
}
