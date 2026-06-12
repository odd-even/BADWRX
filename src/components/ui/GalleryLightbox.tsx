"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { blurActiveElement, useBodyScrollLock } from "@/lib/modal-body-lock";
import type { RifleImage } from "@/lib/types";

function LightboxArrow({
  direction,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center border border-white/20 bg-black/80 text-white transition hover:border-red hover:text-red sm:h-12 sm:w-12"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "prev" ? (
          <path d="m15 6-6 6 6 6" />
        ) : (
          <path d="m9 6 6 6-6 6" />
        )}
      </svg>
    </button>
  );
}

export interface GalleryLightboxProps {
  images: RifleImage[];
  activeIndex: number;
  title: string;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export function GalleryLightbox({
  images,
  activeIndex,
  title,
  onClose,
  onChangeIndex,
}: GalleryLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const active = images[activeIndex];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  useBodyScrollLock(true);

  const goPrev = useCallback(() => {
    onChangeIndex((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, onChangeIndex]);

  const goNext = useCallback(() => {
    onChangeIndex((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, onChangeIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        blurActiveElement();
        onClose();
      } else if (event.key === "ArrowLeft" && hasMultiple) {
        goPrev();
      } else if (event.key === "ArrowRight" && hasMultiple) {
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, hasMultiple, onClose]);

  if (!active || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex flex-col bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image viewer`}
      onClick={onClose}
    >
      <div
        className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="truncate text-xs uppercase tracking-widest text-white-muted">
          {title}
          {hasMultiple ? (
            <span className="text-white">
              {" "}
              — {activeIndex + 1} / {images.length}
            </span>
          ) : null}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 border border-white/20 px-3 py-2 text-xs uppercase tracking-widest text-white-muted transition hover:border-red hover:text-red"
        >
          Close
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6">
        {hasMultiple ? (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden items-center pl-4 sm:flex sm:pl-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pointer-events-auto">
                <LightboxArrow direction="prev" label="Previous image" onClick={goPrev} />
              </div>
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden items-center pr-4 sm:flex sm:pr-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pointer-events-auto">
                <LightboxArrow direction="next" label="Next image" onClick={goNext} />
              </div>
            </div>
          </>
        ) : null}

        <figure
          className="flex max-w-[min(92vw,1200px)] shrink-0 flex-col items-center"
          onClick={(event) => event.stopPropagation()}
        >
          <img
            key={active.lightboxUrl ?? active.url}
            src={active.lightboxUrl ?? active.url}
            alt={active.alt}
            width={active.width ?? 1200}
            height={active.height ?? 900}
            className="max-h-[min(calc(100dvh-14rem),70dvh)] w-auto max-w-[min(92vw,1200px)] object-contain sm:max-h-[min(calc(100dvh-10rem),min(75dvh,900px))]"
            decoding="async"
          />
          {active.caption ? (
            <figcaption className="mt-4 max-w-2xl text-center text-sm text-white-muted">
              {active.caption}
            </figcaption>
          ) : null}
        </figure>
      </div>

      {hasMultiple ? (
        <div
          className="flex shrink-0 items-center justify-center gap-4 border-t border-white/10 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden"
          onClick={(event) => event.stopPropagation()}
        >
          <LightboxArrow direction="prev" label="Previous image" onClick={goPrev} />
          <LightboxArrow direction="next" label="Next image" onClick={goNext} />
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
