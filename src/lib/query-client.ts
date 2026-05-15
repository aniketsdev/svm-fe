import { QueryClient } from '@tanstack/react-query';

/**
 * Project-wide TanStack Query client.
 *
 * Defaults chosen for safety:
 *  - staleTime 30s          — avoid request stampedes from tight refetch loops
 *  - refetchOnWindowFocus false — don't surprise the user with unrequested reloads
 *  - retry 1                 — single retry, then surface the error to the UI
 *
 * Feature code may override per-query via useQuery({ ... }).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
