import { useMemo } from 'react';
import { Mail, Pencil, Power, Trash2 } from 'lucide-react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { ActionMenu, type ActionMenuItem } from '../../../common/action-menu';
import { fullName, formatDateTime } from '../../../utils/format';
import type { UserRow } from '../api/users';
import { RoleBadge } from './RoleBadge';
import { StatusPill } from './StatusPill';

interface UsersTableProps {
  users: UserRow[];
  loading: boolean;
  onEdit: (u: UserRow) => void;
  onToggleStatus: (u: UserRow) => void;
  onResend: (u: UserRow) => void;
  onDelete: (u: UserRow) => void;
}

export function UsersTable({
  users,
  loading,
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
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.email}</span>,
      },
      {
        id: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <span className="text-foreground">
            {fullName(row.original.first_name, row.original.last_name)}
          </span>
        ),
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
        id: 'last_login',
        header: 'Last login',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDateTime(row.original.last_login_at)}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
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
          return (
            <div className="flex justify-end">
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
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">No users found.</div>
      }
    />
  );
}
