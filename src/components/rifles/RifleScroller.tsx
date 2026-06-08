"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RifleCard } from "@/components/rifles/RifleCard";
import type { Rifle } from "@/lib/types";

interface RifleScrollerProps {
  rifles: Rifle[];
}

const AUTO_SCROLL_PX_PER_FRAME = 0.35;
const RIFLES_PER_INTERACTION = 3;
const SMOOTH_EASE = 0.14;

function measureCardStep(el: HTMLDivElement): number {
  const first = el.children[0] as HTMLElement | undefined;
  if (!first) return 0;
  const gap = parseFloat(getComputedStyle(el).columnGap || "20") || 20;
  return first.offsetWidth + gap;
}

function clampScroll(el: HTMLDivElement, value: number) {
  const max = Math.max(0, el.scrollWidth - el.clientWidth);
  return Math.min(max, Math.max(0, value));
}

function getManualScrollBounds(
  el: HTMLDivElement,
  scrollOrigin: number,
  interactionLimit: number,
) {
  const physicalMax = Math.max(0, el.scrollWidth - el.clientWidth);
  return {
    min: Math.max(0, scrollOrigin - interactionLimit),
    max: Math.min(physicalMax, scrollOrigin + interactionLimit),
    physicalMin: 0,
    physicalMax,
  };
}

/**
 * Apple-style horizontal rifle gallery: auto-scrolls slowly, pauses on hover,
 * and accepts smooth wheel / drag for up to 3 rifles before releasing to the page.
 * Vertical scroll-up always passes through so the page can move back up freely.
 */
export function RifleScroller({ rifles }: RifleScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [released, setReleased] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const cardStep = useRef(0);
  const scrollOrigin = useRef(0);
  const targetScroll = useRef(0);
  const smoothFrame = useRef(0);
  const dragging = useRef(false);
  const dragMoved = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const maxManualDelta = useCallback(
    () => cardStep.current * RIFLES_PER_INTERACTION,
    [],
  );

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    cardStep.current = measureCardStep(el);
    targetScroll.current = el.scrollLeft;
  }, []);

  const runSmoothScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    cancelAnimationFrame(smoothFrame.current);
    const tick = () => {
      const diff = targetScroll.current - el.scrollLeft;
      if (Math.abs(diff) < 0.4) {
        el.scrollLeft = targetScroll.current;
        return;
      }
      el.scrollLeft += diff * SMOOTH_EASE;
      smoothFrame.current = requestAnimationFrame(tick);
    };
    smoothFrame.current = requestAnimationFrame(tick);
  }, []);

  const setTargetScroll = useCallback(
    (next: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const bounds = getManualScrollBounds(
        el,
        scrollOrigin.current,
        maxManualDelta(),
      );
      const clamped = clampScroll(
        el,
        Math.min(bounds.max, Math.max(bounds.min, next)),
      );
      targetScroll.current = clamped;
      runSmoothScroll();
    },
    [maxManualDelta, runSmoothScroll],
  );

  const beginHover = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    scrollOrigin.current = el.scrollLeft;
    targetScroll.current = el.scrollLeft;
    setReleased(false);
    setHovered(true);
  }, []);

  const endHover = useCallback(() => {
    setHovered(false);
    setReleased(false);
    dragging.current = false;
    cancelAnimationFrame(smoothFrame.current);
  }, []);

  const tryConsumeDelta = useCallback(
    (delta: number): boolean => {
      const el = scrollerRef.current;
      if (!el || released || cardStep.current <= 0) return false;

      const bounds = getManualScrollBounds(
        el,
        scrollOrigin.current,
        maxManualDelta(),
      );
      const atPhysicalEnd =
        delta > 0 && targetScroll.current >= bounds.physicalMax - 0.5;
      const atPhysicalStart =
        delta < 0 && targetScroll.current <= bounds.physicalMin + 0.5;

      if (atPhysicalEnd || atPhysicalStart) {
        setReleased(true);
        return false;
      }

      const next = targetScroll.current + delta;

      if (next > bounds.max && delta > 0) {
        setTargetScroll(bounds.max);
        setReleased(true);
        return false;
      }
      if (next < bounds.min && delta < 0) {
        setTargetScroll(bounds.min);
        setReleased(true);
        return false;
      }

      setTargetScroll(next);

      if (
        (delta > 0 && targetScroll.current >= bounds.physicalMax - 0.5) ||
        (delta < 0 && targetScroll.current <= bounds.physicalMin + 0.5)
      ) {
        setReleased(true);
      }

      return true;
    },
    [released, maxManualDelta, setTargetScroll],
  );

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

  useEffect(() => {
    measure();
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, rifles.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !canHover || reducedMotion || hovered) return;

    let frame = 0;
    const tick = () => {
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      if (max > 0) {
        el.scrollLeft += AUTO_SCROLL_PX_PER_FRAME;
        if (el.scrollLeft >= max) {
          el.scrollLeft = 0;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [canHover, reducedMotion, hovered, rifles.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (!hovered || released) return;

      const verticalDominant =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX);

      // Scrolling back up — never hijack; let the page move immediately.
      if (verticalDominant && event.deltaY < 0) return;

      const delta = verticalDominant ? event.deltaY : event.deltaX;
      if (delta === 0) return;

      const consumed = tryConsumeDelta(delta * 0.85);
      if (consumed) event.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [hovered, released, tryConsumeDelta]);

  const onPointerDown = (event: React.PointerEvent) => {
    if (!hovered || released) return;
    dragging.current = true;
    dragMoved.current = false;
    dragStartX.current = event.clientX;
    dragStartScroll.current = targetScroll.current;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging.current || released) return;
    const delta = dragStartX.current - event.clientX;
    if (Math.abs(delta) > 3) dragMoved.current = true;

    const el = scrollerRef.current;
    if (!el) return;

    const bounds = getManualScrollBounds(
      el,
      scrollOrigin.current,
      maxManualDelta(),
    );
    const next = clampScroll(
      el,
      Math.min(
        bounds.max,
        Math.max(bounds.min, dragStartScroll.current + delta),
      ),
    );

    const hitLimit =
      next >= bounds.physicalMax ||
      next <= bounds.physicalMin ||
      next >= bounds.max ||
      next <= bounds.min;
    targetScroll.current = next;
    el.scrollLeft = next;

    if (hitLimit) {
      setReleased(true);
      dragging.current = false;
      const target = event.currentTarget as HTMLElement;
      if (target.hasPointerCapture(event.pointerId)) {
        target.releasePointerCapture(event.pointerId);
      }
    }
  };

  const endDrag = (event: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  };

  const onClickCapture = (event: React.MouseEvent) => {
    if (dragMoved.current) {
      event.preventDefault();
      event.stopPropagation();
      dragMoved.current = false;
    }
  };

  return (
    <div
      className="relative mt-8 md:mt-10"
      onMouseEnter={beginHover}
      onMouseLeave={endHover}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--color-black)] to-transparent md:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--color-black)] to-transparent md:w-20"
        aria-hidden
      />

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()}
        className={`flex gap-5 overflow-x-auto px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 md:px-8 [&::-webkit-scrollbar]:hidden ${
          hovered && !released
            ? "cursor-grab active:cursor-grabbing"
            : ""
        }`}
      >
        {rifles.map((rifle, index) => (
          <div
            key={rifle.id}
            className="w-[min(82vw,320px)] shrink-0 md:w-[340px] lg:w-[360px]"
          >
            <RifleCard
              rifle={rifle}
              priority={index < 4}
              compact
            />
          </div>
        ))}
      </div>
    </div>
  );
}
