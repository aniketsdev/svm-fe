import { useState } from 'react';
import { cn } from '../../../lib/cn';
import type { NoteOut, ReminderOut } from '../api/crm';
import { LeadNotesPanel } from './LeadNotesPanel';
import { LeadRemindersPanel } from './LeadRemindersPanel';

type ActivityTab = 'notes' | 'followups';

interface LeadActivityTabsProps {
  leadUuid: string;
  notes: NoteOut[];
  reminders: ReminderOut[];
  onChanged: () => void;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const TABS: { key: ActivityTab; label: string }[] = [
  { key: 'notes', label: 'Notes' },
  { key: 'followups', label: 'Follow-ups' },
];

/**
 * Activity region of the lead detail page: a two-tab control switching between
 * the Notes and Follow-ups panels (each a paginated table). Mirrors the
 * underline-tab pattern used by the inventory page.
 */
export function LeadActivityTabs({
  leadUuid,
  notes,
  reminders,
  onChanged,
  canCreate,
  canUpdate,
  canDelete,
}: LeadActivityTabsProps) {
  const [tab, setTab] = useState<ActivityTab>('notes');

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="-mx-4 -mt-4 mb-4 border-b border-border px-2">
        <nav className="flex flex-wrap gap-1" role="tablist" aria-label="Lead activity">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={cn(
                  'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      {tab === 'notes' ? (
        <LeadNotesPanel
          leadUuid={leadUuid}
          notes={notes}
          onChanged={onChanged}
          canCreate={canCreate}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      ) : (
        <LeadRemindersPanel
          leadUuid={leadUuid}
          reminders={reminders}
          onChanged={onChanged}
          canCreate={canCreate}
          canUpdate={canUpdate}
        />
      )}
    </section>
  );
}
