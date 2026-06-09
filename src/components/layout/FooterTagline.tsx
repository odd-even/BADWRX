"use client";

import { useEffect, useRef, useState } from "react";

const LINE_ONE = " for";
const LINE_TWO = "the American patriot";
const CHAR_MS = 42;

export function FooterTagline() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [lineOne, setLineOne] = useState("");
  const [lineTwo, setLineTwo] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setLineOne(LINE_ONE);
      setLineTwo(LINE_TWO);
      return;
    }

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let delay = 0;

    const schedule = (fn: () => void, ms: number) => {
      timeouts.push(setTimeout(fn, ms));
    };

    const typeText = (text: string, setter: (value: string) => void) => {
      for (let index = 0; index < text.length; index += 1) {
        const slice = text.slice(0, index + 1);
        const at = delay;
        schedule(() => {
          if (!cancelled) setter(slice);
        }, at);
        delay += CHAR_MS;
      }
    };

    typeText(LINE_ONE, setLineOne);
    typeText(LINE_TWO, setLineTwo);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [active]);

  const complete = lineOne === LINE_ONE && lineTwo === LINE_TWO;

  return (
    <p
      ref={ref}
      className="font-display mx-auto max-w-7xl px-6 pb-12 pt-10 text-3xl uppercase leading-[0.95] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
      aria-label="Precision rifles for the American patriot"
    >
      <span className="text-red">Precision rifles</span>
      <span className="text-white/30">{lineOne}</span>
      <br />
      <span className="text-white/30">
        {lineTwo}
        {!complete && active && (
          <span className="ml-1 inline-block h-[0.85em] w-[0.08em] translate-y-[0.08em] animate-pulse bg-white/40" />
        )}
      </span>
    </p>
  );
}
