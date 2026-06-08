import { getAdminListRmCategoriesQueryOptions } from '../../../sdk/inventory';
import type { RmCategoryListItem, RmCategoryListResponse } from '../../../sdk/schemas';

export type RmCategoryRow = RmCategoryListItem;
export type { RmCategoryListResponse };

export function rmCategoriesQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListRmCategoriesQueryOptions(trimmed ? { search: trimmed } : undefined);
}
