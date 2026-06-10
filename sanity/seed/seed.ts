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
import { merchImageSources, merchItems } from "../../src/data/merch";
import { rifles } from "../../src/data/rifles";
import { defaultSiteSettings } from "../../src/data/site-settings";
import { sourceData } from "../../src/lib/source-data";
import {
  scopeFilenames,
  scopeImageKeyForOptic,
  stockPaintFilenames,
} from "../../src/lib/images";
import type { SiteSettings } from "../../src/lib/types";
import {
  pageVisibilityForSanity,
  pageVisibilityNeedsMigration,
} from "../../src/lib/pages";
import { centsToSanityPrice } from "../../src/sanity/lib/price";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const photosDir = path.join(root, "_assets/photos");
const configuratorAssetsDir = path.join(root, "_assets/configurator");
const merchAssetsDir = path.join(root, "_assets/merch");
const configuratorPlatformDir = path.join(configuratorAssetsDir, "platform");
const camoDir = path.join(configuratorAssetsDir, "camo");
const scopesDir = path.join(configuratorAssetsDir, "scopes");
const configuratorPlaceholderFile = "IMG_0058 copy.webp";
const ringsFilename = "348525-300147_main.avif";
const basecampCaseFilename = "Mockup.png";
const configuratorPlaceholderAlt =
  "Custom precision bolt-action rifle with NightForce scope on black background";

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

async function uploadConfiguratorAsset(subfolder: string, filename: string) {
  const filePath = path.join(configuratorAssetsDir, subfolder, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Configurator asset not found: ${filePath}`);
  }
  const buffer = fs.readFileSync(filePath);
  console.log(`  Uploading ${subfolder}/${filename}...`);
  return client.assets.upload("image", buffer, { filename });
}

async function uploadConfiguratorPlaceholder() {
  return uploadConfiguratorAsset("platform", configuratorPlaceholderFile);
}

async function uploadCamoAssets(): Promise<Record<string, string>> {
  const uniqueFiles = [...new Set(Object.values(stockPaintFilenames))];
  const fileToAssetId = new Map<string, string>();

  for (const filename of uniqueFiles) {
    const filePath = path.join(camoDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Camo swatch not found: ${filePath}`);
    }
    const buffer = fs.readFileSync(filePath);
    console.log(`  Uploading camo ${filename}...`);
    const asset = await client.assets.upload("image", buffer, { filename });
    fileToAssetId.set(filename, asset._id);
  }

  const finishAssets: Record<string, string> = {};
  for (const [finishId, filename] of Object.entries(stockPaintFilenames)) {
    const assetId = fileToAssetId.get(filename);
    if (assetId) finishAssets[finishId] = assetId;
  }
  return finishAssets;
}

async function uploadScopeAssets(): Promise<Record<string, string>> {
  const keyToAssetId: Record<string, string> = {};

  for (const [key, filename] of Object.entries(scopeFilenames)) {
    const filePath = path.join(scopesDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Scope image not found: ${filePath}`);
    }
    const buffer = fs.readFileSync(filePath);
    console.log(`  Uploading scope ${filename}...`);
    const asset = await client.assets.upload("image", buffer, { filename });
    keyToAssetId[key] = asset._id;
    keyToAssetId[filename] = asset._id;
  }

  return keyToAssetId;
}

function imageRef(assetId: string, alt: string, caption?: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
    alt,
    ...(caption ? { caption } : {}),
  };
}

function sanityHeadlines(headlines: SiteSettings["homeHero"]["headlines"]) {
  return headlines.map((phrase, index) => ({
    _type: "headlinePhrase",
    _key: `headline-${index}`,
    lines: Array.isArray(phrase) ? phrase : [phrase],
  }));
}

function sanitySiteSettings() {
  const { homeHero, pageVisibility, ...rest } = defaultSiteSettings;
  return {
    ...rest,
    pageVisibility: pageVisibilityForSanity(pageVisibility),
    homeHero: {
      ...homeHero,
      headlines: sanityHeadlines(homeHero.headlines),
    },
  };
}

async function migratePageVisibilityIfNeeded() {
  const doc = await client.fetch<{ pageVisibility?: SiteSettings["pageVisibility"] }>(
    `*[_id == "siteSettings"][0]{ pageVisibility }`,
  );

  if (!doc?.pageVisibility || !pageVisibilityNeedsMigration(doc.pageVisibility)) {
    return;
  }

  await client
    .patch("siteSettings")
    .set({ pageVisibility: pageVisibilityForSanity(doc.pageVisibility) })
    .commit();

  console.log("  ✓ Migrated page visibility toggles to redirect format");
}

async function seedSiteSettings() {
  console.log("\n→ Site settings");
  await migratePageVisibilityIfNeeded();
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    ...sanitySiteSettings(),
  });
}

async function seedCourses(universityHeroAssetId: string) {
  console.log("\n→ Courses");
  for (const course of courses) {
    await client.createOrReplace({
      _id: `course-${course.slug}`,
      _type: "course",
      title: course.title,
      slug: { _type: "slug", current: course.slug },
      tagline: course.tagline,
      level: course.level,
      price: course.price,
      duration: course.duration,
      format: course.format,
      description: course.description,
      topics: course.topics,
      outcomes: course.outcomes,
      curriculum: course.curriculum?.map((item, index) => ({
        _type: "curriculumItem",
        _key: `curriculum-${index}`,
        title: item.title,
        detail: item.detail,
      })),
      audience: course.audience,
      includes: course.includes,
      heroImage: imageRef(
        universityHeroAssetId,
        course.heroImage?.alt ??
          "Long range shooter behind a precision rifle on a carbon fiber tripod",
      ),
      featured: course.featured ?? false,
    });
    console.log(`  ✓ ${course.title}`);
  }
}

async function uploadMerchAsset(folder: string, filename: string) {
  const filePath = path.join(merchAssetsDir, folder, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Merch asset not found: ${filePath}`);
  }
  const buffer = fs.readFileSync(filePath);
  console.log(`  Uploading merch ${folder}/${filename}...`);
  return client.assets.upload("image", buffer, { filename });
}

async function seedMerch() {
  console.log("\n→ Merch");
  const assetCache = new Map<string, string>();

  for (const item of merchItems) {
    const source = merchImageSources[item.slug];
    if (!source) {
      throw new Error(`Missing merch image source for slug: ${item.slug}`);
    }

    const cacheKey = `${source.folder}/${source.filename}`;
    let assetId = assetCache.get(cacheKey);
    if (!assetId) {
      const asset = await uploadMerchAsset(source.folder, source.filename);
      assetId = asset._id;
      assetCache.set(cacheKey, assetId);
    }

    await client.createOrReplace({
      _id: `merch-${item.slug}`,
      _type: "merchItem",
      title: item.title,
      slug: { _type: "slug", current: item.slug },
      category: item.category,
      price: centsToSanityPrice(item.priceCents),
      description: item.description,
      sizes: item.sizes,
      ...(item.colors?.length ? { colors: item.colors } : {}),
      active: true,
      image: imageRef(assetId, item.image.alt),
    });
    console.log(`  ✓ ${item.title}`);
  }
}

async function seedRifles(
  studioAssetId: string,
  croppedAssetId: string,
  configuratorAssetId: string,
) {
  console.log("\n→ Rifle builds");
  const defaultAlt = configuratorPlaceholderAlt;

  for (const rifle of rifles) {
    const useCropped = rifle.featured;
    const heroAsset = useCropped ? croppedAssetId : studioAssetId;
    const sourceRifle = sourceData.website.rifles.find((r) => r.slug === rifle.slug);

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
      primaryUse: sourceRifle?.primaryUse,
      chassis: sourceRifle?.platform,
      actionName: sourceRifle?.action,
      barrelSummary: sourceRifle?.barrel,
      configuratorPrice: centsToSanityPrice(
        sourceData.pricing.optionPriceCents[rifle.slug] ?? 0,
      ),
      showInConfigurator: true,
      heroImage: imageRef(heroAsset, rifle.heroImage.alt || defaultAlt),
      configuratorImage: imageRef(
        configuratorAssetId,
        `${rifle.title} platform`,
      ),
      gallery: rifle.gallery.map((item) =>
        imageRef(studioAssetId, item.alt || defaultAlt, item.caption),
      ),
      specs: rifle.specs,
      highlights: rifle.highlights,
    });
    console.log(`  ✓ ${rifle.title}`);
  }
}

function slugField(id: string) {
  return { _type: "slug" as const, current: id };
}

async function seedConfiguratorSettings(
  configuratorAssetId: string,
  camoAssets: Record<string, string>,
  scopeAssets: Record<string, string>,
  ringsAssetId: string,
  basecampAssetId: string,
) {
  console.log("\n→ Build configurator");
  const { website, configurator: cfg, pricing } = sourceData;
  const opticsCopy = [
    website.copyBlocks["OPTICS PACKAGE — Headline"],
    website.copyBlocks["OPTICS PACKAGE — Body"],
  ]
    .filter(Boolean)
    .join(" — ");

  await client.createOrReplace({
    _id: "configuratorSettings",
    _type: "configuratorSettings",
    baseBuildPrice: centsToSanityPrice(pricing.baseBuildCents),
    platformDefaults: Object.entries(cfg.platformDefaults).map(
      ([platformSlug, defaults], index) => ({
        _key: `platform-${index}`,
        _type: "platformDefault",
        platformSlug,
        trigger: defaults.trigger,
        ...(defaults.muzzleBrake ? { muzzleBrake: defaults.muzzleBrake } : {}),
      }),
    ),
    stepCopy: {
      platform: website.rifles.length
        ? `${website.rifles.length} purpose-built BADWRX platforms — all built to order`
        : "Select your BADWRX platform",
      caliber:
        "Chambered and proofed for your platform — contact us for custom chamberings.",
      stockPaint:
        "Available on all platforms · Custom Cerakote and paint · stock, action, and barrel as a complete system",
      scope:
        opticsCopy ||
        "NightForce optics — mounted, leveled, and bore-sighted in-house",
      rings: "Included with all Optics Package configurations",
      basecampPackage: cfg.basecamp.description,
      ballisticPackage: cfg.ballistic.description,
    },
    calibers: website.caliberMatrix.map((row, index) => ({
      _key: `caliber-${index}`,
      _type: "caliberOption",
      optionId: slugField(row.id),
      label: row.caliber,
      notes: row.notes,
      price: centsToSanityPrice(pricing.optionPriceCents[row.id] ?? 0),
      platformSlugs: Object.entries(row.platforms)
        .filter(([, enabled]) => enabled)
        .map(([slug]) => slug),
    })),
    finishes: website.stockColors.map((color, index) => ({
      _key: `finish-${index}`,
      _type: "finishOption",
      optionId: slugField(color.id),
      label: color.label,
      code: color.code,
      description: color.description,
      bestFor: color.bestFor,
      price: centsToSanityPrice(pricing.optionPriceCents[color.id] ?? 0),
      image: imageRef(
        camoAssets[color.id] ?? camoAssets.custom,
        `${color.label} finish`,
      ),
    })),
    optics: website.optics.map((optic, index) => {
      const scopeKey = scopeImageKeyForOptic(optic.magnification, optic.id);
      const scopeAssetId = scopeAssets[scopeKey];
      return {
        _key: `optic-${index}`,
        _type: "opticOption",
        optionId: slugField(optic.id),
        brand: optic.brand,
        model: optic.model,
        magnification: optic.magnification,
        focalPlane: optic.focalPlane,
        reticle: optic.reticle,
        tube: optic.tube,
        msrp: optic.msrp,
        notes: optic.notes,
        price: centsToSanityPrice(
          pricing.optionPriceCents[optic.id] ?? optic.msrpCents ?? 0,
        ),
        image: imageRef(
          scopeAssetId,
          `Nightforce ${optic.model} ${optic.magnification} ${optic.reticle}`,
        ),
      };
    }),
    opticsConsult: {
      label: "Discuss optics with the BADWRX team",
      description:
        "Contact us to discuss your specific optic configuration. We will match the right glass to your platform, your caliber, and your intended use.",
    },
    opticsNone: {
      label: "No optics package",
      description: "Picatinny prepared; customer-supplied optic.",
    },
    rings: {
      optionId: cfg.rings.id,
      label: cfg.rings.label,
      description: cfg.rings.description,
      price: centsToSanityPrice(pricing.optionPriceCents[cfg.rings.id] ?? 0),
      image: imageRef(ringsAssetId, "Hawkins precision rings"),
    },
    basecamp: {
      optionId: cfg.basecamp.id,
      label: cfg.basecamp.label,
      headline: cfg.basecamp.headline,
      description: cfg.basecamp.description,
      items: cfg.basecamp.items,
      price: centsToSanityPrice(pricing.optionPriceCents[cfg.basecamp.id] ?? 0),
      image: imageRef(basecampAssetId, cfg.basecamp.label),
      noneLabel: "No Basecamp Package",
      noneDescription: "Rifle ships in protective wrap only.",
    },
    ballistic: {
      optionId: cfg.ballistic.id,
      label: cfg.ballistic.label,
      headline: cfg.ballistic.headline,
      description: cfg.ballistic.description,
      howItWorks: cfg.ballistic.howItWorks,
      deliverables: cfg.ballistic.deliverables,
      price: centsToSanityPrice(pricing.optionPriceCents[cfg.ballistic.id] ?? 0),
      noneLabel: "No Ballistic Package",
      noneDescription: "Standard zero and function verification only.",
    },
  });
  console.log("  ✓ Build configurator");
}

async function main() {
  console.log(`Seeding Sanity project ${projectId} (${dataset})`);

  console.log("\n→ Uploading photos");
  const studio = await uploadPhoto("IMG_0058.jpg");
  const cropped = await uploadPhoto("IMG_0058-cropped.jpg");
  const university = await uploadPhoto("Kyle_Lamb_MDT_CRBN_Tripod.jpg.webp");
  const configuratorPlaceholder = await uploadConfiguratorPlaceholder();
  const camoAssets = await uploadCamoAssets();
  const scopeAssets = await uploadScopeAssets();
  const ringsAsset = await uploadConfiguratorAsset("rings", ringsFilename);
  const basecampAsset = await uploadConfiguratorAsset("cases", basecampCaseFilename);

  await seedSiteSettings();
  await seedCourses(university._id);
  await seedMerch();
  await seedRifles(studio._id, cropped._id, configuratorPlaceholder._id);
  await seedConfiguratorSettings(
    configuratorPlaceholder._id,
    camoAssets,
    scopeAssets,
    ringsAsset._id,
    basecampAsset._id,
  );

  console.log("\nDone. Open /studio to edit content.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
