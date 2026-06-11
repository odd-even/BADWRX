"use client";

import { useState } from "react";
import Image from "next/image";
import type { RifleImage } from "@/lib/types";

interface MerchImageGalleryProps {
  images: RifleImage[];
  title: string;
}

export function MerchImageGallery({ images, title }: MerchImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden border border-white/10 bg-black-light">
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt}
          fill
          priority
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((image, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square overflow-hidden border bg-black-light transition ${
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
  );
}
