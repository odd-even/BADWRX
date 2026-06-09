"use client";

import { useId, useRef } from "react";
import { birthDateMax, birthDateMin, formatBirthDateDisplay } from "@/lib/birth-date";

interface BirthDatePickerProps {
  value: string;
  onChange: (isoDate: string) => void;
  id?: string;
  label?: string;
}

export function BirthDatePicker({
  value,
  onChange,
  id,
  label = "Date of birth",
}: BirthDatePickerProps) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  }

  return (
    <div className="block">
      <label htmlFor={fieldId} className="text-xs uppercase tracking-widest text-white-muted">
        {label}
      </label>

      <div className="relative mt-1">
        <input
          ref={inputRef}
          id={fieldId}
          type="date"
          value={value}
          min={birthDateMin()}
          max={birthDateMax()}
          onChange={(event) => onChange(event.target.value)}
          onClick={openPicker}
          className="birth-date-input w-full appearance-none border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition hover:border-white/25 focus:border-red [color-scheme:dark]"
          aria-label={label}
        />
      </div>

      {value ? (
        <p className="mt-2 text-xs text-white-muted">
          {formatBirthDateDisplay(value)}
        </p>
      ) : (
        <p className="mt-2 text-xs text-white-muted">
          Tap to open the date picker
        </p>
      )}
    </div>
  );
}
