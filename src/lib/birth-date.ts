export const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const MONTH_LABELS = [
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
] as const;

export function parseIsoDate(value: string): {
  year: number;
  month: number;
  day: number;
} | null {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

export function daysInMonth(year: number, month: number): number {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

export function birthYearOptions(today = new Date()): number[] {
  const newest = today.getFullYear() - YOUNGEST_YEARS_BACK;
  const oldest = today.getFullYear() - OLDEST_YEARS_BACK;
  const years: number[] = [];
  for (let year = newest; year >= oldest; year -= 1) {
    years.push(year);
  }
  return years;
}

export function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatBirthDateDisplay(value: string): string {
  const parts = parseIsoDate(value);
  if (!parts) return "";
  const { year, month, day } = parts;
  return `${MONTH_LABELS[month - 1]} ${day}, ${year}`;
}

const OLDEST_YEARS_BACK = 95;
const YOUNGEST_YEARS_BACK = 10;

/** Oldest selectable birth date (95 years ago). */
export function birthDateMin(today = new Date()): string {
  const year = today.getFullYear() - OLDEST_YEARS_BACK;
  return `${year}-01-01`;
}

/** Youngest selectable birth date (10 years ago). */
export function birthDateMax(today = new Date()): string {
  const year = today.getFullYear() - YOUNGEST_YEARS_BACK;
  return `${year}-12-31`;
}
