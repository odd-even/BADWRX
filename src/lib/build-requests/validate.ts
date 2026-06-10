import { validateBuildContact } from "@/lib/contact-validation";
import type { BuildContactDetails } from "@/lib/build-submission";
import type { BuildConfiguration } from "@/lib/types";

export { isValidEmail } from "@/lib/contact-validation";

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

  const validated = validateBuildContact(contact as Partial<BuildContactDetails>);
  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  return {
    ok: true,
    config: config as BuildConfiguration,
    contact: validated.contact,
  };
}
