import { sourceData } from "@/lib/source-data";
import type { Rifle, RifleCategory } from "@/lib/types";
import { images, riflePlaceholder, riflePlaceholderAlt } from "@/lib/images";

const categoryBySlug: Record<string, RifleCategory> = {
  specter: "hunting",
  reaper: "precision",
  imperium: "hunting",
  invictus: "precision",
  sentinel: "safari",
  goat: "long-range",
};

const featuredSlugs = new Set(["specter", "reaper", "invictus"]);

function formatStartingAt(slug: string): string | undefined {
  const cents = sourceData.pricing.optionPriceCents[slug];
  if (!cents) return undefined;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function rifleImage(caption?: string) {
  return {
    url: riflePlaceholder,
    alt: riflePlaceholderAlt,
    ...(caption ? { caption } : {}),
  };
}

const heroImage = {
  url: images.rifle.studioCropped,
  alt: riflePlaceholderAlt,
};

export const categoryLabels: Record<RifleCategory, string> = {
  hunting: "Hunting",
  "long-range": "Long Range",
  safari: "Safari / Dangerous Game",
  precision: "Precision",
};

export const rifles: Rifle[] = sourceData.website.rifles.map((r, index) => {
  const spec = sourceData.website.rifleSpecs[r.slug] ?? { specs: {} };
  const description =
    spec.description ??
    sourceData.website.copyBlocks[r.title] ??
    r.tagline;

  const specs = spec.specs;
  return {
    id: String(index + 1),
    slug: r.slug,
    title: r.shortName,
    tagline: r.tagline,
    category: categoryBySlug[r.slug] ?? "precision",
    featured: featuredSlugs.has(r.slug),
    startingAt: formatStartingAt(r.slug),
    description,
    heroImage,
    gallery: [
      rifleImage(r.primaryUse),
      rifleImage(`${r.action} · ${r.barrel}`),
      rifleImage(r.platform),
    ],
    specs: {
      action: specs.action ?? r.action,
      caliber: spec.calibers?.split("·")[0]?.trim() ?? r.caliberFamily,
      barrel: specs.barrel ?? r.barrel,
      stock: specs.chassis ?? specs.stock ?? r.platform,
      trigger: specs.trigger ?? "TriggerTech Special",
      finish: specs.finish ?? "Custom Cerakote",
      muzzleBrake: specs.muzzle_brake,
      weight: specs.weight !== "TBD" ? specs.weight : undefined,
    },
    highlights: [
      r.action,
      r.barrel,
      r.platform,
      "Built to order — no inventory",
      spec.calibers ? `Calibers: ${spec.calibers}` : r.caliberFamily,
    ].filter(Boolean) as string[],
  };
});

export function getRifleBySlug(slug: string): Rifle | undefined {
  return rifles.find((r) => r.slug === slug);
}

export function getFeaturedRifles(): Rifle[] {
  return rifles.filter((r) => r.featured);
}
