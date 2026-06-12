import { useQuery } from '@tanstack/react-query';
import { getAdminListStoresQueryOptions } from '../../../sdk/inventory';
import type { StoreOut } from '../../../sdk/schemas';

interface StoresEnvelope {
  data: { items: StoreOut[]; total: number };
  status: number;
}

export function useStores() {
  const query = useQuery(getAdminListStoresQueryOptions());
  const envelope = query.data as StoresEnvelope | undefined;
  return {
    stores: envelope?.data.items ?? [],
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}
