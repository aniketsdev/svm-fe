import { getAdminListDoctorPricingQueryOptions } from '../../../sdk/admin';
import type { DoctorPricingListItem, DoctorPricingListResponse } from '../../../sdk/schemas';

export type DoctorPricingRow = DoctorPricingListItem;
export type { DoctorPricingListResponse };

export function doctorPricingQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListDoctorPricingQueryOptions(trimmed ? { search: trimmed } : undefined);
}
