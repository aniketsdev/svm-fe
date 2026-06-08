import { useMemo } from 'react';
import { Pencil } from 'lucide-react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { MaterialOut } from '../../../sdk/schemas';

const TYPE_LABEL: Record<string, string> = { rm: 'Raw material', fg: 'Finished good' };

interface Props {
  materials: MaterialOut[];
  loading: boolean;
  onEdit: (m: MaterialOut) => void;
}

export function MaterialsTable({ materials, loading, onEdit }: Props) {
  const columns = useMemo<ColumnDef<MaterialOut, unknown>[]>(
    () => [
      {
        accessorKey: 'material_code',
        header: 'Code',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.material_code}</span>,
      },
      {
        accessorKey: 'material_name',
        header: 'Name',
        cell: ({ row }) => <span className="text-foreground">{row.original.material_name}</span>,
      },
      {
        accessorKey: 'material_type',
        header: 'Type',
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {TYPE_LABEL[row.original.material_type] ?? row.original.material_type}
          </span>
        ),
      },
      {
        accessorKey: 'uom',
        header: 'UOM',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.uom}</span>,
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
              aria-label={`Edit ${row.original.material_code}`}
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
    <CommonTable<MaterialOut>
      columns={columns}
      data={materials}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={12}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No materials yet. Click “New Material” to add one.
        </div>
      }
    />
  );
}
