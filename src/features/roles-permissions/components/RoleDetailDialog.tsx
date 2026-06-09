import { Pencil, Power, Trash2 } from 'lucide-react';
import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { cn } from '../../../lib/cn';
import { useRoleDetail } from '../hooks/useRoleDetail';
import type { RoleRow } from '../api/roles';
import { RoleStatusBadge } from './RoleStatusBadge';
import { RolePermissionMatrix } from './RolePermissionMatrix';

interface RoleDetailDialogProps {
  role: RoleRow | null;
  onClose: () => void;
  onEdit: (role: RoleRow) => void;
  onToggleStatus: (role: RoleRow) => void;
  onDelete: (role: RoleRow) => void;
  canManage: boolean;
}

/** Tier badge (admin / staff). */
function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        tier === 'admin' ? 'bg-primary/10 text-primary' : 'bg-info/10 text-info',
      )}
    >
      {tier}
    </span>
  );
}

/**
 * Row-click detail: role metadata + the full permission matrix (granted/not),
 * grouped by the backend's categories. Management actions are offered only to
 * callers who can manage roles; Delete is hidden for built-in (system) roles.
 */
export function RoleDetailDialog({
  role,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
  canManage,
}: RoleDetailDialogProps) {
  const { role: detail, isLoading, isError } = useRoleDetail(role?.uuid);

  return (
    <CustomDialog
      title="Role permissions"
      open={role !== null}
      onClose={() => onClose()}
      width="44rem"
    >
      {role && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 border-b border-border pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold capitalize text-foreground">{role.name}</h3>
              <TierBadge tier={role.type} />
              <RoleStatusBadge status={role.status} />
            </div>
            <p className="text-sm text-muted-foreground">{role.description || 'No description.'}</p>
          </div>

          <div className="max-h-[55vh] overflow-y-auto rounded-xl border border-border bg-card">
            {isError ? (
              <p className="px-4 py-8 text-center text-sm text-destructive">
                Could not load this role's permissions.
              </p>
            ) : (
              <RolePermissionMatrix matrix={detail?.matrix ?? []} loading={isLoading} />
            )}
          </div>

          {canManage && (
            <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-4">
              <CustomButton
                type="button"
                variant="outline"
                icon={<Power className="size-4" />}
                onClick={() => onToggleStatus(role)}
              >
                {role.status === 'active' ? 'Deactivate' : 'Activate'}
              </CustomButton>
              {!role.is_system && (
                <CustomButton
                  type="button"
                  variant="destructive"
                  icon={<Trash2 className="size-4" />}
                  onClick={() => onDelete(role)}
                >
                  Delete
                </CustomButton>
              )}
              <CustomButton
                type="button"
                variant="primary"
                icon={<Pencil className="size-4" />}
                onClick={() => onEdit(role)}
              >
                Edit role
              </CustomButton>
            </div>
          )}
        </div>
      )}
    </CustomDialog>
  );
}
