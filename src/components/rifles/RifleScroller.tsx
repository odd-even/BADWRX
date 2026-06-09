"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { RifleCard } from "@/components/rifles/RifleCard";
import type { Rifle } from "@/lib/types";

interface RifleScrollerProps {
  rifles: Rifle[];
  showConfigure?: boolean;
}

const SCROLL_SPEED_PX_PER_SEC = 32;
const USER_SCROLL_PAUSE_MS = 2500;
const DRAG_THRESHOLD_PX = 6;

function normalizeLoopScroll(scrollEl: HTMLDivElement) {
  const halfWidth = scrollEl.scrollWidth / 2;
  if (halfWidth <= 0) return halfWidth;

  if (scrollEl.scrollLeft >= halfWidth) {
    scrollEl.scrollLeft -= halfWidth;
  } else if (scrollEl.scrollLeft < 0) {
    scrollEl.scrollLeft += halfWidth;
  }

  return halfWidth;
}

/**
 * Native horizontal scroll (touch, drag, wheel) with idle auto-scroll.
 */
export function RifleScroller({
  rifles,
  showConfigure = true,
}: RifleScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    scrollLeft: 0,
  });
  const isAutoScrollingRef = useRef(false);
  const userPausedRef = useRef(false);
  const userPausedTimerRef = useRef<number | null>(null);
  const hoveredCardRef = useRef(false);
  const draggingRef = useRef(false);
  const canHoverRef = useRef(false);

  const [hoveredCard, setHoveredCard] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);

  const loopRifles = [...rifles, ...rifles];
  const autoScrollEnabled = ready && !reducedMotion;

  hoveredCardRef.current = hoveredCard;
  draggingRef.current = dragging;
  canHoverRef.current = canHover;

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setCanHover(hoverQuery.matches);
      setReducedMotion(motionQuery.matches);
    };

    sync();
    hoverQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => {
      hoverQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const update = () => {
      const halfWidth = scrollEl.scrollWidth / 2;
      setReady(halfWidth > 1);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(scrollEl);
    const track = scrollEl.firstElementChild;
    if (track instanceof HTMLElement) {
      observer.observe(track);
      Array.from(track.children).forEach((child) => {
        if (child instanceof HTMLElement) observer.observe(child);
      });
    }

    document.fonts?.ready.then(update).catch(() => undefined);
    const timers = [100, 500, 1500, 3000].map((delay) =>
      window.setTimeout(update, delay),
    );

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [rifles.length]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl || !autoScrollEnabled) return;

    let frame = 0;
    let lastTime = performance.now();

    const pauseForUser = () => {
      userPausedRef.current = true;
      if (userPausedTimerRef.current !== null) {
        window.clearTimeout(userPausedTimerRef.current);
      }
      userPausedTimerRef.current = window.setTimeout(() => {
        userPausedRef.current = false;
        userPausedTimerRef.current = null;
      }, USER_SCROLL_PAUSE_MS);
    };

    const onScroll = () => {
      if (isAutoScrollingRef.current) {
        normalizeLoopScroll(scrollEl);
        return;
      }
      normalizeLoopScroll(scrollEl);
      pauseForUser();
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        pauseForUser();
        return;
      }

      event.preventDefault();
      scrollEl.scrollLeft += event.deltaY;
      normalizeLoopScroll(scrollEl);
      pauseForUser();
    };

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    scrollEl.addEventListener("wheel", onWheel, { passive: false });
    scrollEl.addEventListener("touchstart", pauseForUser, { passive: true });

    const tick = (now: number) => {
      const deltaSeconds = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const pauseForHover = canHoverRef.current && hoveredCardRef.current;
      const shouldAutoScroll =
        !pauseForHover &&
        !draggingRef.current &&
        !userPausedRef.current &&
        scrollEl.scrollWidth > scrollEl.clientWidth;

      if (shouldAutoScroll) {
        isAutoScrollingRef.current = true;
        scrollEl.scrollLeft += SCROLL_SPEED_PX_PER_SEC * deltaSeconds;
        normalizeLoopScroll(scrollEl);
        isAutoScrollingRef.current = false;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      scrollEl.removeEventListener("scroll", onScroll);
      scrollEl.removeEventListener("wheel", onWheel);
      scrollEl.removeEventListener("touchstart", pauseForUser);
      if (userPausedTimerRef.current !== null) {
        window.clearTimeout(userPausedTimerRef.current);
        userPausedTimerRef.current = null;
      }
    };
  }, [autoScrollEnabled, rifles.length]);

  function handleMouseOver(event: React.MouseEvent) {
    if (!canHover) return;
    setHoveredCard(!!(event.target as HTMLElement).closest(".rifle-card"));
  }

  function handleMouseLeave() {
    setHoveredCard(false);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: scrollEl.scrollLeft,
    };
    scrollEl.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const scrollEl = scrollRef.current;
    const drag = dragRef.current;
    if (!scrollEl || !drag.active) return;

    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;

    if (!drag.moved) {
      drag.moved = true;
      setDragging(true);
      userPausedRef.current = true;
    }

    scrollEl.scrollLeft = drag.scrollLeft - deltaX;
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const scrollEl = scrollRef.current;
    const drag = dragRef.current;
    if (!scrollEl || !drag.active) return;

    const didDrag = drag.moved;
    drag.active = false;
    drag.moved = false;
    setDragging(false);

    if (scrollEl.hasPointerCapture(event.pointerId)) {
      scrollEl.releasePointerCapture(event.pointerId);
    }

    normalizeLoopScroll(scrollEl);

    if (didDrag) {
      userPausedRef.current = true;
      if (userPausedTimerRef.current !== null) {
        window.clearTimeout(userPausedTimerRef.current);
      }
      userPausedTimerRef.current = window.setTimeout(() => {
        userPausedRef.current = false;
        userPausedTimerRef.current = null;
      }, USER_SCROLL_PAUSE_MS);
    }
  }

  const cardWrapperClass =
    "flex w-[min(82vw,320px)] shrink-0 max-md:snap-start md:w-[340px] lg:w-[360px]";

  return (
    <div className="relative mt-8 md:mt-10">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--color-black)] to-transparent md:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--color-black)] to-transparent md:w-20"
        aria-hidden
      />

      <div
        ref={scrollRef}
        className={`cursor-grab overscroll-x-contain px-6 active:cursor-grabbing md:px-8 ${
          dragging ? "cursor-grabbing" : ""
        } overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] max-md:snap-x max-md:snap-mandatory md:snap-none [&::-webkit-scrollbar]:hidden`}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="flex w-max items-stretch gap-5 md:gap-6">
          {loopRifles.map((rifle, index) => (
            <div key={`${rifle.id}-${index}`} className={cardWrapperClass}>
              <RifleCard
                rifle={rifle}
                priority={index < 4}
                compact
                showConfigure={showConfigure}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
