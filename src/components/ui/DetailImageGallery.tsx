"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import type { RifleImage } from "@/lib/types";

interface DetailImageGalleryProps {
  images: RifleImage[];
  title: string;
  /** Main preview aspect ratio — rifles use landscape, merch uses square */
  aspect?: "square" | "landscape";
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
        <GalleryLightbox
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
