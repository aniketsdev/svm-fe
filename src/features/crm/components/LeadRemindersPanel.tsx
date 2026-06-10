import { useState } from 'react';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFDatePicker, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import {
  useAdminCreateLeadReminder,
  useAdminUpdateReminder,
  useAdminCompleteReminder,
  useAdminCancelReminder,
} from '../../../sdk/crm';
import { personLabel, type ReminderOut } from '../api/crm';
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

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Follow-up reminders</h2>

      {canCreate ? (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-3 flex flex-col gap-2">
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

      {reminders.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No reminders scheduled.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {reminders.map((r) => {
            const overdue = isOverdue(r);
            return (
              <li
                key={r.uuid}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 ${
                  overdue ? 'border-warning/40 bg-warning/5' : 'border-border bg-background'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {r.due_date}
                    {r.due_time ? ` ${r.due_time.slice(0, 5)}` : ''}
                    {overdue ? ' · Overdue' : ''}
                  </span>
                  {r.note ? <span className="text-xs text-muted-foreground">{r.note}</span> : null}
                  <span className="text-xs text-muted-foreground">Owner: {personLabel(r.owner)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_TONE[r.status] ?? 'bg-muted text-muted-foreground'}`}>
                    {r.status}
                  </span>
                  {canUpdate && r.status === 'PENDING' ? (
                    <>
                      <CustomButton type="button" variant="ghost" size="sm" onClick={() => completeMutation.mutate({ reminderUuid: r.uuid })}>
                        Done
                      </CustomButton>
                      <CustomButton type="button" variant="ghost" size="sm" onClick={() => startEdit(r)}>
                        Reschedule
                      </CustomButton>
                      <CustomButton type="button" variant="ghost" size="sm" onClick={() => cancelMutation.mutate({ reminderUuid: r.uuid })}>
                        Cancel
                      </CustomButton>
                    </>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
