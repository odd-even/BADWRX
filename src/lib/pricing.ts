import { stepKeys, type StepKey } from "@/lib/configurator/constants";
import type { ConfiguratorPricing } from "@/lib/configurator/types";
import { isBasecampNoneOption } from "@/lib/configurator/basecamp-items";
import type { BuildConfiguration } from "@/lib/types";

const emptyPricing: ConfiguratorPricing = {
  baseBuildCents: 0,
  optionPriceCents: {},
};

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
  pricing: ConfiguratorPricing = emptyPricing,
): number {
  return pricing.optionPriceCents[optionId] ?? 0;
}

export function computeBuildTotal(
  config: BuildConfiguration,
  pricing: ConfiguratorPricing = emptyPricing,
): number {
  let total = pricing.baseBuildCents;
  for (const key of stepKeys) {
    if (key === "basecampPackage") continue;
    const option = config[key];
    if (option) {
      total += getOptionPrice(option.id, pricing);
    }
  }
  for (const item of config.basecampItems) {
    total += getOptionPrice(item.id, pricing);
  }
  return total;
}

export function computeBuildLineItems(
  config: BuildConfiguration,
  pricing: ConfiguratorPricing = emptyPricing,
): { key: StepKey; label: string; cents: number }[] {
  const items: { key: StepKey; label: string; cents: number }[] = [];

  for (const key of stepKeys) {
    if (key === "basecampPackage") {
      if (isBasecampNoneOption(config.basecampPackage)) continue;
      for (const item of config.basecampItems) {
        items.push({
          key,
          label: item.label,
          cents: getOptionPrice(item.id, pricing),
        });
      }
      continue;
    }
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
