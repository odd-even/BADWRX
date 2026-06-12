"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import { observeScrollReveal, prefersReducedMotion } from "@/lib/scroll-reveal";
import type { RifleImage } from "@/lib/types";

interface FieldGallerySection {
  eyebrow: string;
  title: string;
  body?: string;
}

interface FieldMasonryGalleryProps {
  section: FieldGallerySection;
  images: RifleImage[];
}

const masonrySizes =
  "(max-width: 500px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw";

const SINGLE_COLUMN_MAX_WIDTH = 500;
const TWO_COLUMN_MAX_WIDTH = 767;

const GALLERY_INITIAL = {
  single: 5,
  twoColumn: 10,
} as const;

const GALLERY_BATCH = {
  single: 5,
  twoColumn: 10,
} as const;

type GalleryLayout = "single" | "twoColumn" | "multi";

function resolveGalleryLayout(width: number): GalleryLayout {
  if (width <= SINGLE_COLUMN_MAX_WIDTH) return "single";
  if (width <= TWO_COLUMN_MAX_WIDTH) return "twoColumn";
  return "multi";
}

function initialVisibleCount(layout: GalleryLayout, total: number): number {
  if (layout === "multi") return total;
  return Math.min(GALLERY_INITIAL[layout], total);
}

const REVEAL_ROOT_MARGIN = "0px 0px -8% 0px";
const REVEAL_THRESHOLD = 0.12;
const LOAD_ROOT_MARGIN = "280px 0px";

function GalleryTile({
  image,
  index,
  galleryLabel,
  onOpen,
}: {
  image: RifleImage;
  index: number;
  galleryLabel: string;
  onOpen: () => void;
}) {
  const tileRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const width = image.width ?? 4;
  const height = image.height ?? 3;
  const staggerMs = (index % 4) * 90;

  useEffect(() => {
    const tile = tileRef.current;
    const reveal = revealRef.current;
    if (!tile || !reveal) return;

    reveal.style.setProperty("--scroll-reveal-delay", `${staggerMs}ms`);

    if (prefersReducedMotion()) {
      reveal.classList.add("scroll-reveal", "is-visible");
      setLoaded(true);
      return;
    }

    reveal.classList.add("scroll-reveal");

    const revealAndLoad = () => {
      reveal.classList.add("is-visible");
      setLoaded(true);
    };

    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        revealAndLoad();
        revealObserver.disconnect();
        loadObserver.disconnect();
      },
      { rootMargin: REVEAL_ROOT_MARGIN, threshold: REVEAL_THRESHOLD },
    );

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setLoaded(true);
        loadObserver.disconnect();
      },
      { rootMargin: LOAD_ROOT_MARGIN, threshold: 0.01 },
    );

    revealObserver.observe(tile);
    loadObserver.observe(tile);

    requestAnimationFrame(() => {
      if (reveal.classList.contains("is-visible")) return;
      const rect = tile.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < viewportHeight * 0.92 && rect.bottom > 0) {
        revealAndLoad();
        revealObserver.disconnect();
        loadObserver.disconnect();
      }
    });

    return () => {
      revealObserver.disconnect();
      loadObserver.disconnect();
    };
  }, [staggerMs]);

  return (
    <div ref={tileRef} className="mb-3 break-inside-avoid sm:mb-4">
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full overflow-hidden border border-white/10 bg-black-light text-left transition hover:border-white/30"
        aria-label={`View ${galleryLabel} photo ${index + 1}`}
      >
        <div ref={revealRef} className="overflow-hidden">
          {loaded ? (
            image.srcSet ? (
              <img
                src={image.url}
                srcSet={image.srcSet}
                sizes={masonrySizes}
                alt={image.alt}
                width={width}
                height={height}
                decoding="async"
                className="gallery-tile-image block h-auto w-full"
              />
            ) : (
              <Image
                src={image.url}
                alt={image.alt}
                width={width}
                height={height}
                sizes={masonrySizes}
                className="gallery-tile-image block h-auto w-full"
              />
            )
          ) : (
            <div
              aria-hidden
              className="w-full bg-black-muted"
              style={{ aspectRatio: `${width} / ${height}` }}
            />
          )}
        </div>
      </button>
    </div>
  );
}

function GalleryIntro({ section }: { section: FieldGallerySection }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observeScrollReveal(node);
  }, []);

  return (
    <div ref={ref} className="scroll-reveal">
      <p className="text-xs uppercase tracking-widest text-red">{section.eyebrow}</p>
      {section.title ? (
        <h2 className="mt-2 text-4xl text-white">{section.title}</h2>
      ) : null}
      {section.body ? (
        <p className="mt-4 max-w-2xl text-white-muted leading-relaxed">{section.body}</p>
      ) : null}
    </div>
  );
}

export function FieldMasonryGallery({ section, images }: FieldMasonryGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [layout, setLayout] = useState<GalleryLayout>("single");
  const [visibleCount, setVisibleCount] = useState(() =>
    initialVisibleCount("single", images.length),
  );
  const layoutRef = useRef<GalleryLayout>("single");
  const galleryLabel = section.title || section.eyebrow || "Photo gallery";

  useLayoutEffect(() => {
    const update = () => {
      const nextLayout = resolveGalleryLayout(window.innerWidth);
      const prevLayout = layoutRef.current;

      setLayout(nextLayout);
      setVisibleCount((count) => {
        const nextInitial = initialVisibleCount(nextLayout, images.length);
        if (nextLayout === "multi") return images.length;
        if (prevLayout === nextLayout && count > nextInitial) {
          return Math.min(count, images.length);
        }
        return nextInitial;
      });

      layoutRef.current = nextLayout;
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [images.length]);

  if (!images.length) return null;

  const visibleImages =
    layout === "multi" ? images : images.slice(0, visibleCount);
  const showLoadMore = layout !== "multi" && visibleCount < images.length;
  const batchSize = layout === "multi" ? 0 : GALLERY_BATCH[layout];
  const remainingCount = images.length - visibleCount;

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-24">
        <GalleryIntro section={section} />

        <div className="mt-10 columns-1 gap-3 min-[501px]:columns-2 min-[768px]:columns-3 min-[768px]:gap-4 min-[1280px]:columns-4">
          {visibleImages.map((image, index) => (
            <GalleryTile
              key={`${image.url}-${index}`}
              image={image}
              index={index}
              galleryLabel={galleryLabel}
              onOpen={() => setLightboxIndex(index)}
            />
          ))}
        </div>

        {showLoadMore ? (
          <div className="mt-8 flex justify-center min-[768px]:hidden">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + batchSize, images.length),
                )
              }
              className="border border-white/20 px-8 py-3 text-xs uppercase tracking-widest text-white-muted transition hover:border-red hover:text-red"
            >
              Load more
              <span className="sr-only">
                {" "}
                — {Math.min(batchSize, remainingCount)} more photos
              </span>
            </button>
          </div>
        ) : null}
      </div>

      {lightboxIndex !== null ? (
        <GalleryLightbox
          images={images}
          activeIndex={lightboxIndex}
          title={galleryLabel}
          onClose={() => setLightboxIndex(null)}
          onChangeIndex={setLightboxIndex}
        />
      ) : null}
    </>
  );
}
