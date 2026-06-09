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

const DISPLAY_FONT_NAME = "display-bold.otf";
const FONT_EXTENSIONS = /\.(otf|ttf|woff2?)$/i;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = join(root, "public", "images");
const fontsDir = join(root, "public", "fonts");

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
  cpSync(src, dest, { recursive: true });
  console.log(`Synced public/images/${name}`);
}
