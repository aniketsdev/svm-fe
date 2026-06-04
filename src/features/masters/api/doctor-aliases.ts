import { getAdminListDoctorAliasesQueryOptions } from '../../../sdk/admin';
import type { DoctorAliasListItem, DoctorAliasListResponse } from '../../../sdk/schemas';

export type DoctorAliasRow = DoctorAliasListItem;
export type { DoctorAliasListResponse };

export function doctorAliasesQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListDoctorAliasesQueryOptions(trimmed ? { search: trimmed } : undefined);
}
