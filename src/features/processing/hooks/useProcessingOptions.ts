import { useQuery } from '@tanstack/react-query';
import {
  getAdminListMaterialsQueryOptions,
  getAdminListStoresQueryOptions,
} from '../../../sdk/inventory';
import type { MaterialOut, StoreOut } from '../../../sdk/schemas';

/** Materials + stores for the processing-order selects. */
export function useProcessingOptions() {
  const materials = useQuery(getAdminListMaterialsQueryOptions());
  const stores = useQuery(getAdminListStoresQueryOptions());

  const materialEnv = materials.data as { data?: { items?: MaterialOut[] } } | undefined;
  const storeEnv = stores.data as { data?: { items?: StoreOut[] } } | undefined;

  return {
    materials: materialEnv?.data?.items ?? [],
    stores: storeEnv?.data?.items ?? [],
  };
}
