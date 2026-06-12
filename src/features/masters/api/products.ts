import { getAdminListProductsQueryOptions } from '../../../sdk/inventory';
import type { ProductListItem, ProductListResponse } from '../../../sdk/schemas';
import type { MastersListQuery } from './list-query';
import { toListParams } from './list-query';

export type ProductRow = ProductListItem;
export type { ProductListResponse };

export function productsQueryOptions(query: MastersListQuery) {
  return getAdminListProductsQueryOptions(toListParams(query));
}
