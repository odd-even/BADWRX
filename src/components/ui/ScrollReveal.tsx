"use client";

import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { observeScrollReveal } from "@/lib/scroll-reveal";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
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

    if (delay > 0) {
      el.style.setProperty("--scroll-reveal-delay", `${delay}ms`);
    }

    return observeScrollReveal(el);
  }, [delay]);

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
