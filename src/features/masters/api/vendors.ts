import { getAdminListVendorsQueryOptions } from '../../../sdk/inventory';
import type { VendorListItem, VendorListResponse } from '../../../sdk/schemas';

export type VendorRow = VendorListItem;
export type { VendorListResponse };

export function vendorsQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListVendorsQueryOptions(trimmed ? { search: trimmed } : undefined);
}
