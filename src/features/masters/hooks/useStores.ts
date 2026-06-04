import { useQuery } from '@tanstack/react-query';
import { storesQueryOptions, type StoreRow, type StoreListResponse } from '../api/stores';

// The SDK mutator wraps every response as { data, status, headers }; unwrap it
// here the same way the other admin features do.
interface StoresEnvelope {
  data: StoreListResponse;
  status: number;
}

export function useStores(search?: string) {
  const query = useQuery(storesQueryOptions(search));
  const envelope = query.data as StoresEnvelope | undefined;
  const stores: StoreRow[] = envelope?.data.results ?? [];

  return {
    stores,
    count: envelope?.data.count ?? 0,
    isLoading: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
  };
}
