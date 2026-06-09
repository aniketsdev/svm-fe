// Data access for the Users feature. Points at the canonical admin
// user-management API (backend feature 008): GET /admin/users returns
// { items, total, limit, offset } of AdminUserOut. Search, status/role
// filtering, sorting and pagination are all handled server-side.
import { getAdminListUsersQueryOptions } from '../../../sdk/user-management';
import type {
  AdminUserOut,
  AdminUserList,
  AdminListUsersStatus,
  AdminListUsersSort,
  AdminListUsersOrder,
} from '../../../sdk/schemas';

export type UserRow = AdminUserOut;
export type { AdminUserList, AdminListUsersStatus, AdminListUsersSort, AdminListUsersOrder };

/** The roles a user can hold (also the values offered by the role filter). */
export type UserRole = 'admin' | 'staff' | 'user';

export interface UsersQueryArgs {
  /** 0-based page index. */
  page: number;
  /** Rows per page (maps to `limit`). */
  pageSize: number;
  /** Free-text search across first/last/email. */
  q?: string;
  status?: AdminListUsersStatus;
  /** Role filter; `undefined` means no role filter ("all"). */
  role?: UserRole;
  /** Server-sortable columns only: name | last_login | created. */
  sort?: AdminListUsersSort;
  order?: AdminListUsersOrder;
}

/** TanStack Query options for `GET /api/v1/admin/users`. */
export function usersQueryOptions({
  page,
  pageSize,
  q,
  status = 'all',
  role,
  sort,
  order,
}: UsersQueryArgs) {
  const trimmed = q?.trim();
  return getAdminListUsersQueryOptions({
    q: trimmed ? trimmed : undefined,
    status,
    role: role ?? undefined,
    sort: sort ?? undefined,
    order: sort ? order : undefined,
    limit: pageSize,
    offset: page * pageSize,
  });
}
