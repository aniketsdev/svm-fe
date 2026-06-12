import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { SortingState } from '@tanstack/react-table';
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
} from '../../../sdk/user-management';
import { useUsers } from '../hooks/useUsers';
import { UsersTable } from '../components/UsersTable';
import { CreateUserDialog } from '../components/CreateUserDialog';
import { EditUserDialog } from '../components/EditUserDialog';
import type { UserRow, AdminListUsersStatus, AdminListUsersSort, UserRole } from '../api/users';

const STATUS_ITEMS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const ROLE_ITEMS = [
  { value: 'all', label: 'All roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'user', label: 'User' },
];

export function UsersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AdminListUsersStatus>('all');
  const [role, setRole] = useState<UserRole | 'all'>('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);

  const sort = sorting[0]?.id as AdminListUsersSort | undefined;
  const order: 'asc' | 'desc' | undefined = sorting[0]
    ? sorting[0].desc
      ? 'desc'
      : 'asc'
    : undefined;

  const { users, total, isLoading, refetch } = useUsers({
    page,
    pageSize,
    q: search,
    status,
    role: role === 'all' ? undefined : role,
    sort,
    order,
  });

  // A new search, filter, or sort should always start from the first page.
  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(0);
  };
  const handleStatus = (value: AdminListUsersStatus) => {
    setStatus(value);
    setPage(0);
  };
  const handleRole = (value: UserRole | 'all') => {
    setRole(value);
    setPage(0);
  };
  const handleSort = (next: SortingState) => {
    setSorting(next);
    setPage(0);
  };

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
      {/* Header: title left, search right (Activity-Log parity) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Team accounts, roles and access status.
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

      {/* Toolbar — count left; filters + create right */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <div className="w-44">
            <CustomSelect
              name="status"
              placeholder="Status"
              value={status}
              items={STATUS_ITEMS}
              onChange={(e) => handleStatus(e.target.value as AdminListUsersStatus)}
            />
          </div>
          <div className="w-44">
            <CustomSelect
              name="role"
              placeholder="Role"
              value={role}
              items={ROLE_ITEMS}
              onChange={(e) => handleRole(e.target.value as UserRole | 'all')}
            />
          </div>
          <CustomSearch
            textData={{ placeholder: 'Search by email or name', btnTitle: 'Search' }}
            onSearch={handleSearch}
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
          page={page}
          pageSize={pageSize}
          total={total}
          onPaginationChange={({ pageIndex, pageSize: nextSize }) => {
            setPage(pageIndex);
            setPageSize(nextSize);
          }}
          sorting={sorting}
          onSortingChange={handleSort}
          onEdit={setEditUser}
          onToggleStatus={(u) =>
            statusMutation.mutate({ userUuid: u.uuid, data: { is_active: !u.is_active } })
          }
          onResend={(u) => resendMutation.mutate({ userUuid: u.uuid })}
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
          if (deleteUser) deleteMutation.mutate({ userUuid: deleteUser.uuid });
        }}
      />
    </div>
  );
}

export default UsersPage;
