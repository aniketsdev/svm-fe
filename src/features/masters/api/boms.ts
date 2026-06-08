import { getAdminListBomsQueryOptions } from '../../../sdk/inventory';
import type { BomListItem, BomListResponse, BomLineItem } from '../../../sdk/schemas';

export type BomRow = BomListItem;
export type { BomListResponse, BomLineItem };

export function bomsQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListBomsQueryOptions(trimmed ? { search: trimmed } : undefined);
}
