import { useMemo } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { Paperclip, Pencil, Power } from 'lucide-react';
import { formatDate } from '../../../utils/format';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { ActionMenu } from '../../../common/action-menu';
import type { RawMaterialRow } from '../api/raw-materials';
import { ActivePill } from './ActivePill';

export interface RawMaterialsTableProps {
  materials: RawMaterialRow[];
  loading: boolean;
  /** Server-side list state (feature 027). */
  rowCount: number;
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
  onSortingChange: (sorting: SortingState) => void;
  onEdit: (material: RawMaterialRow) => void;
  onDocuments: (material: RawMaterialRow) => void;
  onToggleStatus: (material: RawMaterialRow) => void;
}

export function RawMaterialsTable({
  materials,
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
}: RawMaterialsTableProps) {
  const columns = useMemo<ColumnDef<RawMaterialRow, unknown>[]>(
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
        accessorKey: 'rm_category_name',
        header: 'Category',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.rm_category_name ? (
            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {row.original.rm_category_name}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'unit',
        header: 'Unit',
        enableSorting: false,
        cell: ({ row }) => <span className="text-foreground">{row.original.unit ?? '—'}</span>,
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
        meta: { align: 'center' },
        cell: ({ row }) => <ActivePill active={row.original.is_active} />,
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        meta: { align: 'center' },
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDate(row.original.created_at)}</span>
        ),
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
    <CommonTable<RawMaterialRow>
      columns={columns}
      data={materials}
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
          No raw materials yet. Click “Add raw material” to create the first one.
        </div>
      }
    />
  );
}
