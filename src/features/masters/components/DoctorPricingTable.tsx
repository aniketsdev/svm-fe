import { useMemo } from 'react';
import dayjs from 'dayjs';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { DoctorPricingRow } from '../api/doctor-pricing';

function fmtDate(v: string | null | undefined): string {
  return v ? dayjs(v).format('DD MMM YYYY') : '—';
}

export function DoctorPricingTable({
  pricing,
  loading,
}: {
  pricing: DoctorPricingRow[];
  loading: boolean;
}) {
  const columns = useMemo<ColumnDef<DoctorPricingRow, unknown>[]>(
    () => [
      {
        accessorKey: 'doctor_name',
        header: 'Doctor',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.doctor_name}</span>,
      },
      {
        accessorKey: 'product_name',
        header: 'Product',
        cell: ({ row }) => <span className="text-foreground">{row.original.product_name}</span>,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">₹{row.original.price.toFixed(2)}</span>
        ),
      },
      {
        accessorKey: 'valid_from',
        header: 'Valid from',
        cell: ({ row }) => <span className="text-muted-foreground">{fmtDate(row.original.valid_from)}</span>,
      },
      {
        accessorKey: 'valid_to',
        header: 'Valid to',
        cell: ({ row }) => <span className="text-muted-foreground">{fmtDate(row.original.valid_to)}</span>,
      },
    ],
    [],
  );

  return (
    <CommonTable<DoctorPricingRow>
      columns={columns}
      data={pricing}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No pricing yet. Click “Add pricing” to create the first one.
        </div>
      }
    />
  );
}
