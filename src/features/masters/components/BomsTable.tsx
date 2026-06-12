import { useMemo } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { Paperclip, Pencil, Power } from 'lucide-react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { ActionMenu } from '../../../common/action-menu';
import type { BomRow } from '../api/boms';
import { ActivePill } from './ActivePill';

export interface BomsTableProps {
  boms: BomRow[];
  loading: boolean;
  /** Server-side list state (feature 027). */
  rowCount: number;
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
  onSortingChange: (sorting: SortingState) => void;
  /** Row click keeps opening the read-only BOM detail dialog. */
  onRowClick: (bom: BomRow) => void;
  onEdit: (bom: BomRow) => void;
  onDocuments: (bom: BomRow) => void;
  onToggleStatus: (bom: BomRow) => void;
}

export function BomsTable({
  boms,
  loading,
  rowCount,
  pageIndex,
  pageSize,
  sorting,
  onPaginationChange,
  onSortingChange,
  onRowClick,
  onEdit,
  onDocuments,
  onToggleStatus,
}: BomsTableProps) {
  const columns = useMemo<ColumnDef<BomRow, unknown>[]>(
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
        accessorKey: 'product_name',
        header: 'Product',
        enableSorting: false,
        cell: ({ row }) => <span className="text-foreground">{row.original.product_name ?? '—'}</span>,
      },
      {
        accessorKey: 'line_count',
        header: 'Lines',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {row.original.line_count} {row.original.line_count === 1 ? 'item' : 'items'}
          </span>
        ),
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
    <CommonTable<BomRow>
      columns={columns}
      data={boms}
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
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No BOMs yet. Click “Add BOM” to create the first one.
        </div>
      }
    />
  );
}
