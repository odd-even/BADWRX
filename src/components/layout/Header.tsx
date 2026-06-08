"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { images } from "@/lib/images";
import { brand } from "@/lib/brand";
import { MerchCartLink } from "@/components/merch/MerchCartLink";

const navLinks = [
  { href: "/builds", label: "Builds" },
  { href: "/configure", label: "Configure" },
  { href: "/merch", label: "Merch" },
  { href: "/university", label: "University" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Scroll distance (px) over which the header fully transitions */
const SCROLL_RANGE = 120;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Smooth deceleration — feels more natural on settle */
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const raw = clamp(window.scrollY / SCROLL_RANGE, 0, 1);
      setProgress(easeOutQuart(raw));
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
  }, []);

  return progress;
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function ctaButtonStyle(): CSSProperties {
  return {
    backgroundColor: "rgb(210, 34, 38)",
    borderColor: "rgb(210, 34, 38)",
  };
}

function ctaRevealStyle(progress: number, maxWidth: number): CSSProperties {
  return {
    maxWidth: lerp(0, maxWidth, progress),
    opacity: progress,
    overflow: "hidden",
    pointerEvents: progress > 0.05 ? "auto" : "none",
  };
}

const ctaClassName =
  "block whitespace-nowrap border px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-[background-color,border-color] duration-200 active:scale-[0.98]";

export function Header() {
  const progress = useScrollProgress();
  const scrolled = progress > 0.02;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const padY = lerp(22, 12, progress);
  // Full-name SVG ~365×95 — scale width with larger resting logo
  const logoWidth = lerp(270, 60, progress);
  const logoHeight = lerp(56, 48, progress);
  const bgOpacity = lerp(0, 0.95, progress);
  const borderOpacity = lerp(0, 0.1, progress);
  const blur = lerp(0, 16, progress);
  const shadowOpacity = lerp(0, 0.45, progress);

  const fullOpacity = 1 - progress;
  const fullY = lerp(0, -14, progress);
  const fullScale = lerp(1, 0.9, progress);
  const fullBlur = lerp(0, 6, progress);

  const stackOpacity = progress;
  const stackY = lerp(8, 0, progress);
  const stackScale = lerp(0.88, 1, progress);
  const stackBlur = lerp(3, 0, progress);

  const navY = lerp(6, 0, progress);
  const navOpacity = lerp(0.72, 1, progress);

  return (
    <header
      className={`fixed top-0 w-full will-change-[padding,background-color,box-shadow] ${
        menuOpen ? "z-[60]" : "z-50"
      }`}
      style={{
        paddingTop: padY,
        paddingBottom: padY,
        backgroundColor: menuOpen
          ? "rgba(8, 10, 7, 0.98)"
          : `rgba(8, 10, 7, ${bgOpacity})`,
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: `rgba(255, 255, 255, ${borderOpacity})`,
        backdropFilter: blur > 0.5 ? `blur(${blur}px)` : undefined,
        WebkitBackdropFilter: blur > 0.5 ? `blur(${blur}px)` : undefined,
        boxShadow:
          shadowOpacity > 0.01
            ? `0 8px 32px rgba(0, 0, 0, ${shadowOpacity})`
            : "none",
      }}
    >
      {/* Accent line — draws in on scroll */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-px bg-black will-change-[width,opacity]"
        style={{
          width: `${progress * 100}%`,
          opacity: lerp(0, 0.85, progress),
        }}
        aria-hidden
      />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="relative block shrink-0 overflow-visible will-change-[width]"
          style={{ width: logoWidth, height: logoHeight, minWidth: progress > 0.85 ? 60 : undefined }}
        >
          {/* Full name logo */}
          <div
            className="absolute left-0 top-1/2 flex items-center will-change-[transform,opacity,filter]"
            style={{
              opacity: fullOpacity,
              transform: `translateY(calc(-50% + ${fullY}px)) scale(${fullScale})`,
              transformOrigin: "left center",
              filter: fullBlur > 0.1 ? `blur(${fullBlur}px)` : undefined,
              pointerEvents: scrolled ? "none" : "auto",
            }}
          >
            <Image
              src={images.logos.fullName}
              alt={`${brand.short} — ${brand.name}`}
              width={270}
              height={70}
              priority
              className="h-11 w-auto max-w-none md:h-12"
            />
          </div>

          {/* Stack logo */}
          <div
            className="absolute left-0 top-1/2 flex items-center will-change-[transform,opacity,filter]"
            style={{
              opacity: stackOpacity,
              transform: `translateY(calc(-50% + ${stackY}px)) scale(${stackScale})`,
              transformOrigin: "left center",
              filter: stackBlur > 0.1 ? `blur(${stackBlur}px)` : undefined,
              pointerEvents: scrolled ? "auto" : "none",
            }}
          >
            <Image
              src={images.logos.stack}
              alt={brand.short}
              width={56}
              height={45}
              priority
              className="h-10 w-auto max-w-none md:h-11"
            />
          </div>
        </Link>

        <nav
          className="ml-auto hidden items-center gap-8 md:flex will-change-[transform,opacity]"
          style={{
            opacity: navOpacity,
            transform: `translateY(${navY}px)`,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-widest text-white-muted transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <span
            className="inline-flex shrink-0"
            style={ctaRevealStyle(progress, 140)}
            aria-hidden={progress <= 0.05}
          >
            <Link
              href="/configure"
              className={ctaClassName}
              style={ctaButtonStyle()}
              tabIndex={progress > 0.05 ? 0 : -1}
            >
              Build Rifle
            </Link>
          </span>
        </nav>

        <div className="flex items-center gap-2 md:ml-6">
          <MerchCartLink />
          <button
            type="button"
            className={`relative z-[61] flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 md:hidden ${
              menuOpen ? "pointer-events-auto" : ""
            }`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block h-px w-6 bg-white transition-transform duration-200 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-white transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-white transition-transform duration-200 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-[55] md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        } transition-opacity duration-300`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black-light"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
        />
        <nav className="pointer-events-none relative flex h-full flex-col justify-center gap-2 px-8 pb-24 pt-28">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`pointer-events-auto border-b border-white/5 py-4 text-lg uppercase tracking-widest transition-colors ${
                pathname === link.href
                  ? "text-red"
                  : "text-white-muted hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/merch/cart"
            onClick={() => setMenuOpen(false)}
            className={`pointer-events-auto border-b border-white/5 py-4 text-lg uppercase tracking-widest transition-colors ${
              pathname === "/merch/cart"
                ? "text-red"
                : "text-white-muted hover:text-white"
            }`}
          >
            Cart
          </Link>
          <Link
            href="/configure"
            onClick={() => setMenuOpen(false)}
            className={`${ctaClassName} pointer-events-auto mt-6 w-full py-4 text-center`}
            style={ctaButtonStyle()}
          >
            Build Yours
          </Link>
        </nav>
      </div>
    </header>
  );
}
