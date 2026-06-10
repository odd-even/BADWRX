"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RifleCard } from "@/components/rifles/RifleCard";
import type { Rifle } from "@/lib/types";

interface RifleScrollerProps {
  rifles: Rifle[];
  showConfigure?: boolean;
  showPricing?: boolean;
}

const DRAG_THRESHOLD_PX = 6;
/** Higher = more vertical scroll needed to traverse the full card row. */
const DESKTOP_PAGE_SCROLL_HORIZONTAL_RATIO = 0.19;
const MOBILE_PAGE_SCROLL_HORIZONTAL_RATIO = 0.095;
const MOBILE_BREAKPOINT_PX = 767;
const MANUAL_CONTROL_PAUSE_MS = 2500;

function pageScrollHorizontalRatio() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches
    ? MOBILE_PAGE_SCROLL_HORIZONTAL_RATIO
    : DESKTOP_PAGE_SCROLL_HORIZONTAL_RATIO;
}

function maxScrollLeft(scrollEl: HTMLDivElement) {
  return Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
}

function clampScrollLeft(scrollEl: HTMLDivElement, value: number) {
  return Math.min(Math.max(value, 0), maxScrollLeft(scrollEl));
}

function isInteractivePointerTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return !!target.closest("a, button, input, textarea, select, label, [role='button']");
}

/**
 * Full viewport-width track; cards align to page margins at scroll ends.
 * Vertical page scroll drives horizontal movement via viewport progress.
 */
export function RifleScroller({
  rifles,
  showConfigure = true,
  showPricing = true,
}: RifleScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: -1,
  });
  const suppressClickRef = useRef(false);
  const draggingRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const manualControlUntilRef = useRef(0);
  const pageLinkRafRef = useRef(0);

  const [dragging, setDragging] = useState(false);

  draggingRef.current = dragging;

  const pausePageLinkage = useCallback((ms = MANUAL_CONTROL_PAUSE_MS) => {
    manualControlUntilRef.current = Date.now() + ms;
  }, []);

  const applyMarginInsets = useCallback(() => {
    const scrollEl = scrollRef.current;
    const trackEl = trackRef.current;
    if (!scrollEl || !trackEl) return;

    const alignEl = scrollEl.closest("[data-rifle-scroller-align]");
    if (!alignEl) return;

    const rect = alignEl.getBoundingClientRect();
    const styles = window.getComputedStyle(alignEl);
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(styles.paddingRight) || 0;

    // Use the content box — border-box rect ignores inner px-* on full-width containers.
    const left = Math.round(rect.left + paddingLeft);
    const right = Math.round(
      window.innerWidth - rect.right + paddingRight,
    );

    trackEl.style.paddingLeft = `${left}px`;
    trackEl.style.paddingRight = `${right}px`;
  }, []);

  const updatePageLinkedScroll = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl || reducedMotionRef.current || draggingRef.current) return;
    if (Date.now() < manualControlUntilRef.current) return;

    const max = maxScrollLeft(scrollEl);
    if (max <= 0) return;

    const rect = scrollEl.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom <= 0 || rect.top >= vh) return;

    const startY = vh * 0.82;
    const verticalTravel = (vh * 0.55) / pageScrollHorizontalRatio();
    const progress = Math.min(1, Math.max(0, (startY - rect.top) / verticalTravel));

    scrollEl.scrollLeft = progress * max;
  }, []);

  const schedulePageLinkedScroll = useCallback(() => {
    cancelAnimationFrame(pageLinkRafRef.current);
    pageLinkRafRef.current = requestAnimationFrame(updatePageLinkedScroll);
  }, [updatePageLinkedScroll]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reducedMotionRef.current = motionQuery.matches;
    };
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    applyMarginInsets();
    scrollEl.scrollLeft = 0;
    schedulePageLinkedScroll();
  }, [rifles.length, applyMarginInsets, schedulePageLinkedScroll]);

  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    const trackEl = trackRef.current;
    const alignEl = scrollEl?.closest("[data-rifle-scroller-align]");
    if (!scrollEl || !alignEl) return;

    const onResize = () => {
      applyMarginInsets();
      scrollEl.scrollLeft = clampScrollLeft(scrollEl, scrollEl.scrollLeft);
      schedulePageLinkedScroll();
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(alignEl);
    if (trackEl) observer.observe(trackEl);
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [applyMarginInsets, schedulePageLinkedScroll]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const onWindowScroll = () => {
      schedulePageLinkedScroll();
    };

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    schedulePageLinkedScroll();

    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      cancelAnimationFrame(pageLinkRafRef.current);
    };
  }, [rifles.length, schedulePageLinkedScroll]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const onWheel = (event: WheelEvent) => {
      const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const shiftHorizontal = event.shiftKey && event.deltaY !== 0;
      if (!horizontalIntent && !shiftHorizontal) return;

      const delta = horizontalIntent ? event.deltaX : event.deltaY;
      if (delta === 0) return;

      event.preventDefault();
      pausePageLinkage();
      scrollEl.scrollLeft = clampScrollLeft(scrollEl, scrollEl.scrollLeft + delta);
    };

    scrollEl.addEventListener("wheel", onWheel, { passive: false });
    return () => scrollEl.removeEventListener("wheel", onWheel);
  }, [pausePageLinkage, rifles.length]);

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

    scrollEl.scrollLeft = clampScrollLeft(scrollEl, scrollEl.scrollLeft);

    if (didDrag) {
      pausePageLinkage();
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }

  function handlePointerDownCapture(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    if (isInteractivePointerTarget(event.target)) return;

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
      pausePageLinkage();
    }

    event.preventDefault();
    scrollEl.scrollLeft = clampScrollLeft(
      scrollEl,
      drag.scrollLeft - deltaX,
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
    "flex w-[min(82vw,320px)] shrink-0 md:w-[340px] lg:w-[360px]";

  return (
    <div className="relative left-1/2 mt-8 w-screen max-w-[100vw] -translate-x-1/2 md:mt-10">
      <div
        ref={scrollRef}
        className={`w-full cursor-grab overscroll-x-contain active:cursor-grabbing ${
          dragging ? "cursor-grabbing select-none" : ""
        } overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden`}
        onPointerDownCapture={handlePointerDownCapture}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
      >
        <div
          ref={trackRef}
          className="flex w-max items-stretch gap-5 md:gap-6"
        >
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
                showPricing={showPricing}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
