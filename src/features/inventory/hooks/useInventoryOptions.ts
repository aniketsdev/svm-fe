import { useQuery } from '@tanstack/react-query';
import {
  getAdminListStoresQueryOptions,
  getAdminListProductsQueryOptions,
  getAdminListRawMaterialsQueryOptions,
} from '../../../sdk/inventory';
import type { StoreListItem, ProductListItem, RawMaterialListItem } from '../../../sdk/schemas';

function results<T>(data: unknown): T[] {
  return (data as { data?: { results?: T[] } } | undefined)?.data?.results ?? [];
}

/** Stores + items (products and raw materials) for the movement/transfer selects. */
export function useInventoryOptions() {
  const stores = useQuery(getAdminListStoresQueryOptions());
  const products = useQuery(getAdminListProductsQueryOptions());
  const materials = useQuery(getAdminListRawMaterialsQueryOptions());

  return {
    stores: results<StoreListItem>(stores.data),
    products: results<ProductListItem>(products.data),
    materials: results<RawMaterialListItem>(materials.data),
  };
}
