import { getAdminListDoctorAliasesQueryOptions } from '../../../sdk/inventory';
import type { DoctorAliasListItem, DoctorAliasListResponse } from '../../../sdk/schemas';
import type { MastersListQuery } from './list-query';
import { toListParams } from './list-query';

export type DoctorAliasRow = DoctorAliasListItem;
export type { DoctorAliasListResponse };

export function doctorAliasesQueryOptions(query: MastersListQuery) {
  return getAdminListDoctorAliasesQueryOptions(toListParams(query));
}
