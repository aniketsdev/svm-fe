// Data access for the Activity Log feature. Single entry point onto the
// generated SDK (`adminListActivityLog`).
import { getAdminListActivityLogQueryOptions } from '../../../sdk/activity-log';
import type { ActivityLogListItem, ActivityLogList } from '../../../sdk/schemas';

export type AuditRow = ActivityLogListItem;
// Keep the feature's public type name stable for consumers (useActivityLog).
export type AuditLogListResponse = ActivityLogList;

/** TanStack Query options for `GET /api/v1/admin/activity-log`. */
export function activityLogQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListActivityLogQueryOptions(trimmed ? { search: trimmed } : undefined);
}
