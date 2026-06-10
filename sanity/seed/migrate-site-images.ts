/**
 * Upload local `_assets/photos` into Site Settings → Photos in Sanity.
 *
 * By default only fills fields that do not already have an image asset.
 * Pass --force to replace every site photo from repo files.
 *
 * Run: npm run seed:sanity:images
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  defaultSiteImageFiles,
  defaultSiteImages,
} from "../../src/data/site-settings";
import type { SiteImages } from "../../src/lib/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const photosDir = path.join(__dirname, "../../_assets/photos");

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

const forceReplace = process.argv.includes("--force");

type SiteImageKey = keyof SiteImages;

function imageRef(assetId: string, alt: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
    alt,
  };
}

async function uploadPhoto(filename: string) {
  const filePath = path.join(photosDir, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Photo not found: ${filePath}`);
  }
  const buffer = fs.readFileSync(filePath);
  console.log(`  Uploading ${filename}...`);
  return client.assets.upload("image", buffer, { filename });
}

export async function migrateSiteImages(options?: { force?: boolean }) {
  const force = options?.force ?? forceReplace;

  const existing = await client.fetch<
    { siteImages?: Partial<Record<SiteImageKey, { asset?: { _id?: string } }>> } | null
  >(
    `*[_id == "siteSettings"][0]{
      siteImages {
        reticleOverlay { asset->{ _id } },
        homeHeroBanner { asset->{ _id } },
        homeFieldTested { asset->{ _id } },
        homeBallisticSection { asset->{ _id } },
        aboutHeroBanner { asset->{ _id } },
        aboutStory { asset->{ _id } }
      }
    }`,
  );

  if (!existing) {
    throw new Error(
      "siteSettings document not found. Run npm run seed:sanity first to create it.",
    );
  }

  const patch: Partial<Record<SiteImageKey, ReturnType<typeof imageRef>>> = {};
  const keys = Object.keys(defaultSiteImageFiles) as SiteImageKey[];

  for (const key of keys) {
    const hasAsset = Boolean(existing.siteImages?.[key]?.asset?._id);
    if (hasAsset && !force) {
      console.log(`  ↷ ${key} — already set in Sanity`);
      continue;
    }

    const filename = defaultSiteImageFiles[key];
    const asset = await uploadPhoto(filename);
    patch[key] = imageRef(asset._id, defaultSiteImages[key].alt);
    console.log(`  ✓ ${key}`);
  }

  if (Object.keys(patch).length === 0) {
    console.log("\nAll site photos already populated. Use --force to replace from repo.\n");
    return;
  }

  await client
    .patch("siteSettings")
    .set(
      Object.fromEntries(
        (Object.keys(patch) as SiteImageKey[]).map((key) => [
          `siteImages.${key}`,
          patch[key],
        ]),
      ),
    )
    .commit();

  console.log(`\nDone. Updated ${Object.keys(patch).length} site photo(s) in Sanity.\n`);
}

if (process.argv[1]?.includes("migrate-site-images")) {
  console.log(`\n→ Site photos (${projectId} / ${dataset})\n`);
  migrateSiteImages().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
