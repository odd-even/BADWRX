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
  const name = details.name?.trim();
  const email = details.email?.trim();

  if (!name) {
    return { ok: false, error: "Name is required" };
  }

  if (!email || !isValidEmail(email)) {
    return { ok: false, error: "A valid email is required" };
  }

  if (
    details.paymentMethod !== "square-card" &&
    details.paymentMethod !== "square-ach"
  ) {
    return { ok: false, error: "Invalid payment method" };
  }

  return {
    ok: true,
    config: config as BuildConfiguration,
    contact: {
      name,
      email,
      phone: details.phone?.trim() ?? "",
      notes: details.notes?.trim() ?? "",
      paymentMethod: details.paymentMethod,
    },
  };
}
