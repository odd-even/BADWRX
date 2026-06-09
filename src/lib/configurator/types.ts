import type { ConfigOption, ConfigStep } from "@/lib/types";
import type { StepKey } from "@/data/configurator-options";

export interface PlatformDefault {
  trigger: string;
  muzzleBrake?: string;
}

export interface PackageDetails {
  optionId: string;
  label: string;
  headline: string;
  description: string;
  items: string[];
  itemOptions?: ConfigOption[];
  howItWorks?: string;
}

export interface ConfiguratorPricing {
  baseBuildCents: number;
  optionPriceCents: Record<string, number>;
}

export interface ConfiguratorData {
  steps: ConfigStep[];
  pricing: ConfiguratorPricing;
  platformDefaults: Record<string, PlatformDefault>;
  caliberAvailability: Record<string, string[]>;
  rings: {
    id: string;
    label: string;
    description: string;
  };
  basecampDetails: PackageDetails;
  ballisticDetails: PackageDetails;
}

export type { StepKey };
