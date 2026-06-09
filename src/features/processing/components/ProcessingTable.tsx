import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { formatDate } from '../../../utils/format';
import { ProcessingStatusBadge } from './ProcessingStatusBadge';
import type { ProcessingRow } from '../api/processing';

interface Props {
  orders: ProcessingRow[];
  loading: boolean;
  onRowClick: (o: ProcessingRow) => void;
}

export function ProcessingTable({ orders, loading, onRowClick }: Props) {
  const columns = useMemo<ColumnDef<ProcessingRow, unknown>[]>(
    () => [
      {
        accessorKey: 'pr_no',
        header: 'Order No.',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.pr_no}</span>,
      },
      {
        id: 'conversion',
        header: 'Conversion',
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 text-foreground">
            {row.original.input_material_name}
            <ArrowRight className="size-3.5 text-muted-foreground" />
            {row.original.output_material_name}
          </span>
        ),
      },
      {
        accessorKey: 'from_store_name',
        header: 'From store',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.from_store_name}</span>,
      },
      {
        accessorKey: 'quantity_to_consume',
        header: 'Consume',
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">{row.original.quantity_to_consume}</span>
        ),
      },
      {
        accessorKey: 'output_quantity',
        header: 'Output',
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">{row.original.output_quantity ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <ProcessingStatusBadge status={row.original.status} />,
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
    <CommonTable<ProcessingRow>
      columns={columns}
      data={orders}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={12}
      getRowId={(row) => String(row.id)}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No processing orders yet. Click “New Processing” to convert materials.
        </div>
      }
    />
  );
}
