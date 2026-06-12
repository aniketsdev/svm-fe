import { useMemo } from 'react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { BomRow } from '../api/boms';
import { ActivePill } from './ActivePill';

interface BomsTableProps {
  boms: BomRow[];
  loading: boolean;
  onRowClick: (bom: BomRow) => void;
}

export function BomsTable({ boms, loading, onRowClick }: BomsTableProps) {
  const columns = useMemo<ColumnDef<BomRow, unknown>[]>(
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
        accessorKey: 'product_name',
        header: 'Product',
        cell: ({ row }) => <span className="text-foreground">{row.original.product_name ?? '—'}</span>,
      },
      {
        accessorKey: 'line_count',
        header: 'Lines',
        meta: { align: 'center' },
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {row.original.line_count} {row.original.line_count === 1 ? 'item' : 'items'}
          </span>
        ),
      },
      {
        accessorKey: 'is_active',
        header: 'Active',
        meta: { align: 'center' },
        cell: ({ row }) => <ActivePill active={row.original.is_active} />,
      },
    ],
    [],
  );

  return (
    <CommonTable<BomRow>
      columns={columns}
      data={boms}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No BOMs yet. Click “Add BOM” to create the first one.
        </div>
      }
    />
  );
}
