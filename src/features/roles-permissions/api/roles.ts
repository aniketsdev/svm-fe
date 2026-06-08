// Data access for the Roles & Permissions feature. Single entry point onto the
// generated SDK (`adminListRoles`).
import { getAdminListRolesQueryOptions } from '../../../sdk/roles-permissions';
import type { RoleOut, RoleList, PermissionOut } from '../../../sdk/schemas';

// Public type names kept stable for callers; mapped onto the real SDK shapes.
export type RoleRow = RoleOut;
export type RoleListResponse = RoleList;
export type PermissionItem = PermissionOut;

/** TanStack Query options for `GET /api/v1/admin/roles`. */
export function rolesQueryOptions() {
  return getAdminListRolesQueryOptions();
}
