import type { BuildContactDetails } from "@/lib/build-submission";
import type { MerchShippingAddress } from "@/lib/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const US_POSTAL_PATTERN = /^\d{5}(?:-\d{4})?$/;
const PERSON_NAME_PATTERN = /^[A-Za-z][A-Za-z\s'.-]{0,59}$/;
const FULL_NAME_PATTERN = /^[A-Za-z][A-Za-z\s'.-]{0,79}$/;
const CITY_PATTERN = /^[A-Za-z][A-Za-z\s'.-]{0,59}$/;
const STREET_PATTERN = /^[A-Za-z0-9][A-Za-z0-9\s#.,/'-]{2,119}$/;

/** US states, DC, territories, and military post codes accepted for shipping. */
const US_STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
  PR: "Puerto Rico",
  GU: "Guam",
  VI: "Virgin Islands",
  AS: "American Samoa",
  MP: "Northern Mariana Islands",
  AA: "Armed Forces Americas",
  AE: "Armed Forces Europe",
  AP: "Armed Forces Pacific",
};

const US_STATE_NAME_TO_CODE = Object.fromEntries(
  Object.entries(US_STATE_NAMES).map(([code, name]) => [name.toLowerCase(), code]),
);

export const US_SHIPPING_COUNTRY = "United States";

const US_COUNTRY_ALIASES = new Set([
  "us",
  "usa",
  "u.s.",
  "u.s.a.",
  "united states",
  "united states of america",
]);

export function normalizeUsState(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const upper = trimmed.toUpperCase();
  if (US_STATE_NAMES[upper]) return upper;

  const byName = US_STATE_NAME_TO_CODE[trimmed.toLowerCase()];
  if (byName) return byName;

  if (/^district of columbia$/i.test(trimmed)) return "DC";

  return null;
}

export function isValidUsState(value: string): boolean {
  return normalizeUsState(value) !== null;
}

export function normalizeUsCountry(value: string): string | null {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalized) return null;
  return US_COUNTRY_ALIASES.has(normalized) ? US_SHIPPING_COUNTRY : null;
}

export function isValidUsCountry(value: string): boolean {
  return normalizeUsCountry(value) !== null;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** US phone — 10 digits, or 11 with leading country code 1. */
export function isValidPhone(value: string): boolean {
  const digits = normalizePhoneDigits(value);
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith("1")) return true;
  return false;
}

export function isValidUsPostalCode(value: string): boolean {
  return US_POSTAL_PATTERN.test(value.trim());
}

export function isValidFullName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && FULL_NAME_PATTERN.test(trimmed);
}

export function isValidPersonName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && PERSON_NAME_PATTERN.test(trimmed);
}

export function isValidStreetAddress(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 3 && STREET_PATTERN.test(trimmed);
}

export function isValidCity(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 2 && CITY_PATTERN.test(trimmed);
}

export type BuildContactField = keyof BuildContactDetails;

export type BuildContactFieldErrors = Partial<
  Record<BuildContactField, string>
>;

export function validateBuildContact(
  raw: Partial<BuildContactDetails>,
):
  | { ok: true; contact: BuildContactDetails; fieldErrors: BuildContactFieldErrors }
  | { ok: false; error: string; fieldErrors: BuildContactFieldErrors } {
  const fieldErrors: BuildContactFieldErrors = {};

  const firstName = raw.firstName?.trim() ?? "";
  const lastName = raw.lastName?.trim() ?? "";
  const addressLine1 = raw.addressLine1?.trim() ?? "";
  const addressLine2 = raw.addressLine2?.trim() ?? "";
  const city = raw.city?.trim() ?? "";
  const state = raw.state?.trim() ?? "";
  const postalCode = raw.postalCode?.trim() ?? "";
  const email = raw.email?.trim() ?? "";
  const phone = raw.phone?.trim() ?? "";
  const notes = raw.notes?.trim() ?? "";

  if (!firstName) {
    fieldErrors.firstName = "First name is required";
  } else if (!isValidPersonName(firstName)) {
    fieldErrors.firstName = "Enter a valid first name";
  }

  if (!lastName) {
    fieldErrors.lastName = "Last name is required";
  } else if (!isValidPersonName(lastName)) {
    fieldErrors.lastName = "Enter a valid last name";
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

  if (raw.paymentMethod !== "square-invoice") {
    fieldErrors.paymentMethod = "Invalid payment method";
  }

  const firstError =
    fieldErrors.firstName ??
    fieldErrors.lastName ??
    fieldErrors.email ??
    fieldErrors.phone ??
    fieldErrors.addressLine1 ??
    fieldErrors.city ??
    fieldErrors.state ??
    fieldErrors.postalCode ??
    fieldErrors.paymentMethod;

  if (firstError) {
    return { ok: false, error: firstError, fieldErrors };
  }

  const normalizedState = normalizeUsState(state)!;

  return {
    ok: true,
    fieldErrors,
    contact: {
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      state: normalizedState,
      postalCode,
      email,
      phone,
      notes,
      paymentMethod: "square-invoice",
    },
  };
}

export type MerchCheckoutFieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  line1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export function validateMerchContact(input: {
  name?: string;
  email?: string;
  phone?: string;
}): { fieldErrors: MerchCheckoutFieldErrors; error?: string } {
  const fieldErrors: MerchCheckoutFieldErrors = {};
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";

  if (!name) {
    fieldErrors.name = "Name is required";
  } else if (!isValidFullName(name)) {
    fieldErrors.name = "Enter a valid name";
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

  const error =
    fieldErrors.name ??
    fieldErrors.email ??
    fieldErrors.phone;

  return { fieldErrors, error };
}

export function validateMerchShippingAddress(
  shipping: Partial<MerchShippingAddress>,
): { fieldErrors: MerchCheckoutFieldErrors; error?: string } {
  const fieldErrors: MerchCheckoutFieldErrors = {};
  const line1 = shipping.line1?.trim() ?? "";
  const city = shipping.city?.trim() ?? "";
  const state = shipping.state?.trim() ?? "";
  const postalCode = shipping.postalCode?.trim() ?? "";
  const country = shipping.country?.trim() ?? "";

  if (!line1) {
    fieldErrors.line1 = "Street address is required";
  } else if (!isValidStreetAddress(line1)) {
    fieldErrors.line1 = "Enter a valid street address";
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

  if (!country) {
    fieldErrors.country = "Country is required";
  } else if (!isValidUsCountry(country)) {
    fieldErrors.country = "We only ship within the United States";
  }

  const error =
    fieldErrors.line1 ??
    fieldErrors.city ??
    fieldErrors.state ??
    fieldErrors.postalCode ??
    fieldErrors.country;

  return { fieldErrors, error };
}

export function normalizeMerchShippingAddress(
  shipping: MerchShippingAddress,
): MerchShippingAddress {
  return {
    ...shipping,
    line1: shipping.line1.trim(),
    line2: shipping.line2?.trim(),
    city: shipping.city.trim(),
    state: normalizeUsState(shipping.state.trim())!,
    postalCode: shipping.postalCode.trim(),
    country: normalizeUsCountry(shipping.country.trim())!,
  };
}
