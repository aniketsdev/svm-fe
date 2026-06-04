// Data access for the Activity Log feature. Single entry point onto the
// generated SDK (`adminListAuditLog`).
import { getAdminListAuditLogQueryOptions } from '../../../sdk/admin';
import type { AuditLogListItem, AuditLogListResponse } from '../../../sdk/schemas';

export type AuditRow = AuditLogListItem;
export type { AuditLogListResponse };

/** TanStack Query options for `GET /api/v1/admin/audit-log`. */
export function activityLogQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListAuditLogQueryOptions(trimmed ? { search: trimmed } : undefined);
}
