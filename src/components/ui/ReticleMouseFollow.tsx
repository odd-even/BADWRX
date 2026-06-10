"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { images } from "@/lib/images";

const MAX_MOUSE_OFFSET_PX = 52;
const MAX_SCROLL_OFFSET_PX = 38;
const LERP = 0.07;

const baseClassName =
  "pointer-events-none absolute will-change-transform";

type ReticleMouseFollowProps = {
  className?: string;
  sizes?: string;
  src?: string;
  alt?: string;
};

export function ReticleMouseFollow({
  className = "top-[16%] left-[68%] aspect-square w-[80vw] min-w-[80vw] opacity-70 mix-blend-screen",
  sizes = "80vw",
  src = images.rifle.reticleOverlay,
  alt = "",
}: ReticleMouseFollowProps = {}) {
  const reticleRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const motionEnabledRef = useRef(true);
  const mouseEnabledRef = useRef(true);

  useEffect(() => {
    const reticle = reticleRef.current;
    const section = reticle?.closest("section");
    if (!reticle || !section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const applyTransform = () => {
      const { x, y } = currentRef.current;
      reticle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    };

    const syncTarget = () => {
      if (!motionEnabledRef.current) {
        targetRef.current = { x: 0, y: 0 };
        return;
      }

      targetRef.current = {
        x: mouseRef.current.x + scrollRef.current.x,
        y: mouseRef.current.y + scrollRef.current.y,
      };
    };

    const tick = () => {
      const target = targetRef.current;
      const current = currentRef.current;

      const dx = target.x - current.x;
      const dy = target.y - current.y;

      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        current.x = target.x;
        current.y = target.y;
        applyTransform();
        frameRef.current = null;
        return;
      }

      current.x += dx * LERP;
      current.y += dy * LERP;

      applyTransform();
      frameRef.current = requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(tick);
    };

    const stopAnimation = () => {
      if (frameRef.current === null) return;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };

    const updateScrollOffset = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.bottom < 0 || rect.top > viewportHeight) {
        scrollRef.current = { x: 0, y: 0 };
        return;
      }

      const centerDelta =
        (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;

      scrollRef.current = {
        x: centerDelta * MAX_SCROLL_OFFSET_PX * 0.4,
        y: centerDelta * MAX_SCROLL_OFFSET_PX,
      };
    };

    const handleScroll = () => {
      if (!motionEnabledRef.current) return;
      updateScrollOffset();
      syncTarget();
      startAnimation();
    };

    const handleMove = (event: MouseEvent) => {
      if (!mouseEnabledRef.current) return;

      const rect = section.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      mouseRef.current = {
        x: x * MAX_MOUSE_OFFSET_PX,
        y: y * MAX_MOUSE_OFFSET_PX,
      };
      syncTarget();
      startAnimation();
    };

    const handleLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
      syncTarget();
      if (motionEnabledRef.current) startAnimation();
    };

    const sync = () => {
      motionEnabledRef.current = !motionQuery.matches;
      mouseEnabledRef.current =
        motionEnabledRef.current && hoverQuery.matches;

      if (!motionEnabledRef.current) {
        mouseRef.current = { x: 0, y: 0 };
        scrollRef.current = { x: 0, y: 0 };
        targetRef.current = { x: 0, y: 0 };
        currentRef.current = { x: 0, y: 0 };
        applyTransform();
        stopAnimation();
        return;
      }

      if (!mouseEnabledRef.current) {
        mouseRef.current = { x: 0, y: 0 };
      }

      updateScrollOffset();
      syncTarget();
      startAnimation();
    };

    sync();
    handleScroll();

    motionQuery.addEventListener("change", sync);
    hoverQuery.addEventListener("change", sync);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseleave", handleLeave);

    return () => {
      stopAnimation();
      motionQuery.removeEventListener("change", sync);
      hoverQuery.removeEventListener("change", sync);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={reticleRef}
      className={`${baseClassName} ${className}`}
      style={{
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes={sizes}
      />
    </div>
  );
}
