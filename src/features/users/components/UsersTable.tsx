import { useMemo } from 'react';
import { Mail, Pencil, Power, Trash2 } from 'lucide-react';
import type { SortingState } from '@tanstack/react-table';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { ActionMenu, type ActionMenuItem } from '../../../common/action-menu';
import { fullName, formatDateTime } from '../../../utils/format';
import type { UserRow } from '../api/users';
import { RoleBadge } from './RoleBadge';
import { StatusPill } from './StatusPill';

interface UsersTableProps {
  users: UserRow[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onEdit: (u: UserRow) => void;
  onToggleStatus: (u: UserRow) => void;
  onResend: (u: UserRow) => void;
  onDelete: (u: UserRow) => void;
}

export function UsersTable({
  users,
  loading,
  page,
  pageSize,
  total,
  onPaginationChange,
  sorting,
  onSortingChange,
  onEdit,
  onToggleStatus,
  onResend,
  onDelete,
}: UsersTableProps) {
  const columns = useMemo<ColumnDef<UserRow, unknown>[]>(
    () => [
      {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.email}</span>
        ),
      },
      {
        id: 'name',
        header: 'Name',
        // Server sorts this column (sort=name).
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-foreground">
            {fullName(row.original.first_name, row.original.last_name)}
          </span>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        enableSorting: false,
        cell: ({ row }) => <RoleBadge role={row.original.role} />,
      },
      {
        accessorKey: 'is_active',
        header: 'Active',
        enableSorting: false,
        cell: ({ row }) => <StatusPill active={row.original.is_active} />,
      },
      {
        id: 'last_login',
        header: 'Last login',
        // Server sorts this column (sort=last_login).
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatDateTime(row.original.last_login_at)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => {
          const u = row.original;
          const items: ActionMenuItem[] = [
            { label: 'Edit', icon: <Pencil className="size-4" />, onClick: () => onEdit(u) },
            {
              label: u.is_active ? 'Deactivate' : 'Activate',
              icon: <Power className="size-4" />,
              onClick: () => onToggleStatus(u),
            },
          ];
          if (u.can_resend_set_password_link) {
            items.push({
              label: 'Resend set-password link',
              icon: <Mail className="size-4" />,
              onClick: () => onResend(u),
            });
          }
          items.push({
            label: 'Delete',
            icon: <Trash2 className="size-4" />,
            color: 'var(--color-destructive)',
            onClick: () => onDelete(u),
          });
          // Stop propagation so opening the actions menu does not also trigger
          // the row-click (which opens the Edit drawer).
          return (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <ActionMenu items={items} ariaLabel={`Actions for ${u.email}`} />
            </div>
          );
        },
      },
    ],
    [onEdit, onToggleStatus, onResend, onDelete],
  );

  return (
    <CommonTable<UserRow>
      columns={columns}
      data={users}
      loading={loading}
      enableSorting
      manualSorting
      sorting={sorting}
      onSortingChange={onSortingChange}
      enablePagination
      manualPagination
      pageIndex={page}
      pageSize={pageSize}
      rowCount={total}
      onPaginationChange={onPaginationChange}
      stickyHeader
      maxHeight="calc(100vh - 16rem)"
      getRowId={(row) => row.uuid}
      onRowClick={onEdit}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">No users found.</div>
      }
    />
  );
}
