import { useMemo } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { Paperclip, Pencil, Power } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { ActionMenu } from '../../../common/action-menu';
import type { ProductRow } from '../api/products';
import { ActivePill } from './ActivePill';

export interface ProductsTableProps {
  products: ProductRow[];
  loading: boolean;
  /** Server-side list state (feature 027). */
  rowCount: number;
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
  onSortingChange: (sorting: SortingState) => void;
  onEdit: (product: ProductRow) => void;
  onDocuments: (product: ProductRow) => void;
  onToggleStatus: (product: ProductRow) => void;
}

export function ProductsTable({
  products,
  loading,
  rowCount,
  pageIndex,
  pageSize,
  sorting,
  onPaginationChange,
  onSortingChange,
  onEdit,
  onDocuments,
  onToggleStatus,
}: ProductsTableProps) {
  const columns = useMemo<ColumnDef<ProductRow, unknown>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => <span className="font-mono text-xs text-foreground">{row.original.code}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>,
      },
      {
        accessorKey: 'hsn',
        header: 'HSN',
        enableSorting: false,
        cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.hsn ?? '—'}</span>,
      },
      {
        accessorKey: 'mrp',
        header: 'MRP',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">
            {formatCurrency(row.original.mrp)}
          </span>
        ),
      },
      {
        accessorKey: 'gst_rate',
        header: 'GST',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {row.original.gst_rate != null ? `${row.original.gst_rate}%` : '—'}
          </span>
        ),
      },
      {
        accessorKey: 'pack_size',
        header: 'Pack',
        enableSorting: false,
        cell: ({ row }) => <span className="text-foreground">{row.original.pack_size ?? '—'}</span>,
      },
      {
        accessorKey: 'media_count',
        header: 'Docs',
        enableSorting: false,
        cell: ({ row }) =>
          (row.original.media_count ?? 0) > 0 ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDocuments(row.original);
              }}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/70"
              aria-label={`${row.original.media_count} documents`}
            >
              <Paperclip className="size-3" /> {row.original.media_count}
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => <ActivePill active={row.original.is_active} />,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <ActionMenu
            ariaLabel={`Actions for ${row.original.name}`}
            items={[
              { label: 'Edit', icon: <Pencil className="size-4" />, onClick: () => onEdit(row.original) },
              { label: 'Documents', icon: <Paperclip className="size-4" />, onClick: () => onDocuments(row.original) },
              {
                label: row.original.is_active ? 'Deactivate' : 'Activate',
                icon: <Power className="size-4" />,
                onClick: () => onToggleStatus(row.original),
                color: row.original.is_active ? 'text-destructive' : undefined,
              },
            ]}
          />
        ),
      },
    ],
    [onEdit, onDocuments, onToggleStatus],
  );

  return (
    <CommonTable<ProductRow>
      columns={columns}
      data={products}
      loading={loading}
      enableSorting
      manualSorting
      sorting={sorting}
      onSortingChange={onSortingChange}
      enablePagination
      manualPagination
      rowCount={rowCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPaginationChange={onPaginationChange}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No products yet. Click “Add product” to create the first one.
        </div>
      }
    />
  );
}
