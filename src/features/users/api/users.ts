// Data access for the Users feature. Points at the canonical admin
// user-management API (backend feature 008): GET /admin/users returns
// { items, total, limit, offset } of AdminUserOut.
import { getAdminListUsersQueryOptions } from '../../../sdk/admin';
import type { AdminUserOut, AdminUserList } from '../../../sdk/schemas';

export type UserRow = AdminUserOut;
export type { AdminUserList };

/** TanStack Query options for `GET /api/v1/admin/users` (`q` = search). */
export function usersQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListUsersQueryOptions(trimmed ? { q: trimmed } : undefined);
}
