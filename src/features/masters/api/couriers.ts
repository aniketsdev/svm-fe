import { getAdminListCourierPartnersQueryOptions } from '../../../sdk/inventory';
import type { CourierPartnerListItem, CourierPartnerListResponse } from '../../../sdk/schemas';
import type { MastersListQuery } from './list-query';
import { toListParams } from './list-query';

export type CourierRow = CourierPartnerListItem;
export type { CourierPartnerListResponse };

export function couriersQueryOptions(query: MastersListQuery) {
  return getAdminListCourierPartnersQueryOptions(toListParams(query));
}
