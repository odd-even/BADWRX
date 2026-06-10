"use client";

import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
}

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px 0px -6% 0px",
};

let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver() {
  if (typeof window === "undefined") return null;

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        sharedObserver?.unobserve(entry.target);
      }
    }, OBSERVER_OPTIONS);
  }

  return sharedObserver;
}

export function ScrollReveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    const observer = getSharedObserver();
    if (!observer) {
      el.classList.add("is-visible");
      return;
    }

    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  const style: CSSProperties | undefined =
    delay > 0
      ? ({ "--scroll-reveal-delay": `${delay}ms` } as CSSProperties)
      : undefined;

  return createElement(
    Tag,
    {
      ref,
      className: `scroll-reveal ${className}`.trim(),
      style,
    },
    children,
  );
}
