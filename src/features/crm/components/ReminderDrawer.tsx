import { useEffect } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFDatePicker, RHFTextarea } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminCreateLeadReminder, useAdminUpdateReminder } from '../../../sdk/crm';
import type { ReminderOut } from '../api/crm';
import { useReminderForm, emptyReminder, type ReminderFormValues } from '../hooks/useReminderForm';

interface ReminderDrawerProps {
  leadUuid: string;
  /** When set, the drawer reschedules this follow-up; otherwise it creates a new one. */
  reminder: ReminderOut | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function ReminderDrawer({ leadUuid, reminder, open, onClose, onSaved }: ReminderDrawerProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset } = useReminderForm();
  const isEdit = reminder !== null;

  useEffect(() => {
    if (!open) return;
    reset(
      reminder
        ? { due_date: reminder.due_date, due_time: reminder.due_time ?? '', note: reminder.note ?? '' }
        : emptyReminder,
    );
  }, [open, reminder, reset]);

  const onFail = (e: unknown) => toast({ severity: 'error', message: errorMessage(e) });
  const onDone = (msg: string) => {
    toast({ severity: 'success', message: msg });
    onSaved();
    onClose();
  };

  const createMutation = useAdminCreateLeadReminder({ mutation: { onSuccess: () => onDone('Reminder scheduled.'), onError: onFail } });
  const updateMutation = useAdminUpdateReminder({ mutation: { onSuccess: () => onDone('Reminder rescheduled.'), onError: onFail } });

  const onSubmit = (v: ReminderFormValues) => {
    const due_date = v.due_date.slice(0, 10); // ISO → YYYY-MM-DD
    const data = { due_date, note: v.note || null };
    if (reminder) updateMutation.mutate({ reminderUuid: reminder.uuid, data });
    else createMutation.mutate({ leadUuid, data });
  };

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? 'Reschedule follow-up' : 'Add follow-up'}
      open={open}
      onClose={onClose}
      drawerWidth="40rem"
      drawerPadding="0px"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <RHFDatePicker<ReminderFormValues> name="due_date" control={control} label="Follow-up date" />
          <RHFTextarea<ReminderFormValues>
            name="note"
            control={control}
            label="Note"
            placeholder="e.g. follow up about order"
            minRow={4}
          />
        </div>
        <div className="shrink-0 flex justify-end gap-3 border-t border-border bg-background px-6 py-4">
          <CustomButton type="button" variant="outline" onClick={onClose} size="md">
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending || updateMutation.isPending} size="md">
            {isEdit ? 'Reschedule' : 'Schedule reminder'}
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
