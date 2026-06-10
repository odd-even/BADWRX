"use client";

import { useState } from "react";
import Image from "next/image";

interface OptionImageProps {
  url: string;
  alt: string;
  label: string;
  variant?: "banner" | "swatch" | "swatch-fill";
}

export function OptionImage({
  url,
  alt,
  label,
  variant = "banner",
}: OptionImageProps) {
  const [missing, setMissing] = useState(false);
  const isSwatch = variant === "swatch" || variant === "swatch-fill";
  const isSwatchFill = variant === "swatch-fill";

  if (missing) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 border border-dashed border-white/20 bg-black-light text-center ${
          isSwatchFill
            ? "aspect-square w-full"
            : isSwatch
              ? "h-[4.5rem] w-[4.5rem] shrink-0"
              : "aspect-[2/1] gap-2 p-4"
        }`}
      >
        {!isSwatch && (
          <p className="text-xs uppercase tracking-widest text-white-muted">
            Photo
          </p>
        )}
        {!isSwatch && (
          <p className="text-xs text-white-muted/70">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-black-light hover-zoom ${
        isSwatchFill
          ? "aspect-square w-full"
          : isSwatch
            ? "h-[4.5rem] w-[4.5rem] shrink-0"
            : "aspect-[2/1]"
      }`}
    >
      <Image
        src={url}
        alt={alt}
        fill
        className="object-cover"
        sizes={
          isSwatchFill
            ? "(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 240px"
            : isSwatch
              ? "96px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        }
        onError={() => setMissing(true)}
      />
    </div>
  );
}
