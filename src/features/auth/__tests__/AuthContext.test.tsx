/**
 * Tests for the cookie-bootstrap AuthContext.
 *
 * Verifies:
 *  - `/auth/me` is the bootstrap source of truth (no localStorage reads).
 *  - 200 populates the user; 401 clears it.
 *  - `signIn(user)` and `signOut()` are imperative cache updates.
 *  - The provider does not read or write `localStorage`.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import type { AuthUser } from '../context/AuthContext';

const TEST_USER: AuthUser = {
  uuid: '77777777-7777-7777-7777-777777777777',
  email: 'jane@example.com',
  role: 'user',
  is_active: true,
};

const ORIGINAL_FETCH = globalThis.fetch;

function mockFetch(status: number, body: unknown) {
  return vi.fn(async () => {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  });
}

function makeWrapper(): React.FC<{ children: ReactNode }> {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={qc}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

// We assert in some tests that the provider doesn't touch localStorage.
// Spies are reset between tests.
let localStorageGetSpy: ReturnType<typeof vi.spyOn>;
let localStorageSetSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  localStorage.clear();
  localStorageGetSpy = vi.spyOn(Storage.prototype, 'getItem');
  localStorageSetSpy = vi.spyOn(Storage.prototype, 'setItem');
});

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  vi.restoreAllMocks();
});

describe('AuthProvider — /auth/me bootstrap', () => {
  it('populates the user when /auth/me returns 200', async () => {
    globalThis.fetch = mockFetch(200, TEST_USER) as unknown as typeof fetch;
    const wrapper = makeWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    expect(result.current.user).toEqual(TEST_USER);
    expect(result.current.isLoading).toBe(false);
  });

  it('treats 401 as unauthenticated and clears loading', async () => {
    globalThis.fetch = mockFetch(401, { detail: 'Invalid credentials' }) as unknown as typeof fetch;
    const wrapper = makeWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('never reads or writes localStorage', async () => {
    globalThis.fetch = mockFetch(200, TEST_USER) as unknown as typeof fetch;
    const wrapper = makeWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    // Only allow getItem reads from outside the provider (vitest's own internals).
    // The provider itself must not have any reads keyed by an auth value.
    const authKeys = ['userData', 'userId', 'email', 'firstName', 'lastName', 'authToken'];
    for (const key of authKeys) {
      expect(localStorageGetSpy).not.toHaveBeenCalledWith(key);
      expect(localStorageSetSpy).not.toHaveBeenCalledWith(
        key,
        expect.anything(),
      );
    }
  });
});

describe('AuthProvider — imperative signIn / signOut', () => {
  it('signIn primes the user without a /auth/me round-trip', async () => {
    // Start with /auth/me 401
    globalThis.fetch = mockFetch(401, { detail: 'Invalid credentials' }) as unknown as typeof fetch;
    const wrapper = makeWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);

    act(() => result.current.signIn(TEST_USER));
    await waitFor(() => expect(result.current.user).toEqual(TEST_USER));
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('signOut clears the in-memory user', async () => {
    globalThis.fetch = mockFetch(200, TEST_USER) as unknown as typeof fetch;
    const wrapper = makeWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    // After signOut, useAuth.user should be cleared. We don't assert on the
    // subsequent invalidate-driven refetch here — that's covered by integration.
    globalThis.fetch = mockFetch(401, { detail: 'Invalid credentials' }) as unknown as typeof fetch;
    act(() => result.current.signOut());

    await waitFor(() => expect(result.current.user).toBeNull());
  });
});

describe('useAuth hook safety', () => {
  it('throws when used outside an AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const qc = new QueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );
    expect(() => renderHook(() => useAuth(), { wrapper })).toThrow(
      'useAuth must be used within an AuthProvider',
    );
    spy.mockRestore();
  });
});
