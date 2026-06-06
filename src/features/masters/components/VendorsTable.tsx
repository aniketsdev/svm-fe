import { useMemo } from 'react';
import { formatDate } from '../../../utils/format';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { VendorRow } from '../api/vendors';
import { ActivePill } from './ActivePill';

export function VendorsTable({ vendors, loading }: { vendors: VendorRow[]; loading: boolean }) {
  const columns = useMemo<ColumnDef<VendorRow, unknown>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => <span className="font-mono text-xs text-foreground">{row.original.code}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>,
      },
      {
        accessorKey: 'gstin',
        header: 'GSTIN',
        cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.gstin ?? '—'}</span>,
      },
      {
        accessorKey: 'state_code',
        header: 'State',
        cell: ({ row }) => <span className="text-foreground">{row.original.state_code ?? '—'}</span>,
      },
      {
        accessorKey: 'city',
        header: 'City',
        cell: ({ row }) => <span className="text-foreground">{row.original.city ?? '—'}</span>,
      },
      {
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => <ActivePill active={row.original.is_active} />,
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDate(row.original.created_at)}</span>
        ),
      },
    ],
    [],
  );

  return (
    <CommonTable<VendorRow>
      columns={columns}
      data={vendors}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No vendors yet. Click “Add vendor” to create the first one.
        </div>
      }
    />
  );
}
