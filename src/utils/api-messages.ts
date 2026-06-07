import { ApiError } from '../api/client';

/**
 * Message to show for a failed API call. Prefers the backend's `detail`
 * (this API returns `{ detail: "…" }` on domain errors); otherwise a fallback.
 */
export function errorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error instanceof ApiError) {
    const detail = (error as unknown as { body?: { detail?: unknown } }).body?.detail;
    if (typeof detail === 'string') return detail;
  }
  return fallback;
}

/**
 * Message to show for a successful mutation. Prefers the backend's `message`
 * if present (the SDK wraps responses as `{ data, status }`); otherwise the
 * given fallback. Centralised so the day the backend returns success messages,
 * every toast picks them up automatically.
 */
export function successMessage(response: unknown, fallback: string): string {
  const message = (response as { data?: { message?: unknown } } | undefined)?.data?.message;
  return typeof message === 'string' ? message : fallback;
}
