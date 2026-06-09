"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { brand } from "@/lib/brand";
import {
  AGE_VERIFICATION_STORAGE_KEY,
  isAtLeast18,
  parseBirthDate,
} from "@/lib/age-verification";
import { images } from "@/lib/images";
import { BirthDatePicker } from "@/components/ui/BirthDatePicker";

export function AgeVerification() {
  const [checked, setChecked] = useState(false);
  const [verified, setVerified] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setVerified(localStorage.getItem(AGE_VERIFICATION_STORAGE_KEY) === "true");
    setChecked(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = checked && !verified ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [checked, verified]);

  if (!checked || verified) return null;

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
    setVerified(true);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-verification-title"
    >
      <div className="w-full max-w-md border border-white/10 bg-black-light p-8 shadow-2xl">
        <div className="flex justify-center">
          <Image
            src={images.logos.badge}
            alt={`${brand.short} logo`}
            width={120}
            height={113}
            className="h-40 w-auto"
            priority
          />
        </div>

        <p className="mt-6 text-center text-xs uppercase tracking-widest text-red">
          Age verification
        </p>
        <h1
          id="age-verification-title"
          className="mt-2 text-center text-3xl text-white"
        >
          18 or older
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed text-white-muted">
          This site contains information about firearms. Enter your date of birth
          to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <BirthDatePicker
            value={birthDate}
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
            className="w-full border border-red bg-red py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
          >
            Enter site
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-white-muted/70">
          By entering, you confirm that you are at least 18 years of age and
          legally permitted to view firearm-related content in your jurisdiction.
        </p>
      </div>
    </div>
  );
}
