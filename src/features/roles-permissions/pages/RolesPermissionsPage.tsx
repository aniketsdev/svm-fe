import { useState } from 'react';
import { cn } from '../../../lib/cn';
import { useRoles } from '../hooks/useRoles';
import { PermissionMatrix } from '../components/PermissionMatrix';

const ROLE_ORDER = ['admin', 'staff', 'user'] as const;
const ROLE_TITLES: Record<string, string> = { admin: 'Admin', staff: 'Staff', user: 'User' };

export function RolesPermissionsPage() {
  const { roles, isLoading } = useRoles();
  const [roleName, setRoleName] = useState<string>('admin');

  const available = ROLE_ORDER.filter((r) => roles.some((role) => role.name === r));
  const tabs = available.length ? available : ROLE_ORDER;
  const role = roles.find((r) => r.name === roleName) ?? null;
  const granted = new Set(role?.permissions ?? []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Roles &amp; Permissions</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          What each role can do across the CRM. Pick a role to see its capability matrix.
        </p>
      </div>

      {/* Role selector */}
      <div className="mt-6 inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
        {tabs.map((r) => {
          const active = r === roleName;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setRoleName(r)}
              aria-pressed={active}
              className={cn(
                'rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {ROLE_TITLES[r] ?? r}
            </button>
          );
        })}
      </div>

      {role && (
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          {role.description}
          <span className="text-muted-foreground/70">
            {' '}
            · {role.user_count} {role.user_count === 1 ? 'user' : 'users'}
          </span>
        </p>
      )}

      {/* Matrix */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <PermissionMatrix granted={granted} loading={isLoading} />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Read-only — role permissions are managed as system fixtures in v1 (FR-025). Master Data
        modules share the single CRM-data capability, so they grant together.
      </p>
    </div>
  );
}

export default RolesPermissionsPage;
