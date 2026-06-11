"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { blurActiveElement, useBodyScrollLock } from "@/lib/modal-body-lock";
import type { RifleImage } from "@/lib/types";

interface DetailImageGalleryProps {
  images: RifleImage[];
  title: string;
  /** Main preview aspect ratio — rifles use landscape, merch uses square */
  aspect?: "square" | "landscape";
}

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

function ImageLightbox({
  images,
  activeIndex,
  title,
  onClose,
  onChangeIndex,
}: {
  images: RifleImage[];
  activeIndex: number;
  title: string;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}) {
  const active = images[activeIndex];
  const hasMultiple = images.length > 1;

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

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[250] flex flex-col bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image viewer`}
      onClick={onClose}
    >
      <div
        className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6"
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

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        {hasMultiple ? (
          <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2 sm:left-6">
            <LightboxArrow direction="prev" label="Previous image" onClick={goPrev} />
          </div>
        ) : null}

        <figure className="flex max-h-full max-w-full flex-col items-center">
          <div className="relative h-[min(72vh,900px)] w-[min(92vw,1200px)]">
            <Image
              key={active.url}
              src={active.url}
              alt={active.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          {active.caption ? (
            <figcaption className="mt-4 max-w-2xl text-center text-sm text-white-muted">
              {active.caption}
            </figcaption>
          ) : null}
        </figure>

        {hasMultiple ? (
          <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2 sm:right-6">
            <LightboxArrow direction="next" label="Next image" onClick={goNext} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

const aspectClass = {
  square: "aspect-square",
  landscape: "aspect-[4/3]",
} as const;

export function DetailImageGallery({
  images,
  title,
  aspect = "landscape",
}: DetailImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className={`radius-ui group relative w-full overflow-hidden border border-white/10 bg-black-light text-left ${aspectClass[aspect]}`}
          aria-label={`Open ${title} image ${activeIndex + 1} in full screen`}
        >
          <Image
            key={active.url}
            src={active.url}
            alt={active.alt}
            fill
            priority
            className="object-contain transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <span
            className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center border border-white/20 bg-black/75 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h6v6" />
              <path d="m21 3-7 7" />
              <path d="m3 21 7-7" />
              <path d="M9 21H3v-6" />
            </svg>
          </span>
        </button>

        {active.caption ? (
          <p className="text-sm text-white-muted">{active.caption}</p>
        ) : null}

        {images.length > 1 ? (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {images.map((image, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onDoubleClick={() => {
                    setActiveIndex(index);
                    setLightboxOpen(true);
                  }}
                  className={`radius-ui relative aspect-square overflow-hidden border bg-black-light transition ${
                    selected
                      ? "border-red"
                      : "border-white/10 hover:border-white/30"
                  }`}
                  aria-label={`View ${title} image ${index + 1}`}
                  aria-pressed={selected}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-contain object-center p-1"
                    sizes="96px"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {lightboxOpen ? (
        <ImageLightbox
          images={images}
          activeIndex={activeIndex}
          title={title}
          onClose={() => setLightboxOpen(false)}
          onChangeIndex={setActiveIndex}
        />
      ) : null}
    </>
  );
}
