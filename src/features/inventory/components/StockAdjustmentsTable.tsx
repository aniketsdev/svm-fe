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
}

export function StockAdjustmentsTable({ adjustments, loading, onRowClick }: Props) {
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
      pageSize={12}
      getRowId={(row) => String(row.id)}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No adjustments yet. Click “New Adjustment” to correct a batch’s stock.
        </div>
      }
    />
  );
}
