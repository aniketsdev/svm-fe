import { personLabel, type ReminderOut } from '../api/crm';

interface LeadRemindersPanelProps {
  reminders: ReminderOut[];
}

function isOverdue(r: ReminderOut): boolean {
  if (r.status !== 'PENDING') return false;
  const today = new Date().toISOString().slice(0, 10);
  return r.due_date < today;
}

const STATUS_TONE: Record<string, string> = {
  PENDING: 'bg-info/10 text-info',
  DONE: 'bg-positive/10 text-positive',
  CANCELLED: 'bg-muted text-muted-foreground',
};

/**
 * Read-only follow-up reminders list with due/overdue treatment. Schedule/
 * complete/cancel/reschedule actions are layered on in User Story 6.
 */
export function LeadRemindersPanel({ reminders }: LeadRemindersPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Follow-up reminders</h2>
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
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_TONE[r.status] ?? 'bg-muted text-muted-foreground'
                  }`}
                >
                  {r.status}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
