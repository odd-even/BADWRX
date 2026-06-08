import { stepKeys, type StepKey } from "@/data/configurator-options";
import type { ConfiguratorPricing } from "@/lib/configurator/types";
import { buildConfiguratorDataFromSource } from "@/lib/configurator/build-from-source";
import type { BuildConfiguration } from "@/lib/types";

const defaultPricing = buildConfiguratorDataFromSource().pricing;

export const optionPriceCents: Record<string, number> =
  defaultPricing.optionPriceCents;

export const baseBuildCents = defaultPricing.baseBuildCents;

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatPriceDelta(
  cents: number,
  stepKey?: StepKey,
): string | null {
  if (cents === 0 && stepKey === "caliber") return null;
  if (cents === 0) return "Included";
  return cents > 0 ? `+${formatPrice(cents)}` : formatPrice(cents);
}

export function formatLineItemPrice(cents: number, stepKey?: StepKey): string {
  if (cents === 0 && stepKey === "caliber") return "";
  if (cents === 0) return "Included";
  return formatPrice(cents);
}

export function getOptionPrice(
  optionId: string,
  pricing: ConfiguratorPricing = defaultPricing,
): number {
  return pricing.optionPriceCents[optionId] ?? 0;
}

export function computeBuildTotal(
  config: BuildConfiguration,
  pricing: ConfiguratorPricing = defaultPricing,
): number {
  let total = pricing.baseBuildCents;
  for (const key of stepKeys) {
    const option = config[key];
    if (option) {
      total += getOptionPrice(option.id, pricing);
    }
  }
  return total;
}

export function computeBuildLineItems(
  config: BuildConfiguration,
  pricing: ConfiguratorPricing = defaultPricing,
): { key: StepKey; label: string; cents: number }[] {
  const items: { key: StepKey; label: string; cents: number }[] = [];

  for (const key of stepKeys) {
    const option = config[key];
    if (!option) continue;
    items.push({
      key,
      label: option.label,
      cents: getOptionPrice(option.id, pricing),
    });
  }

  return items;
}
