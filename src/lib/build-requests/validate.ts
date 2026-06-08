import type { BuildContactDetails } from "@/lib/build-submission";
import type { BuildConfiguration } from "@/lib/types";

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateBuildSubmissionBody(body: unknown):
  | { ok: true; config: BuildConfiguration; contact: BuildContactDetails }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object" };
  }

  const { config, contact } = body as {
    config?: unknown;
    contact?: unknown;
  };

  if (!config || typeof config !== "object") {
    return { ok: false, error: "Missing build configuration" };
  }

  if (!contact || typeof contact !== "object") {
    return { ok: false, error: "Missing contact details" };
  }

  const details = contact as Partial<BuildContactDetails>;
  const firstName = details.firstName?.trim();
  const lastName = details.lastName?.trim();
  const addressLine1 = details.addressLine1?.trim();
  const city = details.city?.trim();
  const state = details.state?.trim();
  const postalCode = details.postalCode?.trim();
  const email = details.email?.trim();
  const phone = details.phone?.trim();

  if (!firstName) {
    return { ok: false, error: "First name is required" };
  }

  if (!lastName) {
    return { ok: false, error: "Last name is required" };
  }

  if (!addressLine1) {
    return { ok: false, error: "Street address is required" };
  }

  if (!city) {
    return { ok: false, error: "City is required" };
  }

  if (!state) {
    return { ok: false, error: "State is required" };
  }

  if (!postalCode) {
    return { ok: false, error: "ZIP / postal code is required" };
  }

  if (!email || !isValidEmail(email)) {
    return { ok: false, error: "A valid email is required" };
  }

  if (!phone) {
    return { ok: false, error: "Phone number is required" };
  }

  if (details.paymentMethod !== "square-invoice") {
    return { ok: false, error: "Invalid payment method" };
  }

  return {
    ok: true,
    config: config as BuildConfiguration,
    contact: {
      firstName,
      lastName,
      addressLine1,
      addressLine2: details.addressLine2?.trim() ?? "",
      city,
      state,
      postalCode,
      email,
      phone,
      notes: details.notes?.trim() ?? "",
      paymentMethod: details.paymentMethod,
    },
  };
}
