"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { formInputClassName } from "@/lib/form-styles";
import {
  MONTH_LABELS,
  MONTH_SHORT,
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

type Panel = "month" | "day" | "year" | null;

type DateParts = {
  month: number | "";
  day: number | "";
  year: number | "";
};

const triggerClassName = `${formInputClassName} mt-0 flex w-full items-center justify-between gap-2 text-left`;

const cellClassName =
  "bg-black-light px-0.5 py-2 text-center text-xs text-white transition hover:bg-red/10 hover:text-red sm:px-1 sm:text-sm";

const cellSelectedClassName = "bg-red/10 text-white ring-1 ring-inset ring-red";

const gridPanelClassName =
  "grid gap-px bg-white/10";

function partsFromValue(value: string): DateParts {
  const parsed = parseIsoDate(value);
  if (!parsed) {
    return { month: "", day: "", year: "" };
  }
  return parsed;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`h-4 w-4 shrink-0 text-white-muted transition ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

export function BirthDatePicker({
  value,
  onChange,
  id,
  label = "Date of birth",
}: BirthDatePickerProps) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const containerRef = useRef<HTMLDivElement>(null);
  const [parts, setParts] = useState<DateParts>(() => partsFromValue(value));
  const [openPanel, setOpenPanel] = useState<Panel>(null);

  useEffect(() => {
    setParts(partsFromValue(value));
  }, [value]);

  useEffect(() => {
    if (!openPanel) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenPanel(null);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openPanel]);

  useEffect(() => {
    if (openPanel !== "year" || !parts.year) return;
    const selected = containerRef.current?.querySelector(
      `[data-year="${parts.year}"]`,
    );
    selected?.scrollIntoView({ block: "center" });
  }, [openPanel, parts.year]);

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

  function updatePart(part: keyof DateParts, nextValue: number) {
    const next: DateParts = { ...parts, [part]: nextValue };

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
    setOpenPanel(null);
  }

  function togglePanel(panel: Panel) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  const monthLabel = parts.month ? MONTH_LABELS[parts.month - 1] : "Month";
  const dayLabel = parts.day ? String(parts.day) : "Day";
  const yearLabel = parts.year ? String(parts.year) : "Year";

  return (
    <fieldset className="block">
      <legend className="text-xs uppercase tracking-widest text-white-muted">
        {label}
      </legend>

      <div ref={containerRef} className="relative mt-2">
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            id={`${fieldId}-month`}
            aria-expanded={openPanel === "month"}
            aria-haspopup="dialog"
            aria-controls={`${fieldId}-month-panel`}
            onClick={() => togglePanel("month")}
            className={triggerClassName}
          >
            <span className={parts.month ? "text-white" : "text-white-muted"}>
              {monthLabel}
            </span>
            <Chevron open={openPanel === "month"} />
          </button>

          <button
            type="button"
            id={`${fieldId}-day`}
            aria-expanded={openPanel === "day"}
            aria-haspopup="dialog"
            aria-controls={`${fieldId}-day-panel`}
            onClick={() => togglePanel("day")}
            className={triggerClassName}
          >
            <span className={parts.day ? "text-white" : "text-white-muted"}>
              {dayLabel}
            </span>
            <Chevron open={openPanel === "day"} />
          </button>

          <button
            type="button"
            id={`${fieldId}-year`}
            aria-expanded={openPanel === "year"}
            aria-haspopup="dialog"
            aria-controls={`${fieldId}-year-panel`}
            onClick={() => togglePanel("year")}
            className={triggerClassName}
          >
            <span className={parts.year ? "text-white" : "text-white-muted"}>
              {yearLabel}
            </span>
            <Chevron open={openPanel === "year"} />
          </button>
        </div>

        {openPanel === "month" ? (
          <div
            id={`${fieldId}-month-panel`}
            role="dialog"
            aria-label="Choose month"
            className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-20 border border-white/10 bg-black-light p-2 shadow-2xl"
          >
            <div className={`${gridPanelClassName} grid-cols-4`}>
              {MONTH_SHORT.map((name, index) => {
                const month = index + 1;
                const selected = parts.month === month;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => updatePart("month", month)}
                    className={`${cellClassName} ${selected ? cellSelectedClassName : ""}`}
                    aria-pressed={selected}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {openPanel === "day" ? (
          <div
            id={`${fieldId}-day-panel`}
            role="dialog"
            aria-label="Choose day"
            className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-20 border border-white/10 bg-black-light p-2 shadow-2xl"
          >
            <div className={`${gridPanelClassName} grid-cols-7`}>
              {dayOptions.map((day) => {
                const selected = parts.day === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => updatePart("day", day)}
                    className={`${cellClassName} ${selected ? cellSelectedClassName : ""}`}
                    aria-pressed={selected}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {openPanel === "year" ? (
          <div
            id={`${fieldId}-year-panel`}
            role="dialog"
            aria-label="Choose year"
            className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-20 border border-white/10 bg-black-light p-2 shadow-2xl"
          >
            <div className={`${gridPanelClassName} max-h-48 grid-cols-4 overflow-y-auto pr-1 [scrollbar-width:thin]`}>
              {years.map((year) => {
                const selected = parts.year === year;
                return (
                  <button
                    key={year}
                    type="button"
                    data-year={year}
                    onClick={() => updatePart("year", year)}
                    className={`${cellClassName} ${selected ? cellSelectedClassName : ""}`}
                    aria-pressed={selected}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {value ? (
        <p className="mt-3 text-sm text-white" aria-live="polite">
          {formatBirthDateDisplay(value)}
        </p>
      ) : (
        <p className="mt-3 text-xs text-white-muted">
          Tap month, day, and year to choose from the grid.
        </p>
      )}
    </fieldset>
  );
}
