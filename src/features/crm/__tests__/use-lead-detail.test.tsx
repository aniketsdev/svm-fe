import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Reproduce the exact state of a background refetch: data already present
// (initialData) AND a fetch in flight (never-resolving queryFn, staleTime 0).
// During this state react-query reports isPending=false, isFetching=true.
const neverResolves = vi.fn(() => new Promise(() => {}));
vi.mock('../api/crm', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/crm')>();
  return {
    ...actual,
    leadDetailQueryOptions: (leadUuid: string) => ({
      queryKey: ['lead-detail-test', leadUuid],
      queryFn: neverResolves,
      initialData: { data: { uuid: leadUuid, contact_name: 'Ada' } },
      staleTime: 0,
    }),
  };
});

import { useLeadDetail } from '../hooks/useLeadDetail';

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useLeadDetail', () => {
  it('keeps isLoading false during a background refetch so the page (and its tabs) stay mounted', () => {
    const { result } = renderHook(() => useLeadDetail('lead-1'), { wrapper });

    // Data is present even though a fetch is in flight.
    expect(result.current.lead).toBeDefined();
    // The detail page renders a full-page spinner (unmounting LeadActivityTabs
    // and resetting the active tab to Notes) whenever isLoading is true, so a
    // background refetch must NOT report isLoading.
    expect(result.current.isLoading).toBe(false);
  });
});
