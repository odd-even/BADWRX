import { stepKeys, type StepKey } from "@/data/configurator-options";
import { sourceData } from "@/lib/source-data";
import type { BuildConfiguration } from "@/lib/types";

export const optionPriceCents: Record<string, number> =
  sourceData.pricing.optionPriceCents;

export const baseBuildCents = sourceData.pricing.baseBuildCents;

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
