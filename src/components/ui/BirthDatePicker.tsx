"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { formSelectClassName } from "@/lib/form-styles";
import {
  MONTH_LABELS,
  birthYearOptions,
  daysInMonth,
  formatBirthDateDisplay,
  parseIsoDate,
  toIsoDate,
} from "@/lib/birth-date";

interface BirthDatePickerProps {
  value: string;
  onChange: (isoDate: string) => void;
  id?: string;
  label?: string;
}

const selectClassName = `${formSelectClassName} mt-0`;

type DateParts = {
  month: number | "";
  day: number | "";
  year: number | "";
};

function partsFromValue(value: string): DateParts {
  const parsed = parseIsoDate(value);
  if (!parsed) {
    return { month: "", day: "", year: "" };
  }
  return parsed;
}

export function BirthDatePicker({
  value,
  onChange,
  id,
  label = "Date of birth",
}: BirthDatePickerProps) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const [parts, setParts] = useState<DateParts>(() => partsFromValue(value));

  useEffect(() => {
    setParts(partsFromValue(value));
  }, [value]);

  const years = useMemo(() => birthYearOptions(), []);
  const maxDay = useMemo(
    () =>
      parts.year && parts.month
        ? daysInMonth(parts.year, parts.month)
        : 31,
    [parts.month, parts.year],
  );

  const dayOptions = useMemo(
    () => Array.from({ length: maxDay }, (_, index) => index + 1),
    [maxDay],
  );

  function emit(next: DateParts) {
    if (next.month && next.day && next.year) {
      onChange(toIsoDate(next.year, next.month, next.day));
      return;
    }
    onChange("");
  }

  function updatePart(part: keyof DateParts, raw: string) {
    const parsed = raw === "" ? "" : Number(raw);
    const next: DateParts = { ...parts, [part]: parsed };

    if (
      next.day &&
      next.month &&
      next.year &&
      next.day > daysInMonth(next.year, next.month)
    ) {
      next.day = daysInMonth(next.year, next.month);
    }

    setParts(next);
    emit(next);
  }

  const monthId = `${fieldId}-month`;
  const dayId = `${fieldId}-day`;
  const yearId = `${fieldId}-year`;

  return (
    <fieldset className="block">
      <legend className="text-xs uppercase tracking-widest text-white-muted">
        {label}
      </legend>

      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-12">
        <label className="col-span-2 block sm:col-span-6">
          <span className="sr-only">Month</span>
          <select
            id={monthId}
            value={parts.month}
            onChange={(event) => updatePart("month", event.target.value)}
            className={selectClassName}
            aria-label="Birth month"
          >
            <option value="">Month</option>
            {MONTH_LABELS.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="col-span-1 block sm:col-span-3">
          <span className="sr-only">Day</span>
          <select
            id={dayId}
            value={parts.day}
            onChange={(event) => updatePart("day", event.target.value)}
            className={selectClassName}
            aria-label="Birth day"
          >
            <option value="">Day</option>
            {dayOptions.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>

        <label className="col-span-1 block sm:col-span-3">
          <span className="sr-only">Year</span>
          <select
            id={yearId}
            value={parts.year}
            onChange={(event) => updatePart("year", event.target.value)}
            className={selectClassName}
            aria-label="Birth year"
          >
            <option value="">Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      {value ? (
        <p className="mt-3 text-sm text-white" aria-live="polite">
          {formatBirthDateDisplay(value)}
        </p>
      ) : (
        <p className="mt-3 text-xs text-white-muted">
          Select month, day, and year.
        </p>
      )}
    </fieldset>
  );
}
