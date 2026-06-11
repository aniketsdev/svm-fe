import { useMemo } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { Paperclip, Pencil, Power } from 'lucide-react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { ActionMenu } from '../../../common/action-menu';
import { formatCurrency, formatDate } from '../../../utils/format';
import type { DoctorPricingRow } from '../api/doctor-pricing';
import { ActivePill } from './ActivePill';

export interface DoctorPricingTableProps {
  pricing: DoctorPricingRow[];
  loading: boolean;
  /** Server-side list state (feature 027). */
  rowCount: number;
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
  onSortingChange: (sorting: SortingState) => void;
  onEdit: (pricing: DoctorPricingRow) => void;
  onDocuments: (pricing: DoctorPricingRow) => void;
  onToggleStatus: (pricing: DoctorPricingRow) => void;
}

export function DoctorPricingTable({
  pricing,
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
}: DoctorPricingTableProps) {
  const columns = useMemo<ColumnDef<DoctorPricingRow, unknown>[]>(
    () => [
      {
        accessorKey: 'doctor_name',
        header: 'Doctor',
        enableSorting: false,
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.doctor_name}</span>,
      },
      {
        accessorKey: 'product_name',
        header: 'Product',
        enableSorting: false,
        cell: ({ row }) => <span className="text-foreground">{row.original.product_name}</span>,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">{formatCurrency(row.original.price)}</span>
        ),
      },
      {
        accessorKey: 'valid_from',
        header: 'Valid from',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.valid_from)}</span>,
      },
      {
        accessorKey: 'valid_to',
        header: 'Valid to',
        enableSorting: false,
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.valid_to)}</span>,
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
            ariaLabel={`Actions for ${row.original.doctor_name} — ${row.original.product_name}`}
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
    <CommonTable<DoctorPricingRow>
      columns={columns}
      data={pricing}
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
          No pricing yet. Click “Add pricing” to create the first one.
        </div>
      }
    />
  );
}
