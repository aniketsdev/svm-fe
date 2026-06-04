import { getAdminListRawMaterialsQueryOptions } from '../../../sdk/admin';
import type { RawMaterialListItem, RawMaterialListResponse } from '../../../sdk/schemas';

export type RawMaterialRow = RawMaterialListItem;
export type { RawMaterialListResponse };

export function rawMaterialsQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListRawMaterialsQueryOptions(trimmed ? { search: trimmed } : undefined);
}
