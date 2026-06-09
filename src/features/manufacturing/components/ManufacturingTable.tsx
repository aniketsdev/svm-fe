import { useMemo } from 'react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { formatDate } from '../../../utils/format';
import { ManufacturingStatusBadge } from './ManufacturingStatusBadge';
import type { ManufacturingRow } from '../api/manufacturing';

interface Props {
  orders: ManufacturingRow[];
  loading: boolean;
  onRowClick: (o: ManufacturingRow) => void;
}

export function ManufacturingTable({ orders, loading, onRowClick }: Props) {
  const columns = useMemo<ColumnDef<ManufacturingRow, unknown>[]>(
    () => [
      {
        accessorKey: 'mo_no',
        header: 'MO No.',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.mo_no}</span>,
      },
      {
        accessorKey: 'product_name',
        header: 'Product',
        cell: ({ row }) => <span className="text-foreground">{row.original.product_name}</span>,
      },
      {
        accessorKey: 'planned_output_qty',
        header: 'Planned',
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">
            {row.original.planned_output_qty}
            {row.original.uom ? ` ${row.original.uom}` : ''}
          </span>
        ),
      },
      {
        accessorKey: 'actual_output_qty',
        header: 'Produced',
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">{row.original.actual_output_qty ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'yield',
        header: 'Yield',
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">{row.original.yield ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <ManufacturingStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.created_at)}</span>,
      },
    ],
    [],
  );

  return (
    <CommonTable<ManufacturingRow>
      columns={columns}
      data={orders}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={12}
      getRowId={(row) => row.uuid}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No manufacturing orders yet. Click “New Order” to produce a finished product from a BOM.
        </div>
      }
    />
  );
}
