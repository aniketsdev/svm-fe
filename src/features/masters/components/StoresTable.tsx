import { useMemo } from 'react';
import { formatDate } from '../../../utils/format';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { cn } from '../../../lib/cn';
import type { StoreRow } from '../api/stores';

const KIND_LABELS: Record<string, string> = {
  warehouse: 'Warehouse',
  factory: 'Factory',
  retail: 'Retail',
  store: 'Store',
};

interface StoresTableProps {
  stores: StoreRow[];
  loading: boolean;
}

export function StoresTable({ stores, loading }: StoresTableProps) {
  const columns = useMemo<ColumnDef<StoreRow, unknown>[]>(
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
        accessorKey: 'kind',
        header: 'Type',
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {KIND_LABELS[row.original.kind] ?? row.original.kind}
          </span>
        ),
      },
      {
        accessorKey: 'city',
        header: 'City',
        cell: ({ row }) => <span className="text-foreground">{row.original.city ?? '—'}</span>,
      },
      {
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => {
          const on = row.original.is_active;
          return (
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                on ? 'bg-positive/10 text-positive' : 'bg-muted text-muted-foreground',
              )}
            >
              <span className={cn('size-1.5 rounded-full', on ? 'bg-positive' : 'bg-muted-foreground/50')} />
              {on ? 'Active' : 'Inactive'}
            </span>
          );
        },
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
    <CommonTable<StoreRow>
      columns={columns}
      data={stores}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No stores yet. Click “Add store” to create the first one.
        </div>
      }
    />
  );
}
