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

export function AgeVerification() {
  const [checked, setChecked] = useState(false);
  const [verified, setVerified] = useState(false);
  const [dob, setDob] = useState("");
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

    const birthDate = parseBirthDate(dob);
    if (!birthDate) {
      setError("Enter a valid date of birth.");
      return;
    }

    if (birthDate > new Date()) {
      setError("Date of birth cannot be in the future.");
      return;
    }

    if (!isAtLeast18(birthDate)) {
      setError("You must be 18 or older to enter this site.");
      return;
    }

    localStorage.setItem(AGE_VERIFICATION_STORAGE_KEY, "true");
    setVerified(true);
  }

  const today = new Date().toISOString().split("T")[0];

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
            className="h-20 w-auto"
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
        <p className="mt-4 text-center text-sm text-white-muted leading-relaxed">
          This site contains information about firearms. Enter your date of birth
          to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              Date of birth
            </span>
            <input
              required
              type="date"
              value={dob}
              max={today}
              min="1900-01-01"
              onChange={(event) => {
                setDob(event.target.value);
                setError(null);
              }}
              className="mt-1 w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-red [color-scheme:dark]"
            />
          </label>

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

        <p className="mt-6 text-center text-xs text-white-muted/70 leading-relaxed">
          By entering, you confirm that you are at least 18 years of age and
          legally permitted to view firearm-related content in your jurisdiction.
        </p>
      </div>
    </div>
  );
}
