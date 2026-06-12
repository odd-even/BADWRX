/** Match `scripts/optimize-gallery.mjs` and `src/sanity/lib/image.ts` gallery presets. */
export const GALLERY_WEBP_MAX_WIDTH = 1920;
export const GALLERY_WEBP_THUMB_QUALITY = 0.8;
export const GALLERY_WEBP_FULL_QUALITY = 0.85;

function stripExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

export function galleryWebpFilename(originalName: string): string {
  return `${stripExtension(originalName)}.webp`;
}

/** Browser-side resize + WebP encode before uploading to Sanity. */
export async function fileToGalleryWebpBlob(
  file: File,
  maxWidth = GALLERY_WEBP_MAX_WIDTH,
  quality = GALLERY_WEBP_FULL_QUALITY,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Could not prepare image for WebP conversion.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });

  if (!blob) {
    throw new Error(`WebP conversion failed for ${file.name}.`);
  }

  return blob;
}
