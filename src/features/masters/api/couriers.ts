import { getAdminListCourierPartnersQueryOptions } from '../../../sdk/admin';
import type { CourierPartnerListItem, CourierPartnerListResponse } from '../../../sdk/schemas';

export type CourierRow = CourierPartnerListItem;
export type { CourierPartnerListResponse };

export function couriersQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListCourierPartnersQueryOptions(trimmed ? { search: trimmed } : undefined);
}
