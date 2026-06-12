import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/** Match Sanity CDN gallery presets in `src/sanity/lib/image.ts`. */
export const GALLERY_THUMB_WIDTHS = [320, 480, 640, 800, 960];
export const GALLERY_FULL_WIDTH = 1920;

const THUMB_QUALITY = 80;
const FULL_QUALITY = 85;

const SOURCE_PATTERN = /\.(jpe?g|png|webp)$/i;

/**
 * Convert `/gallery` source photos into responsive WebP assets in `public/images/gallery`.
 */
export async function optimizeGallery({
  srcDir,
  destDir,
  logPrefix = "",
}) {
  if (!existsSync(srcDir)) {
    console.warn(`${logPrefix}Skipping gallery optimize: source not found at ${srcDir}`);
    return;
  }

  rmSync(destDir, { recursive: true, force: true });
  mkdirSync(destDir, { recursive: true });

  const sources = readdirSync(srcDir)
    .filter((file) => SOURCE_PATTERN.test(file))
    .sort();

  if (sources.length === 0) {
    console.warn(`${logPrefix}No gallery sources found in ${srcDir}`);
    return;
  }

  let totalOutputs = 0;

  for (const file of sources) {
    const inputPath = join(srcDir, file);
    const stem = parse(file).name;
    const metadata = await sharp(inputPath).metadata();
    const sourceWidth = metadata.width ?? GALLERY_FULL_WIDTH;

    const widths = [
      ...GALLERY_THUMB_WIDTHS,
      GALLERY_FULL_WIDTH,
    ];

    for (const width of widths) {
      if (width > sourceWidth && width !== GALLERY_FULL_WIDTH) continue;

      const targetWidth = Math.min(width, sourceWidth);
      const outName = `${stem}-${width}.webp`;
      const quality = width >= GALLERY_FULL_WIDTH ? FULL_QUALITY : THUMB_QUALITY;

      await sharp(inputPath)
        .rotate()
        .resize({
          width: targetWidth,
          withoutEnlargement: true,
        })
        .webp({ quality, effort: 4 })
        .toFile(join(destDir, outName));

      totalOutputs += 1;
    }

    console.log(`${logPrefix}  ${file} -> WebP (${sourceWidth}px source)`);
  }

  console.log(
    `${logPrefix}Optimized ${sources.length} gallery photo(s) into ${totalOutputs} WebP file(s)`,
  );
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  await optimizeGallery({
    srcDir: join(root, "gallery"),
    destDir: join(root, "public", "images", "gallery"),
  });
}
