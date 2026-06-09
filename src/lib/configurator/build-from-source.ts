import { configuratorSteps as localSteps } from "@/data/configurator-options";
import { sourceData } from "@/lib/source-data";
import { buildBasecampItemOptions } from "@/lib/configurator/basecamp-items";
import type { ConfiguratorData } from "@/lib/configurator/types";

export function buildConfiguratorDataFromSource(): ConfiguratorData {
  const { configurator: cfg, pricing, website } = sourceData;

  const caliberAvailability: Record<string, string[]> = {};
  for (const row of website.caliberMatrix) {
    caliberAvailability[row.id] = Object.entries(row.platforms)
      .filter(([, enabled]) => enabled)
      .map(([slug]) => slug);
  }

  return {
    steps: localSteps,
    pricing: {
      baseBuildCents: pricing.baseBuildCents,
      optionPriceCents: pricing.optionPriceCents,
    },
    platformDefaults: cfg.platformDefaults,
    caliberAvailability,
    rings: cfg.rings,
    basecampDetails: {
      optionId: cfg.basecamp.id,
      label: cfg.basecamp.label,
      headline: cfg.basecamp.headline,
      description: cfg.basecamp.description,
      items: cfg.basecamp.items,
      itemOptions: buildBasecampItemOptions(cfg.basecamp.items),
    },
    ballisticDetails: {
      optionId: cfg.ballistic.id,
      label: cfg.ballistic.label,
      headline: cfg.ballistic.headline,
      description: cfg.ballistic.description,
      howItWorks: cfg.ballistic.howItWorks,
      items: cfg.ballistic.deliverables,
    },
  };
}
