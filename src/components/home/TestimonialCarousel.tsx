"use client";

import { useEffect, useState } from "react";

export interface Testimonial {
  quote: string;
  author: string;
}

interface TestimonialCarouselProps {
  items: Testimonial[];
  intervalMs?: number;
}

export function TestimonialCarousel({
  items,
  intervalMs = 6000,
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (hovered || reduceMotion || items.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [hovered, reduceMotion, items.length, intervalMs]);

  if (items.length === 0) return null;

  const active = items[index];
  const hasMultiple = items.length > 1;

  const goPrev = () => {
    setIndex((current) => (current - 1 + items.length) % items.length);
  };

  const goNext = () => {
    setIndex((current) => (current + 1) % items.length);
  };

  const arrowClass = `absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/80 text-white transition hover:border-red hover:text-red md:h-11 md:w-11 ${
    hovered
      ? "pointer-events-auto opacity-100"
      : "pointer-events-none opacity-0"
  }`;

  return (
    <div
      className="group relative mx-auto max-w-7xl px-6 py-24"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p className="text-center text-xs uppercase tracking-widest text-red">
        From the field
      </p>

      <div className="relative mt-8 flex items-center">
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonial"
              className={`${arrowClass} left-0`}
            >
              <span aria-hidden className="text-lg leading-none">
                ←
              </span>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className={`${arrowClass} right-0`}
            >
              <span aria-hidden className="text-lg leading-none">
                →
              </span>
            </button>
          </>
        )}

        <div className="mx-auto w-full max-w-4xl text-center">
          <div className="relative min-h-[10rem] md:min-h-[8rem]">
            {items.map((item, itemIndex) => (
              <blockquote
                key={`${item.author}-${itemIndex}`}
                className={`text-xl leading-relaxed text-white transition-opacity duration-700 ease-in-out md:text-2xl ${
                  itemIndex === index
                    ? "relative opacity-100"
                    : "pointer-events-none absolute inset-x-0 top-0 opacity-0"
                }`}
                aria-hidden={itemIndex !== index}
              >
                &ldquo;{item.quote}&rdquo;
              </blockquote>
            ))}
          </div>

          <p
            key={active.author}
            className="mt-8 text-sm uppercase tracking-widest text-white-muted transition-opacity duration-500"
          >
            — {active.author}
          </p>
        </div>
      </div>

      {hasMultiple && (
        <div
          className="mt-10 flex items-center justify-center gap-2.5"
          role="tablist"
          aria-label="Testimonials"
        >
          {items.map((item, itemIndex) => {
            const isActive = itemIndex === index;
            return (
              <button
                key={`dot-${item.author}-${itemIndex}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show testimonial from ${item.author}`}
                onClick={() => setIndex(itemIndex)}
                className={`h-2 w-2 rounded-full transition ${
                  isActive
                    ? "scale-110 bg-red"
                    : "bg-white/25 hover:bg-white/45"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
