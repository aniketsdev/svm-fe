import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { formatDate } from '../../../utils/format';
import { DocStatusBadge } from './DocStatusBadge';
import type { TransferRow } from '../api/stock-transfers';

interface Props {
  transfers: TransferRow[];
  loading: boolean;
  onRowClick: (t: TransferRow) => void;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
}

export function StockTransfersTable({ transfers, loading, onRowClick, page, pageSize, total, onPaginationChange }: Props) {
  const columns = useMemo<ColumnDef<TransferRow, unknown>[]>(
    () => [
      {
        accessorKey: 'st_no',
        header: 'Transfer No.',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.st_no}</span>,
      },
      {
        id: 'route',
        header: 'From → To',
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 text-foreground">
            {row.original.from_store_code ?? '—'}
            <ArrowRight className="size-3.5 text-muted-foreground" />
            {row.original.to_store_code ?? '—'}
          </span>
        ),
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
        accessorKey: 'requested_at',
        header: 'Requested',
        meta: { align: 'center' },
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDate(row.original.requested_at)}</span>
        ),
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
    <CommonTable<TransferRow>
      columns={columns}
      data={transfers}
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
          No transfers yet. Click “New Transfer” to move stock between stores.
        </div>
      }
    />
  );
}
