import { Check, X } from 'lucide-react';
import { CustomDialog } from '../../../common/custom-dialog';
import { cn } from '../../../lib/cn';
import type { RoleRow, PermissionItem } from '../api/roles';

const ROLE_TITLES: Record<string, string> = { admin: 'Admin', staff: 'Staff', user: 'User' };

interface RolePermissionsDialogProps {
  role: RoleRow | null;
  allPermissions: PermissionItem[];
  onClose: () => void;
}

/** Row-click detail: the full permission catalogue with granted/not-granted state. */
export function RolePermissionsDialog({
  role,
  allPermissions,
  onClose,
}: RolePermissionsDialogProps) {
  const granted = new Set(role?.permissions ?? []);
  const title = role ? `${ROLE_TITLES[role.name] ?? role.name} — permissions` : 'Permissions';

  return (
    <CustomDialog title={title} open={role !== null} onClose={onClose} width="40rem">
      {role && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{role.description}</p>
          <p className="text-xs font-medium text-muted-foreground">
            {role.permissions.length} of {allPermissions.length} permissions enabled
          </p>

          <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {allPermissions.map((p) => {
              const on = granted.has(p.name);
              return (
                <li key={p.name} className="flex items-center gap-3 px-3 py-2">
                  <span
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-full',
                      on ? 'bg-positive/15 text-positive' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {on ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </span>
                  <div className="min-w-0">
                    <p className={cn('truncate text-sm', on ? 'text-foreground' : 'text-muted-foreground')}>
                      {p.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{p.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="text-xs text-muted-foreground">
            Read-only — role permissions are managed as system fixtures in v1.
          </p>
        </div>
      )}
    </CustomDialog>
  );
}
