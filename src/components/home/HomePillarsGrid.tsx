"use client";

import { useEffect, useRef, useState } from "react";

interface Pillar {
  title: string;
  body: string;
}

interface HomePillarsGridProps {
  pillars: Pillar[];
}

export function HomePillarsGrid({ pillars }: HomePillarsGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={gridRef}
      className={`home-pillars-grid mt-12 grid gap-8 md:mt-16 md:grid-cols-3 ${
        inView ? "is-in-view" : ""
      }`}
    >
      {pillars.map((pillar) => (
        <div
          key={pillar.title}
          className="home-pillar-card border border-white/10 bg-black-light p-8"
        >
          <p className="text-xs uppercase tracking-widest text-red">
            {pillar.title}
          </p>
          <p className="mt-4 text-sm text-white-muted leading-relaxed">
            {pillar.body}
          </p>
        </div>
      ))}
    </div>
  );
}
