"use client";

import { useEffect, useRef, useState } from "react";
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
  "(max-width: 500px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw";

const MOBILE_GALLERY_MAX_WIDTH = 500;
const MOBILE_GALLERY_INITIAL = 5;
const MOBILE_GALLERY_BATCH = 5;

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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(MOBILE_GALLERY_INITIAL);
  const galleryLabel = section.title || section.eyebrow || "Photo gallery";

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_GALLERY_MAX_WIDTH}px)`);
    const update = () => {
      setIsMobile(mq.matches);
      if (!mq.matches) {
        setMobileVisibleCount(MOBILE_GALLERY_INITIAL);
      }
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!images.length) return null;

  const visibleImages = isMobile ? images.slice(0, mobileVisibleCount) : images;
  const showLoadMore = isMobile && mobileVisibleCount < images.length;
  const remainingCount = images.length - mobileVisibleCount;

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-24">
        <GalleryIntro section={section} />

        <div className="mt-10 columns-1 gap-3 min-[501px]:columns-2 min-[1024px]:columns-3 min-[1024px]:gap-4 lg:columns-4">
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
          <div className="mt-8 flex justify-center min-[501px]:hidden">
            <button
              type="button"
              onClick={() =>
                setMobileVisibleCount((count) =>
                  Math.min(count + MOBILE_GALLERY_BATCH, images.length),
                )
              }
              className="border border-white/20 px-8 py-3 text-xs uppercase tracking-widest text-white-muted transition hover:border-red hover:text-red"
            >
              Load more
              <span className="sr-only">
                {" "}
                — {Math.min(MOBILE_GALLERY_BATCH, remainingCount)} more photos
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
