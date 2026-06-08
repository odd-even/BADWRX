/** Convert Sanity USD field to app-internal cents. Supports legacy cent fields. */
export function sanityPriceToCents(
  dollars?: number,
  legacyCents?: number,
): number {
  if (typeof dollars === "number") return Math.round(dollars * 100);
  if (typeof legacyCents === "number") return legacyCents;
  return 0;
}

/** Convert app cents to Sanity USD field. */
export function centsToSanityPrice(cents: number): number {
  return cents / 100;
}
