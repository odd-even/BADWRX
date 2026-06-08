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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function AgeVerification() {
  const [checked, setChecked] = useState(false);
  const [verified, setVerified] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
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

  useEffect(() => {
    if (!year || !month || !day) return;
    const maxDay = new Date(Number(year), Number(month), 0).getDate();
    if (Number(day) > maxDay) setDay("");
  }, [year, month, day]);

  if (!checked || verified) return null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!year || !month || !day) {
      setError("Select your full date of birth.");
      return;
    }

    const dob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
    String(currentYear - i),
  );
  const daysInMonth =
    year && month
      ? new Date(Number(year), Number(month), 0).getDate()
      : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));

  const selectClass =
    "mt-1 w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-red [color-scheme:dark]";

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
        <p className="mt-4 text-center text-sm text-white-muted leading-relaxed">
          This site contains information about firearms. Enter your date of birth
          to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <span className="text-xs uppercase tracking-widest text-white-muted">
            Date of birth
          </span>
          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-white-muted/70">
                Year
              </span>
              <select
                required
                value={year}
                onChange={(event) => {
                  setYear(event.target.value);
                  setError(null);
                }}
                className={selectClass}
              >
                <option value="" disabled>
                  Year
                </option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-white-muted/70">
                Month
              </span>
              <select
                required
                value={month}
                onChange={(event) => {
                  setMonth(event.target.value);
                  setError(null);
                }}
                className={selectClass}
              >
                <option value="" disabled>
                  Month
                </option>
                {MONTHS.map((label, index) => (
                  <option key={label} value={String(index + 1)}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-white-muted/70">
                Day
              </span>
              <select
                required
                value={day}
                onChange={(event) => {
                  setDay(event.target.value);
                  setError(null);
                }}
                className={selectClass}
              >
                <option value="" disabled>
                  Day
                </option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>

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
