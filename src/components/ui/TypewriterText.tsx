"use client";

import { useEffect, useMemo, useState } from "react";

const HOLD_MS = 2800;
const FADE_MS = 600;

interface TypewriterTextProps {
  phrases: string[];
  prefix?: string;
  className?: string;
  as?: "h1" | "p" | "span";
}

export function TypewriterText({
  phrases,
  prefix = "",
  className,
  as: Tag = "span",
}: TypewriterTextProps) {
  const list = useMemo(
    () => (phrases.length > 0 ? phrases : ["without compromise"]),
    [phrases],
  );
  const longestSuffix = useMemo(
    () =>
      list.reduce(
        (longest, phrase) => (phrase.length > longest.length ? phrase : longest),
        "",
      ),
    [list],
  );

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || list.length <= 1) return;

    let fadeTimeout: ReturnType<typeof setTimeout>;

    const interval = setInterval(() => {
      setVisible(false);
      fadeTimeout = setTimeout(() => {
        setPhraseIndex((current) => (current + 1) % list.length);
        setVisible(true);
      }, FADE_MS);
    }, HOLD_MS + FADE_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimeout);
    };
  }, [reducedMotion, list]);

  const suffix = reducedMotion ? list[0] : (list[phraseIndex] ?? list[0]);

  return (
    <Tag className={className} aria-live="polite" aria-atomic="true">
      {prefix ? <span>{prefix}</span> : null}
      <span className="relative inline-block">
        <span aria-hidden="true" className="invisible">
          {longestSuffix}
        </span>
        <span
          className={`hero-suffix absolute inset-0 ${visible ? "hero-suffix-visible" : "hero-suffix-hidden"}`}
        >
          {suffix}
        </span>
      </span>
    </Tag>
  );
}
