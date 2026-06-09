import { useMemo } from 'react';
import { Eye, Pencil, Power, Trash2 } from 'lucide-react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { ActionMenu, type ActionMenuItem } from '../../../common/action-menu';
import { cn } from '../../../lib/cn';
import { formatDateTime } from '../../../utils/format';
import type { RoleRow } from '../api/roles';
import { RoleStatusBadge } from './RoleStatusBadge';

interface RolesTableProps {
  roles: RoleRow[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
  onRowClick: (role: RoleRow) => void;
  onEdit: (role: RoleRow) => void;
  onToggleStatus: (role: RoleRow) => void;
  onDelete: (role: RoleRow) => void;
  /** When false, the actions column is hidden (read-only callers). */
  canManage: boolean;
}

/** Capitalized tier badge (admin / staff). */
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

export function RolesTable({
  roles,
  loading,
  page,
  pageSize,
  total,
  onPaginationChange,
  onRowClick,
  onEdit,
  onToggleStatus,
  onDelete,
  canManage,
}: RolesTableProps) {
  const columns = useMemo<ColumnDef<RoleRow, unknown>[]>(() => {
    const base: ColumnDef<RoleRow, unknown>[] = [
      {
        accessorKey: 'name',
        header: 'Role',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-medium capitalize text-foreground">{row.original.name}</span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="block max-w-md truncate text-muted-foreground">
            {row.original.description || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Tier',
        enableSorting: false,
        cell: ({ row }) => <TierBadge tier={row.original.type} />,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => <RoleStatusBadge status={row.original.status} />,
      },
      {
        id: 'permissions',
        header: 'Permissions',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-foreground">{row.original.permissions.length}</span>
        ),
      },
      {
        id: 'updated',
        header: 'Updated',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatDateTime(row.original.updated_at)}
          </span>
        ),
      },
    ];

    if (canManage) {
      base.push({
        id: 'actions',
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => {
          const role = row.original;
          const items: ActionMenuItem[] = [
            { label: 'View', icon: <Eye className="size-4" />, onClick: () => onRowClick(role) },
            { label: 'Edit', icon: <Pencil className="size-4" />, onClick: () => onEdit(role) },
            {
              label: role.status === 'active' ? 'Deactivate' : 'Activate',
              icon: <Power className="size-4" />,
              onClick: () => onToggleStatus(role),
            },
          ];
          // Built-in (system) roles cannot be deleted.
          if (!role.is_system) {
            items.push({
              label: 'Delete',
              icon: <Trash2 className="size-4" />,
              color: 'var(--color-destructive)',
              onClick: () => onDelete(role),
            });
          }
          // Stop propagation so opening the menu does not also trigger the
          // row-click (which opens the detail dialog).
          return (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <ActionMenu items={items} ariaLabel={`Actions for ${role.name}`} />
            </div>
          );
        },
      });
    }

    return base;
  }, [canManage, onRowClick, onEdit, onToggleStatus, onDelete]);

  return (
    <CommonTable<RoleRow>
      columns={columns}
      data={roles}
      loading={loading}
      enablePagination
      manualPagination
      pageIndex={page}
      pageSize={pageSize}
      rowCount={total}
      onPaginationChange={onPaginationChange}
      stickyHeader
      maxHeight="calc(100vh - 16rem)"
      getRowId={(row) => row.uuid}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">No roles found.</div>
      }
    />
  );
}
