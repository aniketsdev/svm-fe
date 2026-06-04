import { useMemo } from 'react';
import dayjs from 'dayjs';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { UserRow } from '../api/users';
import { RoleBadge } from './RoleBadge';
import { StatusPill } from './StatusPill';

function fullName(u: UserRow): string {
  const name = [u.first_name, u.last_name].filter(Boolean).join(' ').trim();
  return name || '—';
}

interface UsersTableProps {
  users: UserRow[];
  loading: boolean;
}

export function UsersTable({ users, loading }: UsersTableProps) {
  const columns = useMemo<ColumnDef<UserRow, unknown>[]>(
    () => [
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.email}</span>
        ),
      },
      {
        id: 'name',
        header: 'Name',
        cell: ({ row }) => <span className="text-foreground">{fullName(row.original)}</span>,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => <RoleBadge role={row.original.role} />,
      },
      {
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => <StatusPill active={row.original.is_active} />,
      },
      {
        // 2FA is not implemented on the backend yet — placeholder until that
        // feature lands (see Week-1 plan).
        id: 'twofa',
        header: '2FA',
        cell: () => <StatusPill active={false} activeLabel="On" inactiveLabel="Off" />,
      },
      {
        id: 'last_login',
        header: 'Last login',
        cell: ({ row }) =>
          row.original.last_login_at ? (
            <span className="text-muted-foreground">
              {dayjs(row.original.last_login_at).format('DD MMM YYYY, h:mm A')}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
    ],
    [],
  );

  return (
    <CommonTable<UserRow>
      columns={columns}
      data={users}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">No users found.</div>
      }
    />
  );
}
