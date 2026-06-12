import { useMemo } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { formatDateTime } from '../../../utils/format';
import { formatValue, personLabel, type LeadListItem } from '../api/crm';
import { StageBadge } from './StageBadge';

interface LeadsTableProps {
  leads: LeadListItem[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onRowClick: (lead: LeadListItem) => void;
}

export function LeadsTable({
  leads,
  loading,
  page,
  pageSize,
  total,
  onPaginationChange,
  sorting,
  onSortingChange,
  onRowClick,
}: LeadsTableProps) {
  const columns = useMemo<ColumnDef<LeadListItem, unknown>[]>(
    () => [
      {
        accessorKey: 'contact_name',
        header: 'Contact',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.contact_name}</span>
        ),
      },
      {
        id: 'clinic_name',
        header: 'Clinic',
        // Server-sortable (sort=clinic_name).
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-foreground">{row.original.clinic_name}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">{row.original.phone}</span>
        ),
      },
      {
        accessorKey: 'stage',
        header: 'Stage',
        enableSorting: false,
        meta: { align: 'center' },
        cell: ({ row }) => <StageBadge stage={row.original.stage} />,
      },
      {
        id: 'source',
        header: 'Source',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.source?.name ?? '—'}
          </span>
        ),
      },
      {
        id: 'assignee',
        header: 'Assignee',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {personLabel(row.original.assignee)}
          </span>
        ),
      },
      {
        id: 'estimated_annual_value',
        header: 'Est. value',
        // Server-sortable (sort=estimated_annual_value).
        meta: { align: 'center' },
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-foreground">
            {formatValue(row.original.estimated_annual_value)}
          </span>
        ),
      },
      {
        id: 'updated_at',
        header: 'Updated',
        // Server-sortable (sort=updated_at).
        meta: { align: 'center' },
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatDateTime(row.original.updated_at)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <CommonTable<LeadListItem>
      columns={columns}
      data={leads}
      loading={loading}
      enableSorting
      manualSorting
      sorting={sorting}
      onSortingChange={onSortingChange}
      enablePagination
      manualPagination
      pageIndex={page}
      pageSize={pageSize}
      rowCount={total}
      onPaginationChange={onPaginationChange}
      stickyHeader
      maxHeight="calc(100vh - 16rem)"
      getRowId={(row) => row.uuid}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">No leads yet.</div>
      }
    />
  );
}
