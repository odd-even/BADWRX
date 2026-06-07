/**
 * Seed Sanity with current BADWRX content.
 *
 * Requires:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET (default: production)
 *   SANITY_API_TOKEN (Editor token from sanity.io/manage)
 *
 * Run: npm run seed:sanity
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { courses } from "../../src/data/courses";
import { rifles } from "../../src/data/rifles";
import { defaultSiteSettings } from "../../src/data/site-settings";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const photosDir = path.join(root, "_assets/photos");

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

async function uploadPhoto(filename: string) {
  const filePath = path.join(photosDir, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Photo not found: ${filePath}`);
  }
  const buffer = fs.readFileSync(filePath);
  console.log(`  Uploading ${filename}...`);
  return client.assets.upload("image", buffer, { filename });
}

function imageRef(assetId: string, alt: string, caption?: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
    alt,
    ...(caption ? { caption } : {}),
  };
}

async function seedSiteSettings() {
  console.log("\n→ Site settings");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    ...defaultSiteSettings,
  });
}

async function seedCourses() {
  console.log("\n→ Courses");
  for (const course of courses) {
    await client.createOrReplace({
      _id: `course-${course.slug}`,
      _type: "course",
      title: course.title,
      slug: { _type: "slug", current: course.slug },
      level: course.level,
      price: course.price,
      description: course.description,
      topics: course.topics,
      featured: course.featured ?? false,
    });
    console.log(`  ✓ ${course.title}`);
  }
}

async function seedRifles(studioAssetId: string, croppedAssetId: string) {
  console.log("\n→ Rifle builds");
  const defaultAlt =
    "Custom precision bolt-action rifle with NightForce scope on black background";

  for (const rifle of rifles) {
    const useCropped = rifle.featured;
    const heroAsset = useCropped ? croppedAssetId : studioAssetId;

    await client.createOrReplace({
      _id: `rifle-${rifle.slug}`,
      _type: "rifle",
      title: rifle.title,
      slug: { _type: "slug", current: rifle.slug },
      tagline: rifle.tagline,
      category: rifle.category,
      featured: rifle.featured,
      startingAt: rifle.startingAt,
      description: rifle.description,
      heroImage: imageRef(heroAsset, rifle.heroImage.alt || defaultAlt),
      gallery: rifle.gallery.map((item) =>
        imageRef(studioAssetId, item.alt || defaultAlt, item.caption),
      ),
      specs: rifle.specs,
      highlights: rifle.highlights,
    });
    console.log(`  ✓ ${rifle.title}`);
  }
}

async function main() {
  console.log(`Seeding Sanity project ${projectId} (${dataset})`);

  console.log("\n→ Uploading photos");
  const studio = await uploadPhoto("IMG_0058.jpg");
  const cropped = await uploadPhoto("IMG_0058-cropped.jpg");

  await seedSiteSettings();
  await seedCourses();
  await seedRifles(studio._id, cropped._id);

  console.log("\nDone. Open /studio to edit content.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
