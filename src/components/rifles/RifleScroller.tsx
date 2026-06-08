"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RifleCard } from "@/components/rifles/RifleCard";
import type { Rifle } from "@/lib/types";

interface RifleScrollerProps {
  rifles: Rifle[];
}

/** Matches fixed header offset used on the home hero (`pt-[72px]`). */
const HEADER_OFFSET_PX = 72;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Home-page rifle showcase.
 * On desktop the section pins and the cards translate horizontally as the page
 * scrolls down; horizontal trackpad swipes and click-drag are mapped to page
 * scroll so the same motion can be driven manually. On small screens it falls
 * back to a native, touch-friendly horizontal carousel.
 */
export function RifleScroller({ rifles }: RifleScrollerProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [enabled, setEnabled] = useState(false);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [pinHeight, setPinHeight] = useState(0);
  const [offset, setOffset] = useState(0);

  const dragging = useRef(false);
  const dragMoved = useRef(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;
    setMaxTranslate(Math.max(0, track.scrollWidth - pin.clientWidth));
    setPinHeight(pin.offsetHeight);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const apply = () => setEnabled(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setOffset(0);
      setMaxTranslate(0);
      setPinHeight(0);
      return;
    }

    measure();
    window.addEventListener("resize", measure);

    const track = trackRef.current;
    const pin = pinRef.current;
    const observer =
      track && pin
        ? new ResizeObserver(() => measure())
        : null;
    observer?.observe(track!);
    observer?.observe(pin!);

    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [enabled, measure, rifles.length]);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const update = () => {
      const section = sectionRef.current;
      if (!section || maxTranslate <= 0) return;
      const start = section.offsetTop - HEADER_OFFSET_PX;
      const progress = clamp((window.scrollY - start) / maxTranslate, 0, 1);
      setOffset(progress * maxTranslate);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled, maxTranslate]);

  useEffect(() => {
    if (!enabled) return;
    const pin = pinRef.current;
    if (!pin) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      const section = sectionRef.current;
      if (!section || maxTranslate <= 0) return;
      const start = section.offsetTop - HEADER_OFFSET_PX;
      const progress = clamp((window.scrollY - start) / maxTranslate, 0, 1);
      const atStart = progress <= 0 && event.deltaX < 0;
      const atEnd = progress >= 1 && event.deltaX > 0;
      if (atStart || atEnd) return;
      event.preventDefault();
      window.scrollBy({ top: event.deltaX });
    };
    pin.addEventListener("wheel", onWheel, { passive: false });
    return () => pin.removeEventListener("wheel", onWheel);
  }, [enabled, maxTranslate]);

  const onPointerDown = (event: React.PointerEvent) => {
    if (!enabled) return;
    dragging.current = true;
    dragMoved.current = false;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!enabled || !dragging.current) return;
    if (Math.abs(event.movementX) > 2) dragMoved.current = true;
    window.scrollBy({ top: -event.movementX });
  };

  const endDrag = (event: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const el = event.currentTarget as HTMLElement;
    if (el.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
  };

  const onClickCapture = (event: React.MouseEvent) => {
    if (dragMoved.current) {
      event.preventDefault();
      event.stopPropagation();
      dragMoved.current = false;
    }
  };

  const cards = rifles.map((rifle, index) => (
    <div
      key={rifle.id}
      className="w-[min(88vw,340px)] shrink-0 snap-start md:w-[360px] lg:w-[380px]"
    >
      <RifleCard rifle={rifle} priority={index === 0} compact />
    </div>
  ));

  if (!enabled) {
    return (
      <div className="mt-10 md:mt-12">
        <div className="mx-auto flex max-w-7xl snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden">
          {cards}
        </div>
      </div>
    );
  }

  const scrollRunway =
    pinHeight > 0 && maxTranslate > 0 ? pinHeight + maxTranslate : undefined;

  return (
    <div
      ref={sectionRef}
      className="relative mt-10 md:mt-12"
      style={scrollRunway ? { height: scrollRunway } : { minHeight: 420 }}
    >
      <div
        ref={pinRef}
        className="sticky overflow-hidden py-6 md:py-8"
        style={{ top: HEADER_OFFSET_PX }}
      >
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          onDragStart={(event) => event.preventDefault()}
          className="flex cursor-grab select-none gap-5 px-6 will-change-transform active:cursor-grabbing md:gap-6"
          style={{ transform: `translate3d(${-offset}px, 0, 0)` }}
        >
          {cards}
        </div>
      </div>
    </div>
  );
}
