import { useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { cn } from '../../../lib/cn';
import { formatDateTime } from '../../../utils/format';
import {
  formatSignedInventoryQuantity,
  movementDirectionLabel,
  movementKindLabel,
} from '../../../utils/inventory';
import type { MovementRow } from '../api/inventory';

function DirectionBadge({ direction }: { direction: string }) {
  const inbound = direction === 'in';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        inbound ? 'bg-positive/10 text-positive-70' : 'bg-warning/10 text-warning-60',
      )}
    >
      {inbound ? <ArrowDownLeft className="size-3" /> : <ArrowUpRight className="size-3" />}
      {movementDirectionLabel(direction)}
    </span>
  );
}

interface MovementsTableProps {
  movements: MovementRow[];
  loading: boolean;
  onRowClick?: (movement: MovementRow) => void;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
}

export function MovementsTable({ movements, loading, onRowClick, page, pageSize, total, onPaginationChange }: MovementsTableProps) {
  const columns = useMemo<ColumnDef<MovementRow, unknown>[]>(
    () => [
      {
        id: 'when',
        header: 'When',
        meta: { align: 'center' },
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatDateTime(row.original.created_at)}
          </span>
        ),
      },
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
        id: 'store',
        header: 'Store',
        cell: ({ row }) => (
          <span className="text-foreground">
            {row.original.store_name}
            {row.original.related_store_name && (
              <span className="text-muted-foreground">
                {row.original.direction === 'out' ? ' -> ' : ' <- '}
                {row.original.related_store_name}
              </span>
            )}
          </span>
        ),
      },
      {
        accessorKey: 'direction',
        header: 'Direction',
        meta: { align: 'center' },
        cell: ({ row }) => <DirectionBadge direction={row.original.direction} />,
      },
      {
        accessorKey: 'kind',
        header: 'Reason',
        cell: ({ row }) => (
          <span className="text-foreground">{movementKindLabel(row.original.kind)}</span>
        ),
      },
      {
        accessorKey: 'quantity',
        header: 'Qty',
        meta: { align: 'center' },
        cell: ({ row }) => (
          <span className="font-medium tabular-nums text-foreground">
            {formatSignedInventoryQuantity(
              row.original.direction,
              row.original.quantity,
              row.original.unit,
            )}
          </span>
        ),
      },
      {
        accessorKey: 'reference',
        header: 'Reference',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.reference || '-'}</span>
        ),
      },
      {
        id: 'by',
        header: 'By',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.created_by_email ?? '-'}</span>
        ),
      },
    ],
    [],
  );

  return (
    <CommonTable<MovementRow>
      columns={columns}
      data={movements}
      loading={loading}
      enableSorting
      enablePagination
      manualPagination
      pageIndex={page}
      pageSize={pageSize}
      rowCount={total}
      onPaginationChange={onPaginationChange}
      getRowId={(row) => String(row.id)}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No movements recorded yet.
        </div>
      }
    />
  );
}
