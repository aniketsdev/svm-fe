import { useMemo } from 'react';
import dayjs from 'dayjs';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { CourierRow } from '../api/couriers';
import { ActivePill } from './ActivePill';

export function CouriersTable({ couriers, loading }: { couriers: CourierRow[]; loading: boolean }) {
  const columns = useMemo<ColumnDef<CourierRow, unknown>[]>(
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
        accessorKey: 'contact_phone',
        header: 'Phone',
        cell: ({ row }) => <span className="text-foreground">{row.original.contact_phone ?? '—'}</span>,
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
          <span className="text-muted-foreground">{dayjs(row.original.created_at).format('DD MMM YYYY')}</span>
        ),
      },
    ],
    [],
  );

  return (
    <CommonTable<CourierRow>
      columns={columns}
      data={couriers}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No courier partners yet. Click “Add courier” to create the first one.
        </div>
      }
    />
  );
}
