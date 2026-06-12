import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { optimizeGallery } from "./optimize-gallery.mjs";

const DISPLAY_FONT_NAME = "display-bold.otf";
const FONT_EXTENSIONS = /\.(otf|ttf|woff2?)$/i;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = join(root, "public", "images");
const fontsDir = join(root, "public", "fonts");

const EXCLUDED_PHOTO_FILES = new Set([
  "cadini-di-misurina-in-darkness-illuminated-by-sunl-2025-01-10-03-08-57-utc.jpeg",
  "mountain-panorama-just-after-the-storm-2025-01-15-14-24-51-utc.jpg",
]);

const mappings = [
  { name: "assets", src: join(root, "_assets", "photos") },
  { name: "logos", src: join(root, "_assets", "logos", "SVG") },
  { name: "configurator", src: join(root, "_assets", "configurator") },
  { name: "merch", src: join(root, "_assets", "merch") },
];

mkdirSync(imagesDir, { recursive: true });
mkdirSync(fontsDir, { recursive: true });

const fontsSrc = join(root, "_assets", "fonts");
if (existsSync(fontsSrc)) {
  const sourceFonts = readdirSync(fontsSrc)
    .filter(
      (file) =>
        FONT_EXTENSIONS.test(file) && file.toLowerCase() !== DISPLAY_FONT_NAME,
    )
    .map((file) => ({
      file,
      mtimeMs: statSync(join(fontsSrc, file)).mtimeMs,
    }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  rmSync(fontsDir, { recursive: true, force: true });
  mkdirSync(fontsDir, { recursive: true });

  if (sourceFonts.length > 0) {
    const latest = sourceFonts[0];
    cpSync(join(fontsSrc, latest.file), join(fontsDir, DISPLAY_FONT_NAME));
    console.log(`Synced public/fonts/${DISPLAY_FONT_NAME} from ${latest.file}`);
  } else {
    console.warn("Skipping fonts: no .otf/.ttf files found in", fontsSrc);
  }
} else {
  console.warn("Skipping fonts: source not found at", fontsSrc);
}

for (const { name, src } of mappings) {
  if (!existsSync(src)) {
    console.warn(`Skipping ${name}: source not found at ${src}`);
    continue;
  }

  const dest = join(imagesDir, name);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });

  if (name === "assets") {
    for (const file of readdirSync(src)) {
      if (EXCLUDED_PHOTO_FILES.has(file)) {
        console.warn(`Skipping excluded photo: ${file}`);
        continue;
      }
      cpSync(join(src, file), join(dest, file));
    }
  } else {
    cpSync(src, dest, { recursive: true });
  }

  console.log(`Synced public/images/${name}`);
}

await optimizeGallery({
  srcDir: join(root, "gallery"),
  destDir: join(imagesDir, "gallery"),
  logPrefix: "",
});
console.log("Synced public/images/gallery (WebP)");
