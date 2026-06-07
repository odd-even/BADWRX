import { stepKeys, type StepKey } from "@/data/configurator-options";
import type { BuildConfiguration } from "@/lib/types";

/** Placeholder component prices in cents — replace with your real build sheet */
export const optionPriceCents: Record<string, number> = {
  // Action (platform base)
  "dominus-mk1": 4_200_00,
  "invictus-x": 4_800_00,
  "primus-ul": 3_600_00,
  // Caliber
  "7mm-prc": 0,
  "300-prc": 150_00,
  "308-win": 0,
  "375-hh": 350_00,
  "6-5-prc": 0,
  // Barrel
  "proof-carbon-24": 1_150_00,
  "proof-carbon-22": 1_050_00,
  "proof-steel-26": 750_00,
  "proof-steel-22": 650_00,
  // Stock
  "manners-prs": 950_00,
  "sf-rifleman": 1_100_00,
  "mcmillan-supergrade": 850_00,
  "chassis-mdt": 1_250_00,
  // Stock paint
  "matte-black": 0,
  "od-green": 175_00,
  "fde": 175_00,
  "multicam": 350_00,
  "custom": 450_00,
  // Trigger
  "triggertech-special": 275_00,
  "triggertech-diamond": 425_00,
  "timney-calvinelite": 325_00,
  // Metal finish
  "cerakote-black": 0,
  "cerakote-tungsten": 125_00,
  "cerakote-red": 225_00,
  "stainless-bead": 0,
  // Scope
  "nf-nx8-4-32": 2_450_00,
  "nf-atacr-5-25": 3_200_00,
  "nf-shv-4-14": 1_650_00,
  "scope-none": 0,
  // Rings
  "nf-xtrm-30mm": 275_00,
  "nf-xtrm-34mm": 295_00,
  "spuhr-30mm-cant": 425_00,
  "rings-none": 0,
  // Muzzle brake
  "apa-little-bighorn": 185_00,
  "badger-fte": 165_00,
  "benchmark-brake": 175_00,
  "muzzle-none": 0,
  // Suppressor
  "silencerco-omega-300": 1_150_00,
  "dead-air-sandman-s": 1_050_00,
  "tb-ultra-7": 1_275_00,
  "suppressor-none": 0,
  // Case
  "pelican-1750": 425_00,
  "pelican-1700": 375_00,
  "badger-field-pack": 225_00,
  "case-none": 0,
};

/** Shop labor, bedding, test-fire, ballistics package */
export const baseBuildCents = 850_00;

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatPriceDelta(cents: number): string {
  if (cents === 0) return "Included";
  return cents > 0 ? `+${formatPrice(cents)}` : formatPrice(cents);
}

export function getOptionPrice(optionId: string): number {
  return optionPriceCents[optionId] ?? 0;
}

export function computeBuildTotal(config: BuildConfiguration): number {
  let total = baseBuildCents;
  for (const key of stepKeys) {
    const option = config[key];
    if (option) {
      total += getOptionPrice(option.id);
    }
  }
  return total;
}

export function computeBuildLineItems(
  config: BuildConfiguration,
): { key: StepKey; label: string; cents: number }[] {
  const items: { key: StepKey; label: string; cents: number }[] = [
    { key: "platform", label: "Build & verification", cents: baseBuildCents },
  ];

  for (const key of stepKeys) {
    const option = config[key];
    if (!option) continue;
    items.push({
      key,
      label: option.label,
      cents: getOptionPrice(option.id),
    });
  }

  return items;
}

/** Suggested deposit for custom builds (50%) — used when Square Invoices is wired up */
export function computeDepositCents(totalCents: number, rate = 0.5): number {
  return Math.round(totalCents * rate);
}
