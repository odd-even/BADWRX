import type { BuildConfiguration, ConfigOption } from "@/lib/types";
import { sourceData } from "@/lib/source-data";
import type { StepKey } from "@/data/configurator-options";

export function calibersForPlatform(platformSlug: string | undefined) {
  return sourceData.website.caliberMatrix.filter((row) => {
    if (row.caliber === "Other / Custom") return false;
    if (!platformSlug) return true;
    return row.platforms[platformSlug as keyof typeof row.platforms];
  });
}

export function filterStepOptions(
  stepId: StepKey,
  options: ConfigOption[],
  config: BuildConfiguration,
): ConfigOption[] {
  switch (stepId) {
    case "caliber": {
      const allowed = new Set(
        calibersForPlatform(config.platform?.id).map((c) => c.id),
      );
      return options.filter((o) => allowed.has(o.id));
    }
    case "rings": {
      const hasScope =
        config.scope != null && config.scope.id !== "scope-none";
      if (!hasScope) {
        return options.filter((o) => o.id === "rings-none");
      }
      return options.filter((o) => o.id === "hawkins-ult-rings");
    }
    default:
      return options;
  }
}

/** Platform spec defaults from source (not user-selectable steps). */
export function platformSpecDefaults(platformSlug: string | undefined) {
  if (!platformSlug) return {};
  const defaults = sourceData.configurator.platformDefaults[platformSlug];
  if (!defaults) return {};
  return {
    action: sourceData.website.rifles.find((r) => r.slug === platformSlug)
      ?.action,
    muzzleBrake: defaults.muzzleBrake,
    trigger: defaults.trigger,
  };
}

export function companionSelection(
  stepId: StepKey,
  option: ConfigOption,
): Partial<BuildConfiguration> {
  if (stepId === "scope") {
    if (option.id === "scope-none") {
      return { rings: { id: "rings-none", label: "No rings", specs: { rings: "None" } } };
    }
    const rings = sourceData.configurator.rings;
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
): Partial<BuildConfiguration> {
  if (stepId === "platform") {
    const caliberOk =
      config.caliber &&
      calibersForPlatform(config.platform?.id).some(
        (c) => c.id === config.caliber?.id,
      );
    return caliberOk ? {} : { caliber: null };
  }
  return {};
}
