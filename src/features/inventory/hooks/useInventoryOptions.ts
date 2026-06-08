import { useQuery } from '@tanstack/react-query';
import { getAdminListStoresQueryOptions } from '../../../sdk/inventory';
import type { StoreOut } from '../../../sdk/schemas';

/** Stores for the inventory filter selects. */
export function useInventoryOptions() {
  const stores = useQuery(getAdminListStoresQueryOptions());
  const envelope = stores.data as { data?: { items?: StoreOut[] } } | undefined;

  return {
    stores: envelope?.data?.items ?? [],
  };
}
