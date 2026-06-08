import { useMemo } from 'react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { formatCurrency, formatDate } from '../../../utils/format';
import { GrnStatusBadge } from './GrnStatusBadge';
import type { GrnRow } from '../api/grn';

interface GrnsTableProps {
  grns: GrnRow[];
  loading: boolean;
  onRowClick: (grn: GrnRow) => void;
}

export function GrnsTable({ grns, loading, onRowClick }: GrnsTableProps) {
  const columns = useMemo<ColumnDef<GrnRow, unknown>[]>(
    () => [
      {
        accessorKey: 'grn_no',
        header: 'GRN No.',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.grn_no}</span>,
      },
      {
        accessorKey: 'supplier_name',
        header: 'Supplier',
        cell: ({ row }) => <span className="text-foreground">{row.original.supplier_name ?? '—'}</span>,
      },
      {
        accessorKey: 'store_code',
        header: 'Store',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.store_code ?? '—'}</span>,
      },
      {
        id: 'items',
        header: 'Items',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="max-w-xs truncate text-foreground">{row.original.items_summary}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.line_count} {row.original.line_count === 1 ? 'line' : 'lines'}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'received_date',
        header: 'Received',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDate(row.original.received_date)}</span>
        ),
      },
      {
        accessorKey: 'grand_total',
        header: 'Total',
        cell: ({ row }) => (
          <span className="font-medium tabular-nums text-foreground">
            {formatCurrency(Number(row.original.grand_total))}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <GrnStatusBadge status={row.original.status} />,
      },
    ],
    [],
  );

  return (
    <CommonTable<GrnRow>
      columns={columns}
      data={grns}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={12}
      getRowId={(row) => String(row.id)}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No GRNs yet. Click “New GRN” to receive goods.
        </div>
      }
    />
  );
}
