"use client";

import { useEffect, useMemo, useState } from "react";

const HOLD_MS = 2800;
const FADE_MS = 600;

export type TypewriterPhrase = string | string[];

interface TypewriterTextProps {
  phrases: TypewriterPhrase[];
  highlights?: string[];
  prefix?: string;
  className?: string;
  as?: "h1" | "p" | "span";
}

function normalizePhrase(phrase: TypewriterPhrase): string[] {
  return Array.isArray(phrase) ? phrase : [phrase];
}

function highlightPhrase(phrase: string, highlights: string[]) {
  for (const highlight of highlights) {
    const index = phrase.toLowerCase().indexOf(highlight.toLowerCase());
    if (index === -1) continue;

    return (
      <>
        {phrase.slice(0, index)}
        <span className="text-red">{phrase.slice(index, index + highlight.length)}</span>
        {phrase.slice(index + highlight.length)}
      </>
    );
  }

  return phrase;
}

function renderPhraseLines(lines: string[], highlights: string[]) {
  return lines.map((line, index) => (
    <span key={`${line}-${index}`} className="hero-headline-line block">
      {highlightPhrase(line, highlights)}
    </span>
  ));
}

export function TypewriterText({
  phrases,
  highlights = [],
  prefix = "",
  className,
  as: Tag = "span",
}: TypewriterTextProps) {
  const list = useMemo(
    () =>
      (phrases.length > 0 ? phrases : ["without compromise"]).map(normalizePhrase),
    [phrases],
  );

  const lineCount = useMemo(
    () => list.reduce((max, lines) => Math.max(max, lines.length), 1),
    [list],
  );

  const phantomLines = useMemo(
    () =>
      Array.from({ length: lineCount }, (_, lineIndex) =>
        list.reduce((longest, lines) => {
          const line = lines[lineIndex] ?? "";
          return line.length > longest.length ? line : longest;
        }, ""),
      ),
    [list, lineCount],
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

  const activeLines = reducedMotion ? list[0] : (list[phraseIndex] ?? list[0]);

  return (
    <Tag className={className} aria-live="polite" aria-atomic="true">
      {prefix ? <span className="block">{prefix}</span> : null}
      <span className="relative block">
        <span aria-hidden="true" className="invisible block">
          {phantomLines.map((line, index) => (
            <span key={`phantom-${index}`} className="hero-headline-line block">
              {line || "\u00A0"}
            </span>
          ))}
        </span>
        <span
          className={`hero-suffix absolute inset-0 block ${visible ? "hero-suffix-visible" : "hero-suffix-hidden"}`}
        >
          {renderPhraseLines(activeLines, highlights)}
        </span>
      </span>
    </Tag>
  );
}
