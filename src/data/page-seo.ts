import { brand } from "@/lib/brand";
import type { PageSeoBlurbs } from "@/lib/types";

/**
 * Default meta descriptions — editable in Sanity → Site Settings → SEO.
 * Aim for ~150–160 characters (search snippet length).
 */
export const defaultPageSeo: PageSeoBlurbs = {
  home:
    "BADWRX builds custom precision rifles to order in Diamondhead, Mississippi. Every gun is hand test-fired and ships with trued ballistic data, NightForce-ready specs, and builder support.",
  about:
    "BADWRX (Badger Gunworks) engineers precision rifles without compromise in Diamondhead, MS. Built to order, tested before delivery, and designed for hard country.",
  builds:
    "Browse six BADWRX rifle builds — Specter, Reaper, Imperium, Invictus, Sentinel, and G.O.A.T. Compare specs, calibers, chassis options, and starting prices.",
  configure:
    "Configure your BADWRX rifle — platform, caliber, finish, optics, rings, and Basecamp or Ballistic packages. Submit your build for a personal quote from our team.",
  contact:
    "Reach BADWRX to start a custom rifle build or ask a question. Our builders review every inquiry personally and respond with configuration, timeline, and pricing.",
  merch:
    "Shop BADWRX field caps, tees, and hoodies. Range-ready apparel for hunters and precision shooters. Free standard shipping on U.S. merch orders over $100.",
  university:
    "BADWRX Long Range University offers small-class ballistics and long-range shooting instruction. Professional coaches, real DOPE validation, and field-ready skills.",
};

/** Character counts for Studio validation hints. */
export const pageSeoCharCounts = Object.fromEntries(
  Object.entries(defaultPageSeo).map(([key, text]) => [key, text.length]),
) as Record<keyof PageSeoBlurbs, number>;
