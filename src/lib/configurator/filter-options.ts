import type { BuildConfiguration, ConfigOption } from "@/lib/types";
import type { ConfiguratorData } from "@/lib/configurator/types";
import type { StepKey } from "@/data/configurator-options";

export function calibersForPlatform(
  platformSlug: string | undefined,
  caliberAvailability: ConfiguratorData["caliberAvailability"],
) {
  return Object.entries(caliberAvailability).filter(([id, platforms]) => {
    if (!platformSlug) return true;
    if (id === "other-custom") return true;
    return platforms.includes(platformSlug);
  });
}

export function filterStepOptions(
  stepId: StepKey,
  options: ConfigOption[],
  config: BuildConfiguration,
  data: Pick<ConfiguratorData, "caliberAvailability" | "rings">,
): ConfigOption[] {
  switch (stepId) {
    case "caliber": {
      const allowed = new Set(
        calibersForPlatform(config.platform?.id, data.caliberAvailability).map(
          ([id]) => id,
        ),
      );
      return options.filter((o) => allowed.has(o.id));
    }
    case "rings": {
      const hasScope =
        config.scope != null && config.scope.id !== "scope-none";
      if (!hasScope) {
        return options.filter((o) => o.id === "rings-none");
      }
      return options.filter((o) => o.id === data.rings.id);
    }
    default:
      return options;
  }
}

export function platformSpecDefaults(
  platformSlug: string | undefined,
  platformDefaults: ConfiguratorData["platformDefaults"],
  actionName?: string,
): Record<string, string> {
  if (!platformSlug) return {};
  const defaults = platformDefaults[platformSlug];
  if (!defaults) return {};

  const specs: Record<string, string> = {
    trigger: defaults.trigger,
  };
  if (actionName) specs.action = actionName;
  if (defaults.muzzleBrake) specs.muzzleBrake = defaults.muzzleBrake;
  return specs;
}

export function companionSelection(
  stepId: StepKey,
  option: ConfigOption,
  rings: ConfiguratorData["rings"],
): Partial<BuildConfiguration> {
  if (stepId === "scope") {
    if (option.id === "scope-consult") {
      return {
        rings: {
          id: "rings-none",
          label: "Discuss with team",
          specs: { rings: "Discuss with team" },
        },
      };
    }
    if (option.id === "scope-none") {
      return { rings: { id: "rings-none", label: "No rings", specs: { rings: "None" } } };
    }
    return {
      rings: {
        id: rings.id,
        label: rings.label,
        description: rings.description,
        specs: { rings: rings.label, tube: "30mm" },
      },
    };
  }
  return {};
}

export function clearDependentSelections(
  stepId: StepKey,
  config: BuildConfiguration,
  caliberAvailability: ConfiguratorData["caliberAvailability"],
): Partial<BuildConfiguration> {
  if (stepId === "platform") {
    const caliberOk =
      config.caliber &&
      calibersForPlatform(config.platform?.id, caliberAvailability).some(
        ([id]) => id === config.caliber?.id,
      );
    return caliberOk ? {} : { caliber: null };
  }
  return {};
}
