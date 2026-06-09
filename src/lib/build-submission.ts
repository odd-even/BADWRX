import { stepKeys, type StepKey } from "@/data/configurator-options";
import { isBasecampNoneOption } from "@/lib/configurator/basecamp-items";
import type { ConfigStep } from "@/lib/types";
import type { BuildConfiguration } from "@/lib/types";
import type { ConfiguratorPricing } from "@/lib/configurator/types";
import {
  computeBuildLineItems,
  computeBuildTotal,
  formatPrice,
  getOptionPrice,
} from "@/lib/pricing";

export interface BuildSubmissionLine {
  stepKey: StepKey;
  stepTitle: string;
  optionLabel: string;
  specs: Record<string, string>;
  priceCents: number;
}

export interface BuildSubmission {
  selections: BuildSubmissionLine[];
  lineItems: ReturnType<typeof computeBuildLineItems>;
  totalCents: number;
  totalFormatted: string;
  isComplete: boolean;
}

export function compileBuildSubmission(
  config: BuildConfiguration,
  steps: ConfigStep[],
  pricing: ConfiguratorPricing,
): BuildSubmission {
  const selections: BuildSubmissionLine[] = [];
  for (const key of stepKeys) {
    const step = steps.find((s) => s.id === key);
    if (!step) continue;

    if (key === "basecampPackage") {
      const option = config.basecampPackage;
      if (!option || isBasecampNoneOption(option)) continue;
      for (const item of config.basecampItems) {
        selections.push({
          stepKey: key,
          stepTitle: step.title,
          optionLabel: item.label,
          specs: item.specs ?? {},
          priceCents: getOptionPrice(item.id, pricing),
        });
      }
      continue;
    }

    const option = config[key];
    if (!option) continue;
    selections.push({
      stepKey: key,
      stepTitle: step.title,
      optionLabel: option.label,
      specs: option.specs ?? {},
      priceCents: getOptionPrice(option.id, pricing),
    });
  }

  const lineItems = computeBuildLineItems(config, pricing);
  const totalCents = computeBuildTotal(config, pricing);

  return {
    selections,
    lineItems,
    totalCents,
    totalFormatted: formatPrice(totalCents),
    isComplete: stepKeys.every((key) => config[key] !== null),
  };
}

export type PaymentMethod = "square-invoice";

export interface BuildContactDetails {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
  phone: string;
  notes: string;
  paymentMethod: PaymentMethod;
}

export function getContactFullName(contact: BuildContactDetails): string {
  return `${contact.firstName} ${contact.lastName}`.trim();
}

/** Single-line, human-readable mailing address. */
export function getContactAddress(contact: BuildContactDetails): string {
  const cityStateZip = [contact.city, contact.state]
    .filter(Boolean)
    .join(", ");
  return [
    contact.addressLine1,
    contact.addressLine2,
    [cityStateZip, contact.postalCode].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
}

export interface BuildRequestPayload extends BuildSubmission {
  contact: BuildContactDetails;
  paymentMethod: PaymentMethod;
  squareInvoice: {
    provider: "square";
  };
  submittedAt: string;
}

export function createBuildRequestPayload(
  config: BuildConfiguration,
  contact: BuildContactDetails,
  steps: ConfigStep[],
  pricing: ConfiguratorPricing,
): BuildRequestPayload {
  return {
    ...compileBuildSubmission(config, steps, pricing),
    contact,
    paymentMethod: contact.paymentMethod,
    squareInvoice: {
      provider: "square",
    },
    submittedAt: new Date().toISOString(),
  };
}
