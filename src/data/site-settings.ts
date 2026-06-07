import { brand } from "@/lib/brand";
import { getCopy, sourceData } from "@/lib/source-data";
import type { SiteSettings } from "@/lib/types";

const { docxCopy } = sourceData;

function pillarBody(key: "weight" | "accuracy" | "durability", fallback: string): string {
  const line = docxCopy.pillars[key];
  if (!line) return fallback;
  const parts = line.split("—");
  return parts.length > 1 ? parts.slice(1).join("—").trim() : line;
}

export const defaultSiteSettings: SiteSettings = {
  name: brand.name,
  short: brand.short,
  tagline: brand.tagline,
  email: brand.email,
  partnerBarrels: "Proof Research / Carbon Six",
  partnerOptics: "NightForce",
  buildPromise:
    docxCopy.brandStatement ||
    "Every BADWRX rifle is built to order, assembled by hand, and tested before it leaves.",
  deliveryPackage:
    getCopy("BALLISTIC PACKAGE — Body") ||
    brand.deliveryPackage,
  trustMarqueeItems: [
    "NightForce Optics",
    "Carbon Six Barrels",
    "Hand Test-Fired",
    "½ MOA Guarantee",
    "Built to Order",
  ],
  homeHero: {
    eyebrow: "Engineered Without Compromise",
    headline: docxCopy.homeHero.headline,
    subheadline: docxCopy.homeHero.subheadline,
  },
  fieldTested: {
    eyebrow: "Field proven",
    title: "Built for hard country",
    body: pillarBody(
      "durability",
      "Hard country breaks equipment. BADWRX rifles are built for conditions that end hunts — and built to deliver on target every time.",
    ),
  },
  unrelenting: {
    eyebrow: "Our standard",
    title: "Unrelenting performance",
    body: pillarBody(
      "accuracy",
      "Sub-MOA performance is the floor, not the ceiling. Our rifles are built, tested, and guaranteed to shoot ½ MOA with proper load development.",
    ),
  },
  testimonial: {
    quote:
      "Most builders stop at zeroed. BADWRX takes your rifle to 1,000 meters — real data, engraved turrets, ready in the field.",
    author: "BADWRX Ballistic Package",
  },
  contactSection: {
    title: "Request a build quote",
    body:
      docxCopy.customQuoteCta ||
      getCopy(
        "CONTACT / QUOTE REQUEST",
        "Every BADWRX rifle is built to order. Tell us what you need.",
      ),
  },
  aboutPage: {
    title: getCopy("ABOUT — Headline", "Built Different. On Purpose."),
    body: [
      getCopy("ABOUT — Body", brand.buildPromise),
      getCopy("ABOUT — Pillar 1: PRECISION", ""),
      getCopy("ABOUT — Pillar 2: WEIGHT", ""),
      getCopy("ABOUT — Pillar 3: RELIABILITY", ""),
    ].filter(Boolean),
    philosophyQuote: getCopy(
      "BALLISTIC PACKAGE — Headline",
      "Your rifle ships zeroed. Most builders stop there. We don't.",
    ),
  },
};
