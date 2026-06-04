// Data access for the Users feature. Single entry point onto the generated
// SDK (`adminListUsers`) so the rest of the feature never imports `src/sdk`
// directly — mirrors the project's feature/api convention.
import { getAdminListUsersQueryOptions } from '../../../sdk/admin';
import type { UserListItem, UserListResponse } from '../../../sdk/schemas';

export type UserRow = UserListItem;
export type { UserListResponse };

/**
 * TanStack Query options for the admin Users list. Passes `search` through to
 * `GET /api/v1/admin/users` only when non-empty.
 */
export function usersQueryOptions(search?: string) {
  const trimmed = search?.trim();
  return getAdminListUsersQueryOptions(trimmed ? { search: trimmed } : undefined);
}
