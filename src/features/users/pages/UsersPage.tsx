import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomSearch } from '../../../common/custom-search';
import { useUsers } from '../hooks/useUsers';
import { UsersTable } from '../components/UsersTable';
import { CreateUserDialog } from '../components/CreateUserDialog';

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const { users, count, isLoading, refetch } = useUsers(search);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage user accounts, roles, password resets and 2FA. Manage role permissions at Roles
            &amp; Permissions.
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

      {/* Toolbar */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <CustomSearch
          textData={{ placeholder: 'Search by email or name', btnTitle: 'Search' }}
          onSearch={setSearch}
          hasStartSearchIcon
          width="20rem"
        />
        <span className="shrink-0 text-sm text-muted-foreground">
          {count} {count === 1 ? 'record' : 'records'}
        </span>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <UsersTable users={users} loading={isLoading} />
      </div>

      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => refetch()}
      />
    </div>
  );
}

export default UsersPage;
