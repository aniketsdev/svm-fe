import { useMemo } from 'react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { formatDate } from '../../../utils/format';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import type { DispatchRow } from '../api/dispatch';

interface Props {
  dispatches: DispatchRow[];
  loading: boolean;
  onRowClick: (d: DispatchRow) => void;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
}

export function DispatchesTable({ dispatches, loading, onRowClick, page, pageSize, total, onPaginationChange }: Props) {
  const columns = useMemo<ColumnDef<DispatchRow, unknown>[]>(
    () => [
      {
        accessorKey: 'challan_no',
        header: 'Challan',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.challan_no}</span>,
      },
      {
        accessorKey: 'customer_or_doctor',
        header: 'Customer',
        cell: ({ row }) => <span className="text-foreground">{row.original.customer_or_doctor ?? '—'}</span>,
      },
      {
        accessorKey: 'line_count',
        header: 'Items',
        meta: { align: 'center' },
        cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.original.line_count}</span>,
      },
      {
        accessorKey: 'total_quantity',
        header: 'Qty',
        meta: { align: 'center' },
        cell: ({ row }) => <span className="tabular-nums text-foreground">{row.original.total_quantity}</span>,
      },
      {
        accessorKey: 'invoice_no',
        header: 'Invoice',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.invoice_no ?? '—'}</span>,
      },
      {
        accessorKey: 'payment_status',
        header: 'Payment',
        meta: { align: 'center' },
        cell: ({ row }) => <PaymentStatusBadge status={row.original.payment_status} />,
      },
      {
        accessorKey: 'dispatch_date',
        header: 'Date',
        meta: { align: 'center' },
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.dispatch_date)}</span>,
      },
    ],
    [],
  );

  return (
    <CommonTable<DispatchRow>
      columns={columns}
      data={dispatches}
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
          No dispatches yet. Click “New Dispatch” to sell finished goods.
        </div>
      }
    />
  );
}
