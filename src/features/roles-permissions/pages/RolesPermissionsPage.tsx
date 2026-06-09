import { useState } from 'react';
import { ShieldPlus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { CustomSelect } from '../../../common/custom-select';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAuth } from '../../auth/hooks/useAuth';
import { useAdminSetRoleStatus, useAdminDeleteRole } from '../../../sdk/roles-permissions';
import { useRoles } from '../hooks/useRoles';
import { RolesTable } from '../components/RolesTable';
import { RoleDetailDialog } from '../components/RoleDetailDialog';
import { CreateRoleDialog } from '../components/CreateRoleDialog';
import { EditRoleDialog } from '../components/EditRoleDialog';
import type { RoleRow } from '../api/roles';

const STATUS_ITEMS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

type StatusFilter = 'all' | 'active' | 'inactive';

export function RolesPermissionsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  // Management actions are enforced server-side by `roles.manage`; the UI hides
  // them for non-admin callers, who keep read-only access to the list/detail.
  const canManage = user?.role === 'admin';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailRole, setDetailRole] = useState<RoleRow | null>(null);
  const [editRole, setEditRole] = useState<RoleRow | null>(null);
  const [deleteRole, setDeleteRole] = useState<RoleRow | null>(null);
  const [statusRole, setStatusRole] = useState<RoleRow | null>(null);

  const { roles, total, isLoading, refetch } = useRoles({ page, pageSize, q: search, status });

  // A new search or filter should always start from the first page.
  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(0);
  };
  const handleStatus = (value: StatusFilter) => {
    setStatus(value);
    setPage(0);
  };

  const refreshAll = () => {
    refetch();
    // Keep the open detail in sync after a change (re-selecting refetches it).
    setDetailRole((current) => (current ? { ...current } : current));
  };

  const statusMutation = useAdminSetRoleStatus({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Role status updated.') });
        setStatusRole(null);
        refreshAll();
      },
      onError: (e) => {
        toast({ severity: 'error', message: errorMessage(e) });
        setStatusRole(null);
      },
    },
  });

  const deleteMutation = useAdminDeleteRole({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Role deleted.') });
        setDeleteRole(null);
        setDetailRole(null);
        refetch();
      },
      onError: (e) => {
        toast({ severity: 'error', message: errorMessage(e) });
        setDeleteRole(null);
      },
    },
  });

  return (
    <div className="w-full px-4 py-5">
      {/* Header: title left, search right (Activity-Log parity) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Roles &amp; Permissions</h1>
        <CustomSearch
          textData={{ placeholder: 'Search by role name', btnTitle: 'Search' }}
          onSearch={handleSearch}
          hasStartSearchIcon
          width="28rem"
        />
      </div>

      {/* Toolbar — status filter + create */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <div className="w-40">
            <CustomSelect
              name="status"
              placeholder="Status"
              value={status}
              items={STATUS_ITEMS}
              onChange={(e) => handleStatus(e.target.value as StatusFilter)}
            />
          </div>
          {canManage && (
            <CustomButton
              variant="primary"
              icon={<ShieldPlus className="size-4" />}
              onClick={() => setCreateOpen(true)}
            >
              Add role
            </CustomButton>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <RolesTable
          roles={roles}
          loading={isLoading}
          page={page}
          pageSize={pageSize}
          total={total}
          onPaginationChange={({ pageIndex, pageSize: nextSize }) => {
            setPage(pageIndex);
            setPageSize(nextSize);
          }}
          onRowClick={setDetailRole}
          onEdit={setEditRole}
          onToggleStatus={setStatusRole}
          onDelete={setDeleteRole}
          canManage={canManage}
        />
      </div>

      <RoleDetailDialog
        role={detailRole}
        onClose={() => setDetailRole(null)}
        onEdit={(role) => {
          setDetailRole(null);
          setEditRole(role);
        }}
        onToggleStatus={setStatusRole}
        onDelete={setDeleteRole}
        canManage={canManage}
      />

      <CreateRoleDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => refetch()}
      />

      <EditRoleDialog
        role={editRole}
        onClose={() => setEditRole(null)}
        onUpdated={() => refreshAll()}
      />

      <ConfirmationPopUp
        open={statusRole !== null}
        title={statusRole?.status === 'active' ? 'Deactivate role' : 'Activate role'}
        message={
          statusRole
            ? statusRole.status === 'active'
              ? `Deactivate “${statusRole.name}”? Holders of this role will lose its access.`
              : `Activate “${statusRole.name}”?`
            : ''
        }
        confirmLabel={statusRole?.status === 'active' ? 'Deactivate' : 'Activate'}
        destructive={statusRole?.status === 'active'}
        onClose={() => setStatusRole(null)}
        onConfirm={() => {
          if (statusRole) {
            statusMutation.mutate({
              roleUuid: statusRole.uuid,
              data: { status: statusRole.status === 'active' ? 'inactive' : 'active' },
            });
          }
        }}
      />

      <ConfirmationPopUp
        open={deleteRole !== null}
        title="Delete role"
        message={deleteRole ? `Delete “${deleteRole.name}”? This cannot be undone.` : ''}
        confirmLabel="Delete"
        destructive
        onClose={() => setDeleteRole(null)}
        onConfirm={() => {
          if (deleteRole) deleteMutation.mutate({ roleUuid: deleteRole.uuid });
        }}
      />
    </div>
  );
}

export default RolesPermissionsPage;
