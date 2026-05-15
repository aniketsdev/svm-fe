import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type SortingState,
  type Table as TanstackTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Paginator } from '../pagination';
import TableSkeleton from './TableSkeleton';

// Re-export TanStack Table types so legacy consumers' imports keep working.
export type { ColumnDef, Row, TanstackTable as Table };

export interface CommonTableProps<TRow> {
  columns: ColumnDef<TRow, unknown>[];
  data: TRow[];
  loading?: boolean;
  emptyState?: ReactNode;
  /** Override row id resolution; defaults to React index. */
  getRowId?: (row: TRow, index: number) => string;
  onRowClick?: (row: TRow) => void;

  // Sorting
  enableSorting?: boolean;
  defaultSorting?: SortingState;

  // Pagination
  enablePagination?: boolean;
  pageSize?: number;
  pageIndex?: number;
  onPaginationChange?: (state: { pageIndex: number; pageSize: number }) => void;

  // Layout
  density?: 'comfortable' | 'compact';
  stickyHeader?: boolean;
  className?: string;
  tableClassName?: string;
}

export function CommonTable<TRow>({
  columns,
  data,
  loading,
  emptyState,
  getRowId,
  onRowClick,
  enableSorting,
  defaultSorting,
  enablePagination,
  pageSize: pageSizeProp,
  pageIndex: pageIndexProp,
  onPaginationChange,
  density = 'comfortable',
  stickyHeader,
  className,
  tableClassName,
}: CommonTableProps<TRow>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting ?? []);
  const [internalPagination, setInternalPagination] = useState({
    pageIndex: pageIndexProp ?? 0,
    pageSize: pageSizeProp ?? 10,
  });

  const pagination = pageIndexProp !== undefined ? { pageIndex: pageIndexProp, pageSize: pageSizeProp ?? 10 } : internalPagination;

  const table = useReactTable<TRow>({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater;
      setInternalPagination(next);
      onPaginationChange?.(next);
    },
    getRowId: getRowId ? (row, idx) => getRowId(row, idx) : undefined,
    enableSorting: Boolean(enableSorting),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
  });

  const cellPadding = density === 'compact' ? 'px-3 py-2' : 'px-4 py-3';

  if (loading) {
    const headers = columns.map((c, i) => ({
      id: typeof c.id === 'string' ? c.id : `col-${i}`,
      label: typeof (c as { header?: unknown }).header === 'string' ? String((c as { header: string }).header) : '',
      width: 'auto',
    }));
    return (
      <div className={cn('overflow-hidden rounded-lg border border-border bg-background', className)}>
        <TableSkeleton headers={headers} rowCount={Math.max(3, pagination.pageSize)} />
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-background', className)} data-slot="root">
      <div className="overflow-x-auto">
        <table className={cn('w-full text-left text-sm', tableClassName)} data-slot="table">
          <thead className={cn('bg-secondary/50', stickyHeader && 'sticky top-0 z-10')}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const sort = h.column.getIsSorted();
                  const canSort = enableSorting && h.column.getCanSort();
                  return (
                    <th
                      key={h.id}
                      style={{ width: h.getSize() ? `${h.getSize()}px` : undefined }}
                      className={cn(
                        'border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                        cellPadding,
                        canSort && 'cursor-pointer select-none',
                      )}
                      onClick={canSort ? h.column.getToggleSortingHandler() : undefined}
                    >
                      <span className="inline-flex items-center gap-1">
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                        {canSort && (
                          sort === 'asc' ? (
                            <ChevronUp aria-hidden className="size-3" />
                          ) : sort === 'desc' ? (
                            <ChevronDown aria-hidden className="size-3" />
                          ) : (
                            <ChevronsUpDown aria-hidden className="size-3 opacity-40" />
                          )
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                  {emptyState ?? 'No data available'}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(
                    'border-b border-border/60 last:border-b-0',
                    onRowClick && 'cursor-pointer hover:bg-secondary/40',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={cn('text-foreground', cellPadding)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {enablePagination && data.length > 0 && (
        <div className="border-t border-border px-2">
          <Paginator
            page={pagination.pageIndex}
            totalPages={table.getPageCount()}
            totalRecord={data.length}
            defaultSize={pagination.pageSize}
            onPageChange={(_e, page) => table.setPageIndex(page)}
            onRecordsPerPageChange={(size) => table.setPageSize(size)}
          />
        </div>
      )}
    </div>
  );
}

/**
 * @deprecated The legacy `EnhancedTableTemplate` was a domain-specific table
 * hard-coded for `ClientData` rows. The migrated component is a generic
 * `CommonTable<TRow>` requiring `columns` and `data` props. This export is
 * kept as an alias so existing imports keep resolving, but consumers MUST
 * now pass `columns` and `data`.
 */
export const EnhancedTableTemplate = CommonTable;

export default CommonTable;
