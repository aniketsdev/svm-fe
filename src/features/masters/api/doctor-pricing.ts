import { getAdminListDoctorPricingQueryOptions } from '../../../sdk/inventory';
import type { DoctorPricingListItem, DoctorPricingListResponse } from '../../../sdk/schemas';
import type { MastersListQuery } from './list-query';
import { toListParams } from './list-query';

export type DoctorPricingRow = DoctorPricingListItem;
export type { DoctorPricingListResponse };

export function doctorPricingQueryOptions(query: MastersListQuery) {
  return getAdminListDoctorPricingQueryOptions(toListParams(query));
}
