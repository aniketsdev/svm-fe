import { useMemo } from 'react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { RoleRow } from '../api/roles';
import { FeaturesBar } from './FeaturesBar';

const ROLE_TITLES: Record<string, string> = { admin: 'Admin', staff: 'Staff', user: 'User' };

interface RolesTableProps {
  roles: RoleRow[];
  totalPermissions: number;
  loading: boolean;
  onRowClick: (role: RoleRow) => void;
}

export function RolesTable({ roles, totalPermissions, loading, onRowClick }: RolesTableProps) {
  const columns = useMemo<ColumnDef<RoleRow, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Role',
        cell: ({ row }) => (
          <span className="font-medium text-primary">
            {ROLE_TITLES[row.original.name] ?? row.original.name}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.description}</span>,
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize text-secondary-foreground">
            {row.original.type}
          </span>
        ),
      },
      {
        id: 'features',
        header: 'Features enabled',
        cell: ({ row }) => (
          <FeaturesBar enabled={row.original.permissions.length} total={totalPermissions} />
        ),
      },
      {
        accessorKey: 'user_count',
        header: 'Users',
        cell: ({ row }) => <span className="text-foreground">{row.original.user_count}</span>,
      },
    ],
    [totalPermissions],
  );

  return (
    <CommonTable<RoleRow>
      columns={columns}
      data={roles}
      loading={loading}
      enableSorting
      getRowId={(row) => row.name}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">No roles found.</div>
      }
    />
  );
}
