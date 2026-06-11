import { useAuth } from '../../auth/hooks/useAuth';

/**
 * CRM permission gating (research R2). The backend grants `crm.*` to the admin
 * and staff tiers and nothing to the `user` tier; the bootstrap `MeResponse`
 * exposes the role (not a permissions array), so gating is role-based here while
 * the API still enforces the real permission check server-side (defense in depth).
 *
 * If a granular `permissions` array is later added to `MeResponse`, swap the
 * body of `can()` to consult it and keep the role fallback.
 */
export type CrmPermission = 'crm.view' | 'crm.create' | 'crm.update' | 'crm.delete';

export function useCrmPermissions() {
  const { user } = useAuth();
  const role = user?.role;
  const hasCrmAccess = role === 'admin' || role === 'staff';

  const can = (perm: CrmPermission): boolean => Boolean(perm) && hasCrmAccess;

  return {
    canView: can('crm.view'),
    canCreate: can('crm.create'),
    canUpdate: can('crm.update'),
    canDelete: can('crm.delete'),
    can,
  };
}
