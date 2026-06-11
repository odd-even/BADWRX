import {
  isValidCity,
  isValidEmail,
  isValidFullName,
  isValidPhone,
  isValidStreetAddress,
  isValidUsPostalCode,
  isValidUsState,
  normalizeUsState,
} from "@/lib/contact-validation";
import type {
  UniversityRegistrationInput,
  UniversityRegistrationPayload,
} from "@/lib/university-registrations/types";

export type UniversityRegistrationField =
  | "name"
  | "email"
  | "phone"
  | "addressLine1"
  | "city"
  | "state"
  | "postalCode";

export type UniversityRegistrationFieldErrors = Partial<
  Record<UniversityRegistrationField, string>
>;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateUniversityRegistrationBody(body: unknown):
  | {
      ok: true;
      input: UniversityRegistrationInput;
      fieldErrors: UniversityRegistrationFieldErrors;
    }
  | {
      ok: false;
      error: string;
      fieldErrors: UniversityRegistrationFieldErrors;
    } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object", fieldErrors: {} };
  }

  const raw = body as Record<string, unknown>;
  const courseRaw = raw.course;

  if (!courseRaw || typeof courseRaw !== "object") {
    return { ok: false, error: "Missing course details", fieldErrors: {} };
  }

  const course = courseRaw as Record<string, unknown>;
  const slug = readString(course.slug);
  const title = readString(course.title);

  if (!slug || !title) {
    return { ok: false, error: "Missing course details", fieldErrors: {} };
  }

  const fieldErrors: UniversityRegistrationFieldErrors = {};
  const name = readString(raw.name);
  const addressLine1 = readString(raw.addressLine1);
  const addressLine2 = readString(raw.addressLine2);
  const city = readString(raw.city);
  const state = readString(raw.state);
  const postalCode = readString(raw.postalCode);
  const email = readString(raw.email);
  const phone = readString(raw.phone);
  const message = readString(raw.message);

  if (!name) {
    fieldErrors.name = "Full name is required";
  } else if (!isValidFullName(name)) {
    fieldErrors.name = "Enter a valid full name";
  }

  if (!addressLine1) {
    fieldErrors.addressLine1 = "Street address is required";
  } else if (!isValidStreetAddress(addressLine1)) {
    fieldErrors.addressLine1 = "Enter a valid street address";
  }

  if (!city) {
    fieldErrors.city = "City is required";
  } else if (!isValidCity(city)) {
    fieldErrors.city = "Enter a valid city";
  }

  if (!state) {
    fieldErrors.state = "State is required";
  } else if (!isValidUsState(state)) {
    fieldErrors.state = "Enter a valid US state (e.g. MS or Mississippi)";
  }

  if (!postalCode) {
    fieldErrors.postalCode = "ZIP code is required";
  } else if (!isValidUsPostalCode(postalCode)) {
    fieldErrors.postalCode = "Enter a valid US ZIP code (12345 or 12345-6789)";
  }

  if (!email) {
    fieldErrors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    fieldErrors.email = "Enter a valid email address";
  }

  if (!phone) {
    fieldErrors.phone = "Phone number is required";
  } else if (!isValidPhone(phone)) {
    fieldErrors.phone = "Enter a valid US phone number (10 digits)";
  }

  const firstError =
    fieldErrors.name ??
    fieldErrors.addressLine1 ??
    fieldErrors.city ??
    fieldErrors.state ??
    fieldErrors.postalCode ??
    fieldErrors.email ??
    fieldErrors.phone;

  if (firstError) {
    return { ok: false, error: firstError, fieldErrors };
  }

  return {
    ok: true,
    fieldErrors,
    input: {
      course: { slug, title },
      name,
      addressLine1,
      addressLine2,
      city,
      state: normalizeUsState(state)!,
      postalCode,
      email,
      phone,
      message,
    },
  };
}

export function createUniversityRegistrationPayload(
  input: UniversityRegistrationInput,
  registrationId: string,
): UniversityRegistrationPayload {
  return {
    registrationId,
    submittedAt: new Date().toISOString(),
    course: input.course,
    name: input.name,
    addressLine1: input.addressLine1,
    addressLine2: input.addressLine2?.trim() ?? "",
    city: input.city,
    state: input.state,
    postalCode: input.postalCode,
    email: input.email,
    phone: input.phone,
    message: input.message?.trim() ?? "",
  };
}

export function formatUniversityRegistrationAddress(
  payload: Pick<
    UniversityRegistrationPayload,
    "addressLine1" | "addressLine2" | "city" | "state" | "postalCode"
  >,
): string {
  const lines = [
    payload.addressLine1,
    payload.addressLine2,
    `${payload.city}, ${payload.state} ${payload.postalCode}`,
  ].filter(Boolean);

  return lines.join("\n");
}
