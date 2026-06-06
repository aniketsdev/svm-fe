import { useMemo } from 'react';
import { formatDate } from '../../../utils/format';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { DoctorAliasRow } from '../api/doctor-aliases';

export function DoctorAliasesTable({
  aliases,
  loading,
}: {
  aliases: DoctorAliasRow[];
  loading: boolean;
}) {
  const columns = useMemo<ColumnDef<DoctorAliasRow, unknown>[]>(
    () => [
      {
        accessorKey: 'doctor_name',
        header: 'Doctor',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.doctor_name}</span>,
      },
      {
        accessorKey: 'alias',
        header: 'Alias',
        cell: ({ row }) => <span className="text-foreground">{row.original.alias}</span>,
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
    <CommonTable<DoctorAliasRow>
      columns={columns}
      data={aliases}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={10}
      getRowId={(row) => String(row.id)}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No aliases yet. Click “Add alias” to create the first one.
        </div>
      }
    />
  );
}
