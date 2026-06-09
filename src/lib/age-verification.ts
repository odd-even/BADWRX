export const AGE_VERIFICATION_STORAGE_KEY = "badwrx-age-verified";

/** Dev only: set NEXT_PUBLIC_FORCE_AGE_GATE=true or open site with ?age-gate */
export function isAgeGateForced(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  if (process.env.NEXT_PUBLIC_FORCE_AGE_GATE === "true") return true;
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("age-gate");
}

export function isAtLeast18(birthDate: Date, today = new Date()): boolean {
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
}

export function parseBirthDate(value: string): Date | null {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  return birthDate;
}
