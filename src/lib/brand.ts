export const brand = {
  name: "Badger Gunworks",
  short: "BADWRX",
  tagline: "Precision rifles, engineered without compromise",
  email: "info@badwrx.com",
  location: "Diamondhead, Mississippi",
  fflBlurb:
    "An ATF-compliant firearms builder licensed as a Type 07 Federal Firearms License (FFL) holder.",
  partners: {
    barrels: "Proof Research / Carbon Six",
    optics: "NightForce",
  },
  buildPromise:
    "Every BADWRX rifle is built to order, assembled by hand, and tested before it leaves the shop.",
  deliveryPackage:
    "Ballistic Package available — live fire to 1,000m with custom laser-engraved turrets.",
  colors: {
    green: "#080a07",
    black: "#000000",
    red: "#d22026",
    redDark: "#a9181e",
  },
} as const;

export const siteTitle = `${brand.short} | ${brand.name}`;
