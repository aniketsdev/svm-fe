import { useState } from 'react';
import { CustomButton } from '../../../common/custom-buttons';
import { CommonTable, type ColumnDef } from '../../../common/common-table';
import { RHFDatePicker, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import {
  useAdminCreateLeadReminder,
  useAdminUpdateReminder,
  useAdminCompleteReminder,
  useAdminCancelReminder,
} from '../../../sdk/crm';
import { LEAD_ACTIVITY_PAGE_SIZE, personLabel, type ReminderOut } from '../api/crm';
import { useReminderForm, emptyReminder, type ReminderFormValues } from '../hooks/useReminderForm';

interface LeadRemindersPanelProps {
  leadUuid: string;
  reminders: ReminderOut[];
  onChanged: () => void;
  canCreate: boolean;
  canUpdate: boolean;
}

function isOverdue(r: ReminderOut): boolean {
  if (r.status !== 'PENDING') return false;
  return r.due_date < new Date().toISOString().slice(0, 10);
}

const STATUS_TONE: Record<string, string> = {
  PENDING: 'bg-info/10 text-info',
  DONE: 'bg-positive/10 text-positive',
  CANCELLED: 'bg-muted text-muted-foreground',
};

export function LeadRemindersPanel({
  leadUuid,
  reminders,
  onChanged,
  canCreate,
  canUpdate,
}: LeadRemindersPanelProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset } = useReminderForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  const onDone = (msg: string) => {
    toast({ severity: 'success', message: msg });
    reset(emptyReminder);
    setEditingId(null);
    onChanged();
  };
  const onFail = (e: unknown) => toast({ severity: 'error', message: errorMessage(e) });

  const createMutation = useAdminCreateLeadReminder({ mutation: { onSuccess: () => onDone('Reminder scheduled.'), onError: onFail } });
  const updateMutation = useAdminUpdateReminder({ mutation: { onSuccess: () => onDone('Reminder rescheduled.'), onError: onFail } });
  const completeMutation = useAdminCompleteReminder({ mutation: { onSuccess: () => { toast({ severity: 'success', message: 'Marked done.' }); onChanged(); }, onError: onFail } });
  const cancelMutation = useAdminCancelReminder({ mutation: { onSuccess: () => { toast({ severity: 'success', message: 'Reminder cancelled.' }); onChanged(); }, onError: onFail } });

  const onSubmit = (v: ReminderFormValues) => {
    const due_date = v.due_date.slice(0, 10); // ISO → YYYY-MM-DD
    const data = { due_date, note: v.note || null };
    if (editingId) updateMutation.mutate({ reminderUuid: editingId, data });
    else createMutation.mutate({ leadUuid, data });
  };

  const startEdit = (r: ReminderOut) => {
    setEditingId(r.uuid);
    reset({ due_date: r.due_date, due_time: r.due_time ?? '', note: r.note ?? '' });
  };

  const columns: ColumnDef<ReminderOut, unknown>[] = [
    {
      id: 'due',
      header: 'Due',
      cell: ({ row }) => {
        const r = row.original;
        const overdue = isOverdue(r);
        return (
          <span className={`whitespace-nowrap font-medium ${overdue ? 'text-warning' : 'text-foreground'}`}>
            {r.due_date}
            {r.due_time ? ` ${r.due_time.slice(0, 5)}` : ''}
            {overdue ? ' · Overdue' : ''}
          </span>
        );
      },
    },
    {
      id: 'note',
      header: 'Note',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.note ?? '—'}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_TONE[row.original.status] ?? 'bg-muted text-muted-foreground'}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      id: 'owner',
      header: 'Owner',
      cell: ({ row }) => <span className="whitespace-nowrap text-foreground">{personLabel(row.original.owner)}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const r = row.original;
        if (!(canUpdate && r.status === 'PENDING')) return null;
        return (
          <div className="flex items-center justify-end gap-2">
            <CustomButton type="button" variant="ghost" size="sm" onClick={() => completeMutation.mutate({ reminderUuid: r.uuid })}>
              Done
            </CustomButton>
            <CustomButton type="button" variant="ghost" size="sm" onClick={() => startEdit(r)}>
              Reschedule
            </CustomButton>
            <CustomButton type="button" variant="ghost" size="sm" onClick={() => cancelMutation.mutate({ reminderUuid: r.uuid })}>
              Cancel
            </CustomButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {canCreate ? (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <RHFDatePicker<ReminderFormValues> name="due_date" control={control} label="Follow-up date" />
            <RHFTextarea<ReminderFormValues> name="note" control={control} label="Note" placeholder="e.g. follow up about order" minRow={2} />
          </div>
          <div className="flex items-center gap-2">
            <CustomButton type="submit" variant="primary" size="sm" loading={createMutation.isPending || updateMutation.isPending}>
              {editingId ? 'Reschedule' : 'Schedule reminder'}
            </CustomButton>
            {editingId ? (
              <CustomButton type="button" variant="outline" size="sm" onClick={() => { reset(emptyReminder); setEditingId(null); }}>
                Cancel edit
              </CustomButton>
            ) : null}
          </div>
        </form>
      ) : null}

      <CommonTable<ReminderOut>
        columns={columns}
        data={reminders}
        getRowId={(r) => r.uuid}
        enablePagination
        pageSize={LEAD_ACTIVITY_PAGE_SIZE}
        density="compact"
        emptyState="No follow-ups yet."
      />
    </div>
  );
}
