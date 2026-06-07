export const brand = {
  name: "Badger Rifleworks",
  short: "BADWRX",
  tagline: "Precision rifles, builder curated",
  email: "info@badwrx.com",
  partners: {
    barrels: "Proof Research",
    optics: "NightForce",
  },
  buildPromise:
    "Every rifle is hand test-fired before it leaves the shop, built to work with specific components chosen by the builder.",
  deliveryPackage:
    "You receive a ballistics table and the specific grain weight and ammunition brand that works best for your rifle — so you can make the perfect shot every time.",
  colors: {
    green: "#080a07",
    black: "#000000",
    red: "#d22026",
    redDark: "#a9181e",
  },
} as const;

export const siteTitle = `${brand.short} | ${brand.name}`;
