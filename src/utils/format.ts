import dayjs from 'dayjs';

const EMPTY = '—';

/** Date as "DD MMM YYYY" (em-dash when empty). */
export function formatDate(value: string | Date | null | undefined): string {
  return value ? dayjs(value).format('DD MMM YYYY') : EMPTY;
}

/** Date + time as "DD MMM YYYY, h:mm A" (em-dash when empty). */
export function formatDateTime(value: string | Date | null | undefined): string {
  return value ? dayjs(value).format('DD MMM YYYY, h:mm A') : EMPTY;
}

/** Joined first/last name (em-dash when both empty). */
export function fullName(
  first: string | null | undefined,
  last: string | null | undefined,
): string {
  const name = [first, last].filter(Boolean).join(' ').trim();
  return name || EMPTY;
}

/** INR currency as "₹1234.00" (em-dash when null/undefined). */
export function formatCurrency(value: number | null | undefined): string {
  return value == null ? EMPTY : `₹${value.toFixed(2)}`;
}

/** Pretty-printed JSON for previews (null when the value is null/undefined). */
export function prettyJson(value: unknown): string | null {
  if (value == null) return null;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/** Parse a text field to a number, or null when blank/invalid. */
export function toNumberOrNull(value: string | null | undefined): number | null {
  if (!value || !value.trim()) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}
