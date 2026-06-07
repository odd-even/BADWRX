import { brand } from "@/lib/brand";
import { getCopy, sourceData } from "@/lib/source-data";
import type { SiteSettings } from "@/lib/types";

const { docxCopy } = sourceData;

function pillarParts(key: "weight" | "accuracy" | "durability") {
  const line = docxCopy.pillars[key];
  if (!line) return { title: key, body: "" };
  const dash = line.indexOf("—");
  if (dash === -1) return { title: key, body: line };
  return {
    title: line.slice(0, dash).trim(),
    body: line.slice(dash + 1).trim(),
  };
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
    eyebrow: "Unrelenting performance",
    headlinePrefix: "Engineered ",
    headlines: [
      "Without Compromise.",
      "for Unrelenting Performance.",
      "for the Hard Country.",
    ],
    subheadline: docxCopy.homeHero.subheadline,
  },
  homePlatforms: {
    eyebrow: "Our platforms",
    title: docxCopy.buildsPage.headline,
    body:
      "Every rifle is built to order — your timeline, your specs, your caliber. Explore the line or configure a build when you're ready.",
  },
  homeIntro: {
    eyebrow: "Who we build for",
    body: docxCopy.brandStatement,
  },
  homePillars: [
    pillarParts("weight"),
    pillarParts("accuracy"),
    pillarParts("durability"),
  ],
  fieldTested: {
    eyebrow: "Field proven",
    title: "Built for hard country",
    body: pillarParts("durability").body,
  },
  unrelenting: {
    eyebrow: "Ballistic package",
    title: getCopy(
      "BALLISTIC PACKAGE — Headline",
      "Your rifle ships zeroed. Most builders stop there. We don't.",
    ),
    body:
      getCopy("BALLISTIC PACKAGE — Body") ||
      "The BADWRX Ballistic Package takes your rifle to 1,000 meters with real data and laser-engraved turrets.",
  },
  testimonial: {
    quote:
      "Most 'custom' rifles still need work. This one didn't. Zeroed quick, tracked true, and the first round in the field ended the hunt. When your rifle does exactly what it's supposed to, everything gets simpler.",
    author: "Tj",
  },
  contactSection: {
    title: "Request a build quote",
    body:
      "Every BADWRX rifle is built to order. No inventory. No compromises. Tell us what you need and we'll get to work.",
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
