import { brand } from "@/lib/brand";
import type { SiteSettings } from "@/lib/types";

export const defaultSiteSettings: SiteSettings = {
  name: brand.name,
  short: brand.short,
  tagline: brand.tagline,
  email: brand.email,
  partnerBarrels: brand.partners.barrels,
  partnerOptics: brand.partners.optics,
  buildPromise: brand.buildPromise,
  deliveryPackage: brand.deliveryPackage,
  trustMarqueeItems: [
    `${brand.partners.barrels} Barrels`,
    `${brand.partners.optics} Optics`,
    "Hand Test-Fired",
    "Ballistics Table Included",
    "Rifle-Specific Ammo Data",
  ],
  homeHero: {
    eyebrow: "Unrelenting Performance",
    headline: "Precision built for the hunt",
    subheadline: `${brand.buildPromise} ${brand.deliveryPackage}`,
  },
  fieldTested: {
    eyebrow: "Field proven",
    title: "Field tested in the harshest conditions",
    body: "Every platform is field tested on real Alaska mountain hunts to confirm durability, reliability, and performance where it counts. These aren't bench rifles — they're built to work in the field, with your ammunition, on your hunt.",
  },
  unrelenting: {
    eyebrow: "Our standard",
    title: "Unrelenting performance",
    body: `${brand.buildPromise} ${brand.deliveryPackage} If it doesn't meet our ½ MOA standard, it doesn't ship—simple as that.`,
  },
  testimonial: {
    quote:
      "Most 'custom' rifles still need work. This one didn't. Zeroed quick, tracked true, and the first round in the field ended the hunt. When your rifle does exactly what it's supposed to, everything gets simpler.",
    author: "Tj",
  },
  contactSection: {
    title: "Start the conversation",
    body: "Questions about platforms, chamberings, or what goes into a build? Reach out to discuss your next rifle — every component is selected by the builder to meet precision standards, not pulled from a parts bin.",
  },
  aboutPage: {
    title: "Built to precision standards",
    body: [
      `${brand.buildPromise} Barrels are ${brand.partners.barrels}. Optics are ${brand.partners.optics}. Actions, triggers, stocks, and the rest of the component stack are selected the same way — not because they're popular, but because they meet the standard the builder holds every rifle to before it leaves the shop.`,
      brand.deliveryPackage,
      "Each rifle is pillar bedded and verified to ½\" three-shot groups at 100 yards with the recommended factory ammunition. You receive the targets. If it doesn't meet that standard, it doesn't ship.",
    ],
    philosophyQuote:
      "Hand test-fired before it leaves the shop. You get the ballistics table, the ammo that works, and a rifle ready to put the shot where it needs to go.",
  },
};
