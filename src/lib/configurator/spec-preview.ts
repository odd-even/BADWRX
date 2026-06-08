import type { StepKey } from "@/data/configurator-options";
import type { ConfigOption } from "@/lib/types";

const textSpecPreviewSteps: StepKey[] = ["caliber", "ballisticPackage"];

export function showsInSpecPreview(
  key: StepKey,
  option: ConfigOption | null,
): boolean {
  if (!option) return false;
  if (option.image) return true;
  if (key === "ballisticPackage" && option.id === "ballistic-none") return false;
  return textSpecPreviewSteps.includes(key);
}
