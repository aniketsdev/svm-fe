import { useQuery } from '@tanstack/react-query';
import {
  getAdminListProductsQueryOptions,
  getAdminListBomsQueryOptions,
  getAdminListStoresQueryOptions,
} from '../../../sdk/inventory';
import type { ProductListItem, BomListItem, StoreOut } from '../../../sdk/schemas';

/** Products, BOMs and stores for the manufacturing-order selects. */
export function useManufacturingOptions() {
  const products = useQuery(getAdminListProductsQueryOptions());
  const boms = useQuery(getAdminListBomsQueryOptions());
  const stores = useQuery(getAdminListStoresQueryOptions());

  const productEnv = products.data as { data?: { results?: ProductListItem[] } } | undefined;
  const bomEnv = boms.data as { data?: { results?: BomListItem[] } } | undefined;
  const storeEnv = stores.data as { data?: { items?: StoreOut[] } } | undefined;

  return {
    products: productEnv?.data?.results ?? [],
    boms: bomEnv?.data?.results ?? [],
    stores: storeEnv?.data?.items ?? [],
  };
}
