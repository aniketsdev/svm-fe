import { CustomDrawer } from '../../../common/custom-drawer';
import { personLabel, type ReminderOut } from '../api/crm';

interface ReminderPreviewDrawerProps {
  reminder: ReminderOut | null;
  onClose: () => void;
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value || '—'}</dd>
    </div>
  );
}

/** Read-only view of a single follow-up's full details. */
export function ReminderPreviewDrawer({ reminder, onClose }: ReminderPreviewDrawerProps) {
  const due = reminder
    ? `${reminder.due_date}${reminder.due_time ? ` ${reminder.due_time.slice(0, 5)}` : ''}`
    : '';
  return (
    <CustomDrawer anchor="right" title="Follow-up details" open={reminder !== null} onClose={onClose} drawerWidth="32rem">
      {reminder ? (
        <dl className="flex flex-col gap-4">
          <PreviewField label="Due" value={due} />
          <PreviewField label="Status" value={reminder.status} />
          <PreviewField label="Owner" value={personLabel(reminder.owner)} />
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Note</dt>
            <dd className="mt-0.5 whitespace-pre-wrap break-words text-sm text-foreground">{reminder.note ?? '—'}</dd>
          </div>
        </dl>
      ) : null}
    </CustomDrawer>
  );
}
