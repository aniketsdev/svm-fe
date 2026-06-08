import { useMemo } from 'react';
import { formatDateTime } from '../../../utils/format';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import type { AuditRow } from '../api/activity-log';
import { ActionBadge } from './ActionBadge';

interface ActivityLogTableProps {
  entries: AuditRow[];
  loading: boolean;
  onRowClick: (entry: AuditRow) => void;
}

export function ActivityLogTable({ entries, loading, onRowClick }: ActivityLogTableProps) {
  const columns = useMemo<ColumnDef<AuditRow, unknown>[]>(
    () => [
      {
        id: 'when',
        header: 'When',
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatDateTime(row.original.created_at)}
          </span>
        ),
      },
      {
        id: 'who',
        header: 'Who',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-foreground">{row.original.actor?.email ?? 'System'}</span>
            {row.original.actor?.role && (
              <span className="text-xs capitalize text-muted-foreground">
                {row.original.actor?.role}
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => <ActionBadge action={row.original.action} />,
      },
      {
        id: 'entity',
        header: 'Entity',
        cell: ({ row }) => (
          <span className="text-foreground">{row.original.entity_type ?? '—'}</span>
        ),
      },
      {
        id: 'record',
        header: 'Record',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.record_id ?? '—'}</span>
        ),
      },
      {
        id: 'ip',
        header: 'IP',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.ip ?? '—'}</span>,
      },
    ],
    [],
  );

  return (
    <CommonTable<AuditRow>
      columns={columns}
      data={entries}
      loading={loading}
      enableSorting
      enablePagination
      pageSize={15}
      getRowId={(row) => String(row.id)}
      onRowClick={onRowClick}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No activity recorded yet.
        </div>
      }
    />
  );
}
