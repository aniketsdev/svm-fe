// Data access for Roles & Permissions onto the generated SDK.
import {
  getAdminListRolesQueryOptions,
  getAdminGetRoleQueryOptions,
} from '../../../sdk/roles-permissions';
import type { RoleOut, RoleList, RoleDetailOut, PermissionOut } from '../../../sdk/schemas';

export type RoleRow = RoleOut;
export type RoleListResponse = RoleList;
export type PermissionItem = PermissionOut;
export type { RoleDetailOut };

export function rolesQueryOptions() {
  return getAdminListRolesQueryOptions();
}

export function roleDetailQueryOptions(roleId: number | null) {
  return getAdminGetRoleQueryOptions(roleId ?? 0, { query: { enabled: roleId !== null } });
}
