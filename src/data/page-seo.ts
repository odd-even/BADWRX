import { brand } from "@/lib/brand";
import type { PageSeoBlurbs } from "@/lib/types";

/** Default meta descriptions — editable in Sanity → Site Settings → SEO. */
export const defaultPageSeo: PageSeoBlurbs = {
  home: `Precision rifles built to order by ${brand.name} (${brand.short}). Hand test-fired before delivery with a ballistics table and rifle-specific ammunition data.`,
  about: `How ${brand.short} builds precision rifles in Diamondhead, Mississippi — engineered without compromise, tested before delivery, and built to order.`,
  builds:
    "Six BADWRX platforms built to order. View specs, calibers, and configuration options for Specter, Reaper, Imperium, Invictus, Sentinel, and G.O.A.T.",
  configure:
    "Configure your BADWRX rifle — platform, caliber, finish, optics, and packages. Submit your build for a builder review and quote.",
  contact:
    "Start a custom BADWRX rifle build. Share your configuration and our team will respond with timeline, pricing, and next steps.",
  merch:
    "BADWRX field caps, tees, and hoodies. Range-ready apparel with free standard shipping on orders over $100.",
  university:
    "Long Range University from BADWRX — professional ballistics and long-range shooting coaching in small classes with real field applications.",
};
