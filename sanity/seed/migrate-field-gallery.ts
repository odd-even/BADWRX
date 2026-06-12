/**
 * Re-upload optimized WebP field gallery assets to Sanity.
 *
 * Run:
 *   npm run sync:images          # generate WebP from /gallery sources
 *   npm run seed:sanity:field-gallery
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import {
  buildFieldGalleryFileList,
  fieldGallerySeedFiles,
} from "../../src/data/field-gallery";
import { defaultSiteSettings } from "../../src/data/site-settings";
import { FIELD_GALLERY_SETTINGS_DOCUMENT_ID } from "../schemaTypes/fieldGallerySettings";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const galleryWebpDir = path.join(root, "public", "images", "gallery");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "\nMissing env vars. Create .env.local with:\n" +
      "  NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id\n" +
      "  NEXT_PUBLIC_SANITY_DATASET=production\n" +
      "  SANITY_API_TOKEN=your_editor_token\n",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function imageRef(assetId: string, alt: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
    alt,
  };
}

async function uploadGalleryWebp(webpFilename: string) {
  const filePath = path.join(galleryWebpDir, webpFilename);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Optimized gallery WebP not found: ${filePath}. Run npm run sync:images first.`,
    );
  }
  const buffer = fs.readFileSync(filePath);
  console.log(`  Uploading ${webpFilename}...`);
  return client.assets.upload("image", buffer, {
    filename: webpFilename,
    contentType: "image/webp",
  });
}

async function main() {
  console.log("→ Optimizing gallery sources to WebP...");
  execSync("node scripts/optimize-gallery.mjs", { cwd: root, stdio: "inherit" });

  const assetBySource = new Map<string, string>();
  for (const item of fieldGallerySeedFiles()) {
    const asset = await uploadGalleryWebp(item.file);
    assetBySource.set(item.sourceFile, asset._id);
  }

  const gallery = buildFieldGalleryFileList().map((item, index) => ({
    ...imageRef(assetBySource.get(item.file)!, item.alt),
    _key: `field-gallery-${index}`,
  }));

  await client.createOrReplace({
    _id: FIELD_GALLERY_SETTINGS_DOCUMENT_ID,
    _type: "fieldGallerySettings",
    section: defaultSiteSettings.fieldGallerySection,
    images: gallery,
  });

  console.log(
    `✓ Reprocessed From the Field gallery (${gallery.length} WebP photos in Sanity)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
