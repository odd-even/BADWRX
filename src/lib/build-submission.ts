import { configuratorSteps, stepKeys, type StepKey } from "@/data/configurator-options";
import type { BuildConfiguration } from "@/lib/types";
import {
  computeBuildLineItems,
  computeBuildTotal,
  computeDepositCents,
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
  depositCents: number;
  totalFormatted: string;
  depositFormatted: string;
  isComplete: boolean;
}

export function compileBuildSubmission(
  config: BuildConfiguration,
): BuildSubmission {
  const selections: BuildSubmissionLine[] = stepKeys
    .map((key) => {
      const option = config[key];
      if (!option) return null;
      const step = configuratorSteps.find((s) => s.id === key);
      if (!step) return null;
      return {
        stepKey: key,
        stepTitle: step.title,
        optionLabel: option.label,
        specs: option.specs ?? {},
        priceCents: getOptionPrice(option.id),
      };
    })
    .filter((line): line is BuildSubmissionLine => line !== null);

  const lineItems = computeBuildLineItems(config);
  const totalCents = computeBuildTotal(config);
  const depositCents = computeDepositCents(totalCents);

  return {
    selections,
    lineItems,
    totalCents,
    depositCents,
    totalFormatted: formatPrice(totalCents),
    depositFormatted: formatPrice(depositCents),
    isComplete: selections.length === stepKeys.length,
  };
}

export type PaymentMethod = "square-card" | "square-ach";

/** Both deposit options are fulfilled via a Square invoice */
export type SquareInvoiceMethod = "card" | "ach";

export function getSquareInvoiceMethod(
  paymentMethod: PaymentMethod,
): SquareInvoiceMethod {
  return paymentMethod === "square-ach" ? "ach" : "card";
}

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
  /** Square Invoices API — preferred payment method on the invoice link */
  squareInvoice: {
    provider: "square";
    method: SquareInvoiceMethod;
  };
  submittedAt: string;
}

export function createBuildRequestPayload(
  config: BuildConfiguration,
  contact: BuildContactDetails,
): BuildRequestPayload {
  return {
    ...compileBuildSubmission(config),
    contact,
    paymentMethod: contact.paymentMethod,
    squareInvoice: {
      provider: "square",
      method: getSquareInvoiceMethod(contact.paymentMethod),
    },
    submittedAt: new Date().toISOString(),
  };
}
