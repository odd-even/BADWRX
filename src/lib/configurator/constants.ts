/** Client-safe configurator constants — no source-data imports. */

export const stepKeys = [
  "platform",
  "caliber",
  "stockPaint",
  "scope",
  "rings",
  "basecampPackage",
  "ballisticPackage",
] as const;

export type StepKey = (typeof stepKeys)[number];

export function configureHref(platformSlug?: string): string {
  return platformSlug
    ? `/configure?platform=${encodeURIComponent(platformSlug)}`
    : "/configure";
}
