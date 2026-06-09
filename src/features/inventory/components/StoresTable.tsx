import { useMemo } from 'react';
import { Pencil } from 'lucide-react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { StoreOut } from '../../../sdk/schemas';

const TYPE_LABEL: Record<string, string> = {
  finished_goods: 'Finished goods',
  raw_material: 'Raw material',
};

interface Props {
  stores: StoreOut[];
  loading: boolean;
  onEdit: (s: StoreOut) => void;
}

export function StoresTable({ stores, loading, onEdit }: Props) {
  const columns = useMemo<ColumnDef<StoreOut, unknown>[]>(
    () => [
      {
        accessorKey: 'store_code',
        header: 'Code',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.store_code}</span>,
      },
      {
        accessorKey: 'store_name',
        header: 'Name',
        cell: ({ row }) => <span className="text-foreground">{row.original.store_name}</span>,
      },
      {
        accessorKey: 'store_type',
        header: 'Type',
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {TYPE_LABEL[row.original.store_type] ?? row.original.store_type}
          </span>
        ),
      },
      {
        accessorKey: 'total_available_units',
        header: 'On hand',
        cell: ({ row }) => (
          <span className="font-medium tabular-nums text-foreground">{row.original.total_available_units}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onEdit(row.original)}
              aria-label={`Edit ${row.original.store_code}`}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Pencil className="size-4" />
            </button>
          </div>
        ),
      },
    ],
    [onEdit],
  );

  return (
    <CommonTable<StoreOut>
      columns={columns}
      data={stores}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={12}
      getRowId={(row) => row.uuid}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No stores yet. Click “New Store” to add one.
        </div>
      }
    />
  );
}
