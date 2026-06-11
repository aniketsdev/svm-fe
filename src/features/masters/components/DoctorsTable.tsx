import { useMemo } from 'react';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { DoctorRow } from '../api/doctors';
import { ActivePill } from './ActivePill';

export function DoctorsTable({ doctors, loading }: { doctors: DoctorRow[]; loading: boolean }) {
  const columns = useMemo<ColumnDef<DoctorRow, unknown>[]>(
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
        accessorKey: 'clinic_name',
        header: 'Clinic',
        cell: ({ row }) => <span className="text-foreground">{row.original.clinic_name ?? '—'}</span>,
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => <span className="text-foreground">{row.original.phone ?? '—'}</span>,
      },
      {
        accessorKey: 'city',
        header: 'City',
        cell: ({ row }) => <span className="text-foreground">{row.original.city ?? '—'}</span>,
      },
      {
        accessorKey: 'is_active',
        header: 'Active',
        meta: { align: 'center' },
        cell: ({ row }) => <ActivePill active={row.original.is_active} />,
      },
    ],
    [],
  );

  return (
    <CommonTable<DoctorRow>
      columns={columns}
      data={doctors}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No doctors yet. Click “Add doctor” to create the first one.
        </div>
      }
    />
  );
}
