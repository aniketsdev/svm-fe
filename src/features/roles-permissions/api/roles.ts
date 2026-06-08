// Data access for the Roles & Permissions feature. Single entry point onto the
// generated SDK (`adminListRoles`).
import { getAdminListRolesQueryOptions } from '../../../sdk/roles-permissions';
import type { RoleListItem, RoleListResponse, PermissionItem } from '../../../sdk/schemas';

export type RoleRow = RoleListItem;
export type { RoleListResponse, PermissionItem };

/** TanStack Query options for `GET /api/v1/admin/roles`. */
export function rolesQueryOptions() {
  return getAdminListRolesQueryOptions();
}
