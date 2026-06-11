import { useMemo } from 'react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { cn } from '../../../lib/cn';
import { DocStatusBadge } from './DocStatusBadge';
import type { AdjustmentRow } from '../api/stock-adjustments';

const REASON_LABEL: Record<string, string> = {
  damage: 'Damage',
  loss: 'Loss',
  gain: 'Gain',
  expiry_write_off: 'Expiry write-off',
  audit_correction: 'Audit correction',
};

interface Props {
  adjustments: AdjustmentRow[];
  loading: boolean;
  onRowClick: (a: AdjustmentRow) => void;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
}

export function StockAdjustmentsTable({ adjustments, loading, onRowClick, page, pageSize, total, onPaginationChange }: Props) {
  const columns = useMemo<ColumnDef<AdjustmentRow, unknown>[]>(
    () => [
      {
        accessorKey: 'adj_no',
        header: 'Adj. No.',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.adj_no}</span>,
      },
      {
        accessorKey: 'store_code',
        header: 'Store',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.store_code ?? '—'}</span>,
      },
      {
        accessorKey: 'material_name',
        header: 'Material',
        cell: ({ row }) => <span className="text-foreground">{row.original.material_name ?? '—'}</span>,
      },
      {
        accessorKey: 'reason',
        header: 'Reason',
        cell: ({ row }) => (
          <span className="text-foreground">{REASON_LABEL[row.original.reason] ?? row.original.reason}</span>
        ),
      },
      {
        accessorKey: 'delta_quantity',
        header: 'Δ Qty',
        meta: { align: 'center' },
        cell: ({ row }) => {
          const d = row.original.delta_quantity;
          const negative = d.trim().startsWith('-');
          return (
            <span className={cn('font-medium tabular-nums', negative ? 'text-destructive' : 'text-positive-70')}>
              {d}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { align: 'center' },
        cell: ({ row }) => <DocStatusBadge status={row.original.status} />,
      },
    ],
    [],
  );

  return (
    <CommonTable<AdjustmentRow>
      columns={columns}
      data={adjustments}
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
          No adjustments yet. Click “New Adjustment” to correct a batch’s stock.
        </div>
      }
    />
  );
}
