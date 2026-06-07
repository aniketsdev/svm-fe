import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { CustomSelect } from '../../../common/custom-select';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import {
  useAdminSetUserStatus,
  useAdminResendInvitation,
  useAdminSoftDeleteUser,
} from '../../../sdk/admin';
import { useUsers } from '../hooks/useUsers';
import { UsersTable } from '../components/UsersTable';
import { CreateUserDialog } from '../components/CreateUserDialog';
import { EditUserDialog } from '../components/EditUserDialog';
import type { UserRow, AdminListUsersStatus } from '../api/users';

const STATUS_ITEMS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export function UsersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AdminListUsersStatus>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);

  const { users, count, isLoading, refetch } = useUsers(search, status);

  const statusMutation = useAdminSetUserStatus({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'User status updated.') });
        refetch();
      },
      onError: (e) => toast({ severity: 'error', message: errorMessage(e) }),
    },
  });

  const resendMutation = useAdminResendInvitation({
    mutation: {
      onSuccess: (response) => {
        toast({
          severity: 'success',
          message: successMessage(response, 'Set-password link regenerated.'),
        });
        refetch();
      },
      onError: (e) => toast({ severity: 'error', message: errorMessage(e) }),
    },
  });

  const deleteMutation = useAdminSoftDeleteUser({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'User deleted.') });
        setDeleteUser(null);
        refetch();
      },
      onError: (e) => {
        toast({ severity: 'error', message: errorMessage(e) });
        setDeleteUser(null);
      },
    },
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage user accounts, roles and password set-up. Manage role permissions at Roles &amp;
            Permissions.
          </p>
        </div>
        <CustomButton
          variant="primary"
          icon={<UserPlus className="size-4" />}
          onClick={() => setCreateOpen(true)}
        >
          Create user
        </CustomButton>
      </div>

      {/* Toolbar — count left, search + filters top-right */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="shrink-0 text-sm text-muted-foreground">
          {count} {count === 1 ? 'record' : 'records'}
        </span>
        <div className="flex items-center gap-3 sm:justify-end">
          <div className="w-36">
            <CustomSelect
              name="status"
              placeholder="Status"
              value={status}
              items={STATUS_ITEMS}
              onChange={(e) => setStatus(e.target.value as AdminListUsersStatus)}
            />
          </div>
          <CustomSearch
            textData={{ placeholder: 'Search by email or name', btnTitle: 'Search' }}
            onSearch={setSearch}
            hasStartSearchIcon
            width="20rem"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <UsersTable
          users={users}
          loading={isLoading}
          onEdit={setEditUser}
          onToggleStatus={(u) =>
            statusMutation.mutate({ userId: u.id, data: { is_active: !u.is_active } })
          }
          onResend={(u) => resendMutation.mutate({ userId: u.id })}
          onDelete={setDeleteUser}
        />
      </div>

      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => refetch()}
      />

      <EditUserDialog user={editUser} onClose={() => setEditUser(null)} onUpdated={() => refetch()} />

      <ConfirmationPopUp
        open={deleteUser !== null}
        title="Delete user"
        message={
          deleteUser
            ? `Soft-delete ${deleteUser.email}? They can be restored from the admin dashboard.`
            : ''
        }
        onClose={() => setDeleteUser(null)}
        onConfirm={() => {
          if (deleteUser) deleteMutation.mutate({ userId: deleteUser.id });
        }}
      />
    </div>
  );
}

export default UsersPage;
