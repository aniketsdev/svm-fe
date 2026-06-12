import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { CustomButton } from '../../../common/custom-buttons';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCompleteReminder, useAdminCancelReminder } from '../../../sdk/crm';
import type { ReminderWithLead } from '../../../sdk/schemas';
import { useMyReminders } from '../hooks/useMyReminders';
import { useCrmPermissions } from '../hooks/usePermissions';
import { CrmGuard } from '../components/CrmGuard';

export function MyFollowupsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canUpdate } = useCrmPermissions();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { reminders, total, isLoading, refetch } = useMyReminders({ page, pageSize, due: true, owner: 'me' });

  const onFail = (e: unknown) => toast({ severity: 'error', message: errorMessage(e) });
  const completeMutation = useAdminCompleteReminder({ mutation: { onSuccess: (res) => { toast({ severity: 'success', message: successMessage(res, 'Marked done.') }); refetch(); }, onError: onFail } });
  const cancelMutation = useAdminCancelReminder({ mutation: { onSuccess: (res) => { toast({ severity: 'success', message: successMessage(res, 'Cancelled.') }); refetch(); }, onError: onFail } });

  const columns = useMemo<ColumnDef<ReminderWithLead, unknown>[]>(
    () => [
      {
        id: 'due',
        header: 'Due',
        meta: { align: 'center' },
        cell: ({ row }) => (
          <span className={`whitespace-nowrap text-sm ${row.original.is_overdue ? 'font-semibold text-warning' : 'text-foreground'}`}>
            {row.original.due_date}
            {row.original.is_overdue ? ' · Overdue' : ''}
          </span>
        ),
      },
      {
        id: 'lead',
        header: 'Lead',
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-foreground">
            {row.original.lead.contact_name} · {row.original.lead.clinic_name}
          </span>
        ),
      },
      {
        id: 'note',
        header: 'Note',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.note ?? '—'}</span>,
      },
      {
        id: 'actions',
        header: 'Action',
        meta: { align: 'center' },
        cell: ({ row }) =>
          canUpdate ? (
            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
              <CustomButton type="button" variant="ghost" size="sm" onClick={() => completeMutation.mutate({ reminderUuid: row.original.uuid })}>
                Done
              </CustomButton>
              <CustomButton type="button" variant="ghost" size="sm" onClick={() => cancelMutation.mutate({ reminderUuid: row.original.uuid })}>
                Cancel
              </CustomButton>
            </div>
          ) : null,
      },
    ],
    [canUpdate, completeMutation, cancelMutation],
  );

  return (
    <CrmGuard>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-semibold text-foreground">My follow-ups</h1>
        <p className="mt-1 text-sm text-muted-foreground">Reminders due now or overdue, assigned to you.</p>

        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <CommonTable<ReminderWithLead>
            columns={columns}
            data={reminders}
            loading={isLoading}
            enablePagination
            manualPagination
            pageIndex={page}
            pageSize={pageSize}
            rowCount={total}
            onPaginationChange={({ pageIndex, pageSize: nextSize }) => {
              setPage(pageIndex);
              setPageSize(nextSize);
            }}
            stickyHeader
            getRowId={(row) => row.uuid}
            onRowClick={(r) => navigate(`/crm/${r.lead.uuid}`)}
            emptyState={
              <div className="py-12 text-center text-sm text-muted-foreground">No follow-ups due. 🎉</div>
            }
          />
        </div>
      </div>
    </CrmGuard>
  );
}

export default MyFollowupsPage;
