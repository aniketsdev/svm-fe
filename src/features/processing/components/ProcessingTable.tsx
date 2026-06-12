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
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
}

export function ProcessingTable({ orders, loading, onRowClick, page, pageSize, total, onPaginationChange }: Props) {
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
        meta: { align: 'center' },
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">{row.original.quantity_to_consume}</span>
        ),
      },
      {
        accessorKey: 'output_quantity',
        header: 'Output',
        meta: { align: 'center' },
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">{row.original.output_quantity ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { align: 'center' },
        cell: ({ row }) => <ProcessingStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        meta: { align: 'center' },
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
      manualPagination
      pageIndex={page}
      pageSize={pageSize}
      rowCount={total}
      onPaginationChange={onPaginationChange}
      getRowId={(row) => row.uuid}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No processing orders yet. Click “New Processing” to convert materials.
        </div>
      }
    />
  );
}
