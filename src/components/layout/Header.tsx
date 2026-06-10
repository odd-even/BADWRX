"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { images } from "@/lib/images";
import { brand } from "@/lib/brand";
import { MerchCartLink } from "@/components/merch/MerchCartLink";
import { useMerchCart } from "@/components/merch/CartProvider";
import type { NavLink } from "@/lib/pages";
import { headerNavLinks } from "@/lib/pages";
import type { NavImageFadeSettings } from "@/lib/nav-image-fade";
import {
  navFadeGradient,
  navFadePanelHeight,
  navFadeUsesLargePanel,
  resolveNavImageFade,
} from "@/lib/nav-image-fade";

const defaultNavLinks = headerNavLinks();

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

/** md–lg viewports: tighter header so full nav fits before mobile menu */
function useCompactHeader() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return compact;
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

function ctaRevealStyle(progress: number, gap: number): CSSProperties {
  return {
    opacity: progress,
    maxWidth: `${lerp(0, 210, progress)}px`,
    marginLeft: `${lerp(0, gap, progress)}px`,
    overflow: "hidden",
    pointerEvents: progress > 0.05 ? "auto" : "none",
  };
}

const ctaClassName =
  "block whitespace-nowrap border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white transition-[background-color,border-color] duration-200 active:scale-[0.98] lg:px-5 lg:py-2 lg:text-xs lg:tracking-widest";

interface HeaderProps {
  navLinks?: NavLink[];
  showConfigureCta?: boolean;
  showMerchCart?: boolean;
  navImageFade?: NavImageFadeSettings;
}

export function Header({
  navLinks = defaultNavLinks,
  showConfigureCta = true,
  showMerchCart = true,
  navImageFade,
}: HeaderProps) {
  const progress = useScrollProgress();
  const compact = useCompactHeader();
  const scrolled = progress > 0.02;
  const pathname = usePathname();
  const { itemCount } = useMerchCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const onConfigure = pathname === "/configure";
  const fadeOpacity = resolveNavImageFade(pathname, navImageFade);
  const largeFadePanel = navFadeUsesLargePanel(pathname);
  const midFadeOpacity = compact
    ? fadeOpacity.midOpacityMobile
    : fadeOpacity.midOpacityDesktop;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const padY = lerp(compact ? 16 : 22, compact ? 10 : 12, progress);
  // Gunworks wordmark ~375×105 — scale width with larger resting logo
  const logoRestWidth = compact ? 200 : 270;
  const logoRestHeight = compact ? 44 : 56;
  const logoWidth = lerp(logoRestWidth, 56, progress);
  const logoHeight = lerp(logoRestHeight, 48, progress);
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
  const ctaGap = compact ? 12 : 32;

  return (
    <header
      className={`fixed top-0 w-full will-change-[padding,background-color,box-shadow] ${
        menuOpen ? "z-[110]" : "z-50"
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
      {/* Top fade — keeps nav readable over hero imagery on every page */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10"
        style={{
          height: navFadePanelHeight(compact, largeFadePanel),
          opacity: menuOpen ? 0 : 1 - progress,
          background: navFadeGradient(fadeOpacity, midFadeOpacity),
        }}
        aria-hidden
      />

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
              src={images.logos.headerLogo}
              alt={`${brand.short} — ${brand.name}`}
              width={375}
              height={105}
              priority
              className="h-9 w-auto max-w-none md:h-10 lg:h-12"
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
              className="h-9 w-auto max-w-none md:h-10 lg:h-11"
            />
          </div>
        </Link>

        <div
          className="header-nav ml-auto hidden items-center gap-3 md:flex lg:gap-8 will-change-[transform,opacity]"
          style={{
            opacity: navOpacity,
            transform: `translateY(${navY}px)`,
          }}
        >
          <nav className="flex items-center gap-3 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-xs uppercase tracking-wide text-white/80 transition-[color,text-decoration-color,letter-spacing] duration-200 hover:text-white hover:underline hover:decoration-red hover:underline-offset-[0.35em] lg:text-sm lg:tracking-widest"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {showConfigureCta ? (
            <span
              className="inline-flex shrink-0"
              style={ctaRevealStyle(progress, ctaGap)}
              aria-hidden={progress <= 0.05}
            >
              <Link
                href="/configure"
                className={ctaClassName}
                style={ctaButtonStyle()}
                tabIndex={progress > 0.05 ? 0 : -1}
              >
                Configure Rifle
              </Link>
            </span>
          ) : null}
          {showMerchCart ? <MerchCartLink /> : null}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          {showMerchCart ? <MerchCartLink /> : null}
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

      {mounted
        ? createPortal(
            <div
              id="mobile-nav"
              className={`fixed inset-0 z-[100] md:hidden ${
                menuOpen
                  ? "visible pointer-events-auto"
                  : "invisible pointer-events-none"
              }`}
              aria-hidden={!menuOpen}
              inert={!menuOpen ? true : undefined}
            >
              <button
                type="button"
                className="absolute inset-0 bg-[#080a07]"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                tabIndex={menuOpen ? 0 : -1}
              />
              <nav className="relative z-[1] flex h-full flex-col justify-center gap-2 px-8 pb-24 pt-28">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    tabIndex={menuOpen ? 0 : -1}
                    aria-hidden={!menuOpen}
                    className={`border-b border-white/5 py-4 text-lg uppercase tracking-widest transition-[color,text-decoration-color] ${
                      pathname === link.href
                        ? "text-red"
                        : "text-white/80 hover:text-white hover:underline hover:decoration-red hover:underline-offset-[0.35em]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {itemCount > 0 && !onConfigure && showMerchCart ? (
                  <Link
                    href="/merch/cart"
                    onClick={() => setMenuOpen(false)}
                    tabIndex={menuOpen ? 0 : -1}
                    aria-hidden={!menuOpen}
                    className={`border-b border-white/5 py-4 text-lg uppercase tracking-widest transition-[color,text-decoration-color] ${
                      pathname === "/merch/cart"
                        ? "text-red"
                        : "text-white/80 hover:text-white hover:underline hover:decoration-red hover:underline-offset-[0.35em]"
                    }`}
                  >
                    Merch cart ({itemCount})
                  </Link>
                ) : null}
                {showConfigureCta ? (
                  <Link
                    href="/configure"
                    onClick={() => setMenuOpen(false)}
                    tabIndex={menuOpen ? 0 : -1}
                    aria-hidden={!menuOpen}
                    className="mt-6 block w-full border px-6 py-4 text-center text-lg font-semibold uppercase tracking-widest text-white transition-[background-color,border-color] duration-200 active:scale-[0.98]"
                    style={ctaButtonStyle()}
                  >
                    Configure Rifle
                  </Link>
                ) : null}
              </nav>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
