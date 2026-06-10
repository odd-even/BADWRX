import type { RifleImage } from "@/lib/types";

/** Default sizes for full-bleed heroes — scales with viewport and DPR via srcSet. */
export const HERO_IMAGE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1536px) 100vw, 100vw";

/** Full-width section backgrounds (e.g. home ballistic band). */
export const SECTION_IMAGE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 100vw";

interface SanityResponsiveImageProps {
  image: Pick<RifleImage, "url" | "alt" | "srcSet">;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

/**
 * Responsive hero/section image using Sanity CDN srcSet when available.
 * Falls back to a single URL for static placeholder assets.
 */
export function SanityResponsiveImage({
  image,
  sizes = HERO_IMAGE_SIZES,
  priority = false,
  className = "absolute inset-0",
  imgClassName = "h-full w-full object-cover",
}: SanityResponsiveImageProps) {
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Sanity srcSet for viewport-aware CDN delivery */}
      <img
        src={image.url}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        alt={image.alt}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        className={imgClassName}
      />
    </div>
  );
}
