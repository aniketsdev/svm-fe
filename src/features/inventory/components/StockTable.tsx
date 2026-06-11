import { useMemo } from 'react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { cn } from '../../../lib/cn';
import {
  formatInventoryQuantity,
  inventoryTypeLabel,
  stockStatus,
  stockStatusLabel,
  type StockStatus,
} from '../../../utils/inventory';
import type { StockRow } from '../api/inventory';

function StatusPill({ status }: { status: StockStatus }) {
  return (
    <span
      className={cn(
        'inline-flex min-w-16 items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        status === 'ok' && 'bg-positive/10 text-positive-70',
        status === 'low' && 'bg-warning/10 text-warning-60',
        status === 'out' && 'bg-destructive/10 text-destructive',
      )}
    >
      {stockStatusLabel(status)}
    </span>
  );
}

interface StockTableProps {
  stock: StockRow[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
}

export function StockTable({ stock, loading, page, pageSize, total, onPaginationChange }: StockTableProps) {
  const columns = useMemo<ColumnDef<StockRow, unknown>[]>(
    () => [
      {
        id: 'item',
        header: 'Item',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{row.original.item_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.item_code}</span>
          </div>
        ),
      },
      {
        accessorKey: 'store_name',
        header: 'Store',
        cell: ({ row }) => <span className="text-foreground">{row.original.store_name}</span>,
      },
      {
        accessorKey: 'item_type',
        header: 'Type',
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {inventoryTypeLabel(row.original.item_type)}
          </span>
        ),
      },
      {
        accessorKey: 'quantity',
        header: 'On hand',
        cell: ({ row }) => {
          const q = row.original.quantity;
          const status = stockStatus(q);
          return (
            <span
              className={cn(
                'font-medium tabular-nums',
                status === 'out' ? 'text-destructive' : 'text-foreground',
              )}
            >
              {formatInventoryQuantity(q, row.original.unit)}
            </span>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusPill status={stockStatus(row.original.quantity)} />,
      },
    ],
    [],
  );

  return (
    <CommonTable<StockRow>
      columns={columns}
      data={stock}
      loading={loading}
      enableSorting
      enablePagination
      manualPagination
      pageIndex={page}
      pageSize={pageSize}
      rowCount={total}
      onPaginationChange={onPaginationChange}
      getRowId={(row) => `${row.store_uuid}-${row.item_type}-${row.item_id}`}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No stock yet. Record a movement to get started.
        </div>
      }
    />
  );
}
