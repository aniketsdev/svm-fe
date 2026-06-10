import { formatDateTime } from '../../../utils/format';
import { personLabel, type NoteOut } from '../api/crm';

interface LeadNotesPanelProps {
  notes: NoteOut[];
}

/**
 * Read-only interaction timeline (newest first). Add/edit/delete affordances are
 * layered on in User Story 5.
 */
export function LeadNotesPanel({ notes }: LeadNotesPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Notes</h2>
      {notes.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No notes yet.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {notes.map((n) => (
            <li key={n.uuid} className="rounded-lg border border-border bg-background p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {personLabel(n.author)}
                  {n.interaction_type ? ` · ${n.interaction_type}` : ''}
                </span>
                <span className="text-xs text-muted-foreground">{formatDateTime(n.created_at)}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{n.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
