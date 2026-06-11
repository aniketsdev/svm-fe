import { getAdminListBomsQueryOptions } from '../../../sdk/inventory';
import type { BomListItem, BomListResponse, BomLineItem } from '../../../sdk/schemas';
import type { MastersListQuery } from './list-query';
import { toListParams } from './list-query';

export type BomRow = BomListItem;
export type { BomListResponse, BomLineItem };

export function bomsQueryOptions(query: MastersListQuery) {
  return getAdminListBomsQueryOptions(toListParams(query));
}
