import { useMemo } from 'react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { cn } from '../../../lib/cn';
import { formatDate } from '../../../utils/format';
import { BatchStatusBadge } from './BatchStatusBadge';
import type { BatchRow } from '../api/batches';

function ExpiryCell({ date, days }: { date: string | null; days: number | null }) {
  if (!date) return <span className="text-muted-foreground">—</span>;
  const tone =
    days == null ? 'text-foreground' : days < 0 ? 'text-destructive' : days < 30 ? 'text-warning-60' : 'text-foreground';
  return (
    <span className={cn('whitespace-nowrap', tone)}>
      {formatDate(date)}
      {days != null && (
        <span className="text-xs"> · {days < 0 ? `expired ${-days}d ago` : `${days}d left`}</span>
      )}
    </span>
  );
}

interface Props {
  batches: BatchRow[];
  loading: boolean;
  onRowClick: (b: BatchRow) => void;
}

export function BatchesTable({ batches, loading, onRowClick }: Props) {
  const columns = useMemo<ColumnDef<BatchRow, unknown>[]>(
    () => [
      {
        id: 'item',
        header: 'Item',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-foreground">{row.original.material_name}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.material_code} · {row.original.kind === 'fg' ? 'Finished goods' : 'Raw material'}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'batch_no',
        header: 'Batch',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.batch_no}</span>,
      },
      {
        accessorKey: 'store_code',
        header: 'Store',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.store_code}</span>,
      },
      {
        accessorKey: 'quantity',
        header: 'On hand',
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">
            {row.original.quantity} {row.original.uom}
          </span>
        ),
      },
      {
        id: 'expiry',
        header: 'Expiry',
        cell: ({ row }) => <ExpiryCell date={row.original.expiry_date} days={row.original.days_remaining} />,
      },
      {
        id: 'fefo',
        header: 'FEFO',
        cell: ({ row }) =>
          row.original.fefo_rank != null ? (
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
              {row.original.fefo_rank}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <BatchStatusBadge status={row.original.status} />,
      },
    ],
    [],
  );

  return (
    <CommonTable<BatchRow>
      columns={columns}
      data={batches}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={15}
      getRowId={(row) => String(row.batch_id)}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No batches in stock for this filter.
        </div>
      }
    />
  );
}
