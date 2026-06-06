import { useMemo } from 'react';
import { formatCurrency } from '../../../utils/format';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { ProductRow } from '../api/products';
import { ActivePill } from './ActivePill';

export function ProductsTable({ products, loading }: { products: ProductRow[]; loading: boolean }) {
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
        cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.hsn ?? '—'}</span>,
      },
      {
        accessorKey: 'mrp',
        header: 'MRP',
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">
            {formatCurrency(row.original.mrp)}
          </span>
        ),
      },
      {
        accessorKey: 'gst_rate',
        header: 'GST',
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {row.original.gst_rate != null ? `${row.original.gst_rate}%` : '—'}
          </span>
        ),
      },
      {
        accessorKey: 'pack_size',
        header: 'Pack',
        cell: ({ row }) => <span className="text-foreground">{row.original.pack_size ?? '—'}</span>,
      },
      {
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => <ActivePill active={row.original.is_active} />,
      },
    ],
    [],
  );

  return (
    <CommonTable<ProductRow>
      columns={columns}
      data={products}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No products yet. Click “Add product” to create the first one.
        </div>
      }
    />
  );
}
