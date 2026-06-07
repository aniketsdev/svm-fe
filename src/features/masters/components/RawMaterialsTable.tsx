import { useMemo } from 'react';
import { formatDate } from '../../../utils/format';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { RawMaterialRow } from '../api/raw-materials';
import { ActivePill } from './ActivePill';

export function RawMaterialsTable({
  materials,
  loading,
}: {
  materials: RawMaterialRow[];
  loading: boolean;
}) {
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
        cell: ({ row }) => <span className="text-foreground">{row.original.unit ?? '—'}</span>,
      },
      {
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => <ActivePill active={row.original.is_active} />,
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDate(row.original.created_at)}</span>
        ),
      },
    ],
    [],
  );

  return (
    <CommonTable<RawMaterialRow>
      columns={columns}
      data={materials}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No raw materials yet. Click “Add raw material” to create the first one.
        </div>
      }
    />
  );
}
