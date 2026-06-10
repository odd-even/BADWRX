import { sourceData } from "@/lib/source-data";
import { categoryLabels } from "@/lib/rifle-labels";
import type { Rifle, RifleCategory } from "@/lib/types";
import { configuratorPlaceholder, riflePlaceholderAlt } from "@/lib/images";

export { categoryLabels };

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
    url: configuratorPlaceholder,
    alt: riflePlaceholderAlt,
    ...(caption ? { caption } : {}),
  };
}

const heroImage = {
  url: configuratorPlaceholder,
  alt: riflePlaceholderAlt,
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
      caliber: spec.calibers?.replace(/\s*·\s*/g, ", ") ?? r.caliberFamily,
      barrel: specs.barrel ?? r.barrel,
      stock: specs.chassis ?? specs.stock ?? r.platform,
      bottomMetal: specs.bottom_metal,
      trigger: specs.trigger ?? "TriggerTech Special",
      finish: specs.finish_notes
        ? `${specs.finish ?? "Custom Cerakote"} (${specs.finish_notes})`
        : specs.finish ?? "Custom Cerakote",
      ...(specs.muzzle_brake ? { muzzleBrake: specs.muzzle_brake } : {}),
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
