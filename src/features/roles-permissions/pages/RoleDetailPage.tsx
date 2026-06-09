import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Pencil, Power, Trash2 } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { cn } from '../../../lib/cn';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAuth } from '../../auth/hooks/useAuth';
import { useAdminSetRoleStatus, useAdminDeleteRole } from '../../../sdk/roles-permissions';
import { useRoleDetail } from '../hooks/useRoleDetail';
import { RoleStatusBadge } from '../components/RoleStatusBadge';
import { RolePermissionMatrix } from '../components/RolePermissionMatrix';
import { EditRoleDialog } from '../components/EditRoleDialog';
import type { RoleRow } from '../api/roles';

/** Tier badge (admin / staff) — mirrors the list/table treatment. */
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
 * Dedicated role page (route `roles-permissions/:roleUuid`). Replaces the old
 * modal detail: full-width metadata header, the complete permission matrix
 * grouped by category, and the management actions (Edit drawer, Deactivate/
 * Activate, Delete). The "Back" link restores the list's search/filter/page,
 * carried through router state from the row that opened this page.
 */
export function RoleDetailPage() {
  const { roleUuid } = useParams<{ roleUuid: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  // Management actions are enforced server-side by `roles.manage`; the UI hides
  // them for non-admin callers, who keep read-only access to the detail.
  const canManage = user?.role === 'admin';

  // The originating list preserves its query string here so Back returns to the
  // same search/filter/page; default to a clean list when opened directly.
  const fromSearch = (location.state as { fromSearch?: string } | null)?.fromSearch ?? '';
  const backTo = `/roles-permissions${fromSearch}`;

  const { role, isLoading, isError, refetch } = useRoleDetail(roleUuid);

  const [editOpen, setEditOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const statusMutation = useAdminSetRoleStatus({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Role status updated.') });
        setConfirmStatus(false);
        refetch();
      },
      onError: (e) => {
        toast({ severity: 'error', message: errorMessage(e) });
        setConfirmStatus(false);
      },
    },
  });

  const deleteMutation = useAdminDeleteRole({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Role deleted.') });
        navigate(backTo);
      },
      onError: (e) => {
        toast({ severity: 'error', message: errorMessage(e) });
        setConfirmDelete(false);
      },
    },
  });

  const isActive = role?.status === 'active';

  return (
    <div className="w-full px-4 py-5">
      <button
        type="button"
        onClick={() => navigate(backTo)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to roles
      </button>

      {isLoading && !role ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-9 animate-spin text-primary" aria-hidden />
        </div>
      ) : isError || !role ? (
        <p className="mt-10 text-center text-sm text-destructive">
          Could not load this role's permissions.
        </p>
      ) : (
        <>
          {/* Metadata header — name, tier, status, description + actions. */}
          <div className="mt-4 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold capitalize text-foreground">{role.name}</h1>
                <TierBadge tier={role.type} />
                <RoleStatusBadge status={role.status} />
              </div>
              <p className="max-w-2xl text-sm text-muted-foreground">
                {role.description || 'No description.'}
              </p>
            </div>

            {canManage && (
              <div className="flex flex-wrap gap-3 sm:justify-end">
                <CustomButton
                  type="button"
                  variant="outline"
                  icon={<Power className="size-4" />}
                  onClick={() => setConfirmStatus(true)}
                >
                  {isActive ? 'Deactivate' : 'Activate'}
                </CustomButton>
                {!role.is_system && (
                  <CustomButton
                    type="button"
                    variant="destructive"
                    icon={<Trash2 className="size-4" />}
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete
                  </CustomButton>
                )}
                <CustomButton
                  type="button"
                  variant="primary"
                  icon={<Pencil className="size-4" />}
                  onClick={() => setEditOpen(true)}
                >
                  Edit role
                </CustomButton>
              </div>
            )}
          </div>

          {/* Full-width permission matrix, grouped by category. */}
          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <RolePermissionMatrix matrix={role.matrix} loading={isLoading} />
          </div>

          {/* Edit reuses the same drawer as the list; RoleDetailOut satisfies RoleRow. */}
          <EditRoleDialog
            role={editOpen ? (role as RoleRow) : null}
            onClose={() => setEditOpen(false)}
            onUpdated={() => {
              setEditOpen(false);
              refetch();
            }}
          />

          <ConfirmationPopUp
            open={confirmStatus}
            title={isActive ? 'Deactivate role' : 'Activate role'}
            message={
              isActive
                ? `Deactivate “${role.name}”? Holders of this role will lose its access.`
                : `Activate “${role.name}”?`
            }
            confirmLabel={isActive ? 'Deactivate' : 'Activate'}
            destructive={isActive}
            onClose={() => setConfirmStatus(false)}
            onConfirm={() =>
              statusMutation.mutate({
                roleUuid: role.uuid,
                data: { status: isActive ? 'inactive' : 'active' },
              })
            }
          />

          <ConfirmationPopUp
            open={confirmDelete}
            title="Delete role"
            message={`Delete “${role.name}”? This cannot be undone.`}
            confirmLabel="Delete"
            destructive
            onClose={() => setConfirmDelete(false)}
            onConfirm={() => deleteMutation.mutate({ roleUuid: role.uuid })}
          />
        </>
      )}
    </div>
  );
}

export default RoleDetailPage;
