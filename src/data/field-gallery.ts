import { images } from "@/lib/images";

/** Original uploads in repo `/gallery` — optimized to WebP at build. */
export const FIELD_GALLERY_SOURCE_FILES = [
  "IMG_0261.jpeg",
  "IMG_4159.jpeg",
  "IMG_4265.jpeg",
  "IMG_4217.jpeg",
  "IMG_4569.jpeg",
  "IMG_5717.jpeg",
  "IMG_1157.jpeg",
  "IMG_1096.jpeg",
] as const;

export const FIELD_GALLERY_TARGET_COUNT = 30;

export const FIELD_GALLERY_ALT = "BADWRX field photography";

/** Intrinsic dimensions of `/gallery` sources — drives masonry tile heights. */
export const FIELD_GALLERY_DIMENSIONS: Record<
  (typeof FIELD_GALLERY_SOURCE_FILES)[number],
  { width: number; height: number }
> = {
  "IMG_0261.jpeg": { width: 4032, height: 3024 },
  "IMG_4159.jpeg": { width: 4032, height: 3024 },
  "IMG_4265.jpeg": { width: 4032, height: 3024 },
  "IMG_4217.jpeg": { width: 4032, height: 3024 },
  "IMG_4569.jpeg": { width: 4032, height: 3024 },
  "IMG_5717.jpeg": { width: 1170, height: 2532 },
  "IMG_1157.jpeg": { width: 5712, height: 4284 },
  "IMG_1096.jpeg": { width: 4032, height: 3024 },
};

/** Responsive thumb widths — keep in sync with `scripts/optimize-gallery.mjs`. */
export const FIELD_GALLERY_THUMB_WIDTHS = [320, 480, 640, 800, 960] as const;

export const FIELD_GALLERY_FULL_WIDTH = 1920;

export function fieldGalleryStem(filename: string): string {
  return filename.replace(/\.(jpe?g|png|webp)$/i, "");
}

export function fieldGalleryWebpFilename(
  sourceFile: string,
  width: number,
): string {
  return `${fieldGalleryStem(sourceFile)}-${width}.webp`;
}

export function fieldGalleryLocalImage(sourceFile: string) {
  const stem = fieldGalleryStem(sourceFile);
  const base = images.gallery;
  const url = `${base}/${stem}-640.webp`;
  const srcSet = FIELD_GALLERY_THUMB_WIDTHS.map(
    (width) => `${base}/${stem}-${width}.webp ${width}w`,
  ).join(", ");
  const lightboxUrl = `${base}/${stem}-${FIELD_GALLERY_FULL_WIDTH}.webp`;
  const dimensions =
    FIELD_GALLERY_DIMENSIONS[
      sourceFile as (typeof FIELD_GALLERY_SOURCE_FILES)[number]
    ];

  return {
    file: sourceFile,
    url,
    srcSet,
    lightboxUrl,
    alt: FIELD_GALLERY_ALT,
    ...(dimensions ?? {}),
  };
}

const FIELD_GALLERY_PORTRAIT = "IMG_5717.jpeg";

/**
 * Masonry-friendly order: spread the portrait tile through the list so mobile
 * and multi-column layouts get mixed heights instead of uniform 4:3 bands.
 * Stable across builds — not random per request.
 */
export function buildFieldGallerySourceOrder(
  count = FIELD_GALLERY_TARGET_COUNT,
): (typeof FIELD_GALLERY_SOURCE_FILES)[number][] {
  const landscapes = FIELD_GALLERY_SOURCE_FILES.filter(
    (file) => file !== FIELD_GALLERY_PORTRAIT,
  );
  const order: (typeof FIELD_GALLERY_SOURCE_FILES)[number][] = [];
  let landscapeIndex = 0;

  for (let i = 0; i < count; i += 1) {
    // Portrait every 5th slot (0, 5, 10, …) rotates across columns on desktop.
    if (i % 5 === 0) {
      order.push(FIELD_GALLERY_PORTRAIT);
      continue;
    }

    let file = landscapes[landscapeIndex % landscapes.length];
    landscapeIndex += 1;

    // Avoid back-to-back duplicates when the cycle wraps.
    const previous = order[order.length - 1];
    if (file === previous) {
      file = landscapes[landscapeIndex % landscapes.length];
      landscapeIndex += 1;
    }

    order.push(file);
  }

  return order;
}

export function buildFieldGalleryFileList(count = FIELD_GALLERY_TARGET_COUNT) {
  return buildFieldGallerySourceOrder(count).map((sourceFile) =>
    fieldGalleryLocalImage(sourceFile),
  );
}

/** Sanity seed uploads the full-size WebP variant for each unique source photo. */
export function fieldGallerySeedFiles() {
  return FIELD_GALLERY_SOURCE_FILES.map((file) => ({
    file: fieldGalleryWebpFilename(file, FIELD_GALLERY_FULL_WIDTH),
    alt: FIELD_GALLERY_ALT,
    sourceFile: file,
  }));
}
