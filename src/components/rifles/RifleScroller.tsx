"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RifleCard } from "@/components/rifles/RifleCard";
import type { Rifle } from "@/lib/types";

interface RifleScrollerProps {
  rifles: Rifle[];
  showConfigure?: boolean;
}

const SCROLL_SPEED_PX_PER_SEC = 32;
const USER_SCROLL_PAUSE_MS = 2500;
const DRAG_THRESHOLD_PX = 6;
const HOVER_WHEEL_CARD_COUNT = 3;

function maxScrollLeft(scrollEl: HTMLDivElement) {
  return Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
}

function clampScroll(scrollEl: HTMLDivElement) {
  const max = maxScrollLeft(scrollEl);
  scrollEl.scrollLeft = Math.min(Math.max(scrollEl.scrollLeft, 0), max);
  return max;
}

function measureCardStep(scrollEl: HTMLDivElement) {
  const card = scrollEl.querySelector("[data-rifle-card]");
  if (!(card instanceof HTMLElement)) return 320;

  const track = card.parentElement;
  if (!track) return card.offsetWidth;

  const gapValue = getComputedStyle(track).gap || "0";
  const gap = Number.parseFloat(gapValue) || 0;
  return card.offsetWidth + gap;
}

/**
 * Idle auto-scroll when the pointer is away; vertical page scroll over the
 * carousel moves ~3 cards horizontally, then releases back to the page.
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
    pointerId: -1,
  });
  const userPausedRef = useRef(false);
  const userPausedTimerRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const hoveringScrollerRef = useRef(false);
  const draggingRef = useRef(false);
  const autoDirectionRef = useRef(1);
  const wheelBudgetRef = useRef({ downPx: 0, upPx: 0 });

  const [hoveringScroller, setHoveringScroller] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);

  const autoScrollEnabled = ready && !reducedMotion;

  hoveringScrollerRef.current = hoveringScroller;
  draggingRef.current = dragging;

  const pauseForUser = useCallback(() => {
    userPausedRef.current = true;
    if (userPausedTimerRef.current !== null) {
      window.clearTimeout(userPausedTimerRef.current);
    }
    userPausedTimerRef.current = window.setTimeout(() => {
      userPausedRef.current = false;
      userPausedTimerRef.current = null;
    }, USER_SCROLL_PAUSE_MS);
  }, []);

  const resetWheelBudget = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const budget = measureCardStep(scrollEl) * HOVER_WHEEL_CARD_COUNT;
    wheelBudgetRef.current = { downPx: budget, upPx: budget };
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(motionQuery.matches);
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const update = () => {
      setReady(scrollEl.scrollWidth > scrollEl.clientWidth);
      if (hoveringScrollerRef.current) resetWheelBudget();
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
  }, [resetWheelBudget, rifles.length]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const onScroll = () => {
      clampScroll(scrollEl);
    };

    const onWheel = (event: WheelEvent) => {
      const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const shiftHorizontal = event.shiftKey && event.deltaY !== 0;

      if (horizontalIntent || shiftHorizontal) {
        if (!hoveringScrollerRef.current) return;

        const delta = horizontalIntent ? event.deltaX : event.deltaY;
        if (delta === 0) return;

        event.preventDefault();
        scrollEl.scrollLeft = Math.min(
          Math.max(scrollEl.scrollLeft + delta, 0),
          maxScrollLeft(scrollEl),
        );
        pauseForUser();
        return;
      }

      if (!hoveringScrollerRef.current || event.deltaY === 0) return;

      const max = maxScrollLeft(scrollEl);
      const budget = wheelBudgetRef.current;

      if (event.deltaY > 0) {
        if (budget.downPx <= 0 || scrollEl.scrollLeft >= max - 1) return;

        const room = max - scrollEl.scrollLeft;
        const apply = Math.min(event.deltaY, budget.downPx, room);
        if (apply <= 0) return;

        event.preventDefault();
        scrollEl.scrollLeft += apply;
        budget.downPx -= apply;
        pauseForUser();
        return;
      }

      if (budget.upPx <= 0 || scrollEl.scrollLeft <= 0) return;

      const apply = Math.min(Math.abs(event.deltaY), budget.upPx, scrollEl.scrollLeft);
      if (apply <= 0) return;

      event.preventDefault();
      scrollEl.scrollLeft -= apply;
      budget.upPx -= apply;
      pauseForUser();
    };

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    scrollEl.addEventListener("wheel", onWheel, { passive: false });
    scrollEl.addEventListener("touchstart", pauseForUser, { passive: true });

    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      scrollEl.removeEventListener("wheel", onWheel);
      scrollEl.removeEventListener("touchstart", pauseForUser);
    };
  }, [pauseForUser, rifles.length]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl || !autoScrollEnabled) return;

    let frame = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const deltaSeconds = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const shouldAutoScroll =
        !hoveringScrollerRef.current &&
        !draggingRef.current &&
        !userPausedRef.current &&
        scrollEl.scrollWidth > scrollEl.clientWidth;

      if (shouldAutoScroll) {
        const max = maxScrollLeft(scrollEl);
        let next =
          scrollEl.scrollLeft +
          SCROLL_SPEED_PX_PER_SEC * deltaSeconds * autoDirectionRef.current;

        if (next >= max) {
          next = max;
          autoDirectionRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          autoDirectionRef.current = 1;
        }

        scrollEl.scrollLeft = next;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      if (userPausedTimerRef.current !== null) {
        window.clearTimeout(userPausedTimerRef.current);
        userPausedTimerRef.current = null;
      }
    };
  }, [autoScrollEnabled, rifles.length]);

  function handleScrollerEnter() {
    hoveringScrollerRef.current = true;
    setHoveringScroller(true);
    resetWheelBudget();
  }

  function handleScrollerLeave() {
    hoveringScrollerRef.current = false;
    setHoveringScroller(false);
  }

  function finishDrag(pointerId: number) {
    const scrollEl = scrollRef.current;
    const drag = dragRef.current;
    if (!scrollEl || !drag.active) return;

    const didDrag = drag.moved;
    drag.active = false;
    drag.moved = false;
    drag.pointerId = -1;
    setDragging(false);

    if (scrollEl.hasPointerCapture(pointerId)) {
      scrollEl.releasePointerCapture(pointerId);
    }

    clampScroll(scrollEl);

    if (didDrag) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
      pauseForUser();
    }
  }

  function handlePointerDownCapture(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const pointerId = event.pointerId;
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: scrollEl.scrollLeft,
      pointerId,
    };
    scrollEl.setPointerCapture(pointerId);

    const onWindowPointerEnd = (endEvent: PointerEvent) => {
      if (endEvent.pointerId !== pointerId) return;
      finishDrag(pointerId);
      window.removeEventListener("pointerup", onWindowPointerEnd);
      window.removeEventListener("pointercancel", onWindowPointerEnd);
    };

    window.addEventListener("pointerup", onWindowPointerEnd);
    window.addEventListener("pointercancel", onWindowPointerEnd);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const scrollEl = scrollRef.current;
    const drag = dragRef.current;
    if (!scrollEl || !drag.active || event.pointerId !== drag.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;

    if (!drag.moved) {
      drag.moved = true;
      setDragging(true);
      pauseForUser();
    }

    event.preventDefault();
    scrollEl.scrollLeft = Math.min(
      Math.max(drag.scrollLeft - deltaX, 0),
      maxScrollLeft(scrollEl),
    );
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    finishDrag(event.pointerId);
  }

  function handleClickCapture(event: React.MouseEvent) {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
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
          dragging ? "cursor-grabbing select-none" : ""
        } overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] max-md:snap-x max-md:snap-mandatory md:snap-none [&::-webkit-scrollbar]:hidden`}
        onMouseEnter={handleScrollerEnter}
        onMouseLeave={handleScrollerLeave}
        onPointerDownCapture={handlePointerDownCapture}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
      >
        <div className="flex w-max items-stretch gap-5 md:gap-6">
          {rifles.map((rifle, index) => (
            <div
              key={rifle.id}
              data-rifle-card
              className={cardWrapperClass}
            >
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
