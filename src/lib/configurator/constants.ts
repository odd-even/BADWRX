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

export function configurePageTitle(platformLabel?: string | null): string {
  return platformLabel ? `Configure ${platformLabel}` : "Configure Your Rifle";
}

/** Reserve space above the fixed configurator step nav (configure page only). */
export const CONFIGURATOR_STEP_NAV_CLEARANCE =
  "calc(5.75rem + env(safe-area-inset-bottom, 0px))";
