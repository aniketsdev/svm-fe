import dayjs from 'dayjs';
import { CustomDialog } from '../../../common/custom-dialog';
import type { AuditRow } from '../api/activity-log';

function pretty(value: unknown): string | null {
  if (value == null) return null;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

interface AuditDetailDialogProps {
  entry: AuditRow | null;
  onClose: () => void;
}

/** Row-click detail: actor/action metadata + the before/after JSON snapshots. */
export function AuditDetailDialog({ entry, onClose }: AuditDetailDialogProps) {
  const before = pretty(entry?.before_state);
  const after = pretty(entry?.after_state);

  return (
    <CustomDialog title="Activity detail" open={entry !== null} onClose={onClose} width="42rem">
      {entry && (
        <div className="flex flex-col gap-4 text-sm">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-xs text-muted-foreground">When</dt>
              <dd className="text-foreground">
                {dayjs(entry.created_at).format('DD MMM YYYY, h:mm A')}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Who</dt>
              <dd className="text-foreground">
                {entry.actor_email ?? 'System'}
                {entry.actor_role ? ` (${entry.actor_role})` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Action</dt>
              <dd className="text-foreground">{entry.action}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Entity</dt>
              <dd className="text-foreground">
                {entry.target_entity_type ?? '—'}
                {entry.target_entity_id ? ` #${entry.target_entity_id}` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">IP</dt>
              <dd className="text-foreground">{entry.ip ?? '—'}</dd>
            </div>
          </dl>

          {before || after ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Before</p>
                <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-muted/40 p-3 text-xs text-foreground">
                  {before ?? '—'}
                </pre>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">After</p>
                <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-muted/40 p-3 text-xs text-foreground">
                  {after ?? '—'}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No before/after payload recorded for this event.
            </p>
          )}
        </div>
      )}
    </CustomDialog>
  );
}
