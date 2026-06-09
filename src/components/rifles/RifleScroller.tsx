"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { RifleCard } from "@/components/rifles/RifleCard";
import type { Rifle } from "@/lib/types";

interface RifleScrollerProps {
  rifles: Rifle[];
  showConfigure?: boolean;
}

const SCROLL_SPEED_PX_PER_SEC = 24;

/**
 * Horizontal rifle gallery: CSS-driven auto-scroll (reliable on static/Vercel
 * deploys), pauses on hover for pointer devices, loops seamlessly.
 */
export function RifleScroller({
  rifles,
  showConfigure = true,
}: RifleScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  const pauseForHover = canHover && hovered;
  const loopRifles = [...rifles, ...rifles];

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
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth <= 0) return;

      track.style.setProperty("--rifle-scroll-distance", `${halfWidth}px`);
      track.style.setProperty(
        "--rifle-scroll-duration",
        `${halfWidth / SCROLL_SPEED_PX_PER_SEC}s`,
      );
      setReady(halfWidth > 1);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(track);
    Array.from(track.children).forEach((child) => observer.observe(child));

    document.fonts?.ready.then(update).catch(() => undefined);
    const timers = [100, 500, 1500, 3000].map((delay) =>
      window.setTimeout(update, delay),
    );

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [rifles.length]);

  return (
    <div
      className="relative mt-8 md:mt-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--color-black)] to-transparent md:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--color-black)] to-transparent md:w-20"
        aria-hidden
      />

      <div className="overflow-hidden px-6 md:px-8">
        <div
          ref={trackRef}
          className={`rifle-scroller-track flex w-max items-stretch gap-5 md:gap-6 ${
            ready && !reducedMotion && !pauseForHover ? "" : "is-paused"
          } ${ready && !reducedMotion ? "is-animating" : ""}`}
        >
          {loopRifles.map((rifle, index) => (
            <div
              key={`${rifle.id}-${index}`}
              className="flex w-[min(82vw,320px)] shrink-0 md:w-[340px] lg:w-[360px]"
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
