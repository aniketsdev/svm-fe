import { useMemo } from 'react';
import { formatDate } from '../../../utils/format';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { RmCategoryRow } from '../api/rm-categories';
import { ActivePill } from './ActivePill';

export function RmCategoriesTable({
  categories,
  loading,
}: {
  categories: RmCategoryRow[];
  loading: boolean;
}) {
  const columns = useMemo<ColumnDef<RmCategoryRow, unknown>[]>(
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
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.description ?? '—'}</span>,
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
    ],
    [],
  );

  return (
    <CommonTable<RmCategoryRow>
      columns={columns}
      data={categories}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No categories yet. Click “Add category” to create the first one.
        </div>
      }
    />
  );
}
