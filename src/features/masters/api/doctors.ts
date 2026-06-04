import { getAdminListDoctorsQueryOptions } from '../../../sdk/admin';
import type { DoctorListItem, DoctorListResponse } from '../../../sdk/schemas';

export type DoctorRow = DoctorListItem;
export type { DoctorListResponse };

export function doctorsQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListDoctorsQueryOptions(trimmed ? { search: trimmed } : undefined);
}
