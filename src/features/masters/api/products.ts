import { getAdminListProductsQueryOptions } from '../../../sdk/admin';
import type { ProductListItem, ProductListResponse } from '../../../sdk/schemas';

export type ProductRow = ProductListItem;
export type { ProductListResponse };

export function productsQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListProductsQueryOptions(trimmed ? { search: trimmed } : undefined);
}
