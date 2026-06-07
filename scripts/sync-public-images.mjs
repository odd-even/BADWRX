import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = join(root, "public", "images");

const mappings = [
  { name: "assets", src: join(root, "_assets", "photos") },
  { name: "logos", src: join(root, "_assets", "logos", "SVG") },
  { name: "configurator", src: join(root, "_assets", "configurator") },
  { name: "placeholders", src: join(root, "_assets", "placeholder images") },
];

mkdirSync(imagesDir, { recursive: true });

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
