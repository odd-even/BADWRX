"use client";

import { useEffect, useState } from "react";
import {
  AGE_VERIFICATION_STORAGE_KEY,
  isAgeGateForced,
  isAtLeast18,
  parseBirthDate,
} from "@/lib/age-verification";
import { blurActiveElement } from "@/lib/modal-body-lock";
import { BirthDatePicker } from "@/components/ui/BirthDatePicker";
import { GateModal } from "@/components/layout/GateModal";

export function AgeVerification() {
  const [checked, setChecked] = useState(false);
  const [verified, setVerified] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAgeGateForced()) {
      setVerified(false);
      setChecked(true);
      return;
    }
    setVerified(localStorage.getItem(AGE_VERIFICATION_STORAGE_KEY) === "true");
    setChecked(true);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!birthDate) {
      setError("Select your date of birth.");
      return;
    }

    const parsed = parseBirthDate(birthDate);
    if (!parsed) {
      setError("Enter a valid date of birth.");
      return;
    }

    if (parsed > new Date()) {
      setError("Date of birth cannot be in the future.");
      return;
    }

    if (!isAtLeast18(parsed)) {
      setError("You must be 18 or older to enter this site.");
      return;
    }

    localStorage.setItem(AGE_VERIFICATION_STORAGE_KEY, "true");
    blurActiveElement();
    setVerified(true);
  }

  return (
    <GateModal
      open={checked && !verified}
      eyebrow="Age verification"
      title="18 or older"
      titleId="age-verification-title"
      description="This site contains information about firearms. Enter your date of birth to continue."
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8">
        <BirthDatePicker
          value={birthDate}
          compact
          onChange={(value) => {
            setBirthDate(value);
            setError(null);
          }}
        />

        {error && (
          <p className="text-sm text-red" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full border border-red bg-red py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark sm:py-4"
        >
          Enter site
        </button>
      </form>

      <p className="mt-4 text-center text-xs leading-relaxed text-white-muted/70 sm:mt-6">
        By entering, you confirm that you are at least 18 years of age and
        legally permitted to view firearm-related content in your jurisdiction.
      </p>
    </GateModal>
  );
}
