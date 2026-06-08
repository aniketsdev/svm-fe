import { CustomDialog } from '../../../common/custom-dialog';
import { formatDateTime, prettyJson } from '../../../utils/format';
import { useAdminGetActivityLogEntry } from '../../../sdk/activity-log';
import type { ActivityLogDetail } from '../../../sdk/schemas';
import type { AuditRow } from '../api/activity-log';

interface AuditDetailDialogProps {
  entry: AuditRow | null;
  onClose: () => void;
}

/** Row-click detail: actor/action metadata + the before/after JSON snapshots.
 *  before/after live on the detail endpoint, so fetch the full entry on open. */
export function AuditDetailDialog({ entry, onClose }: AuditDetailDialogProps) {
  const query = useAdminGetActivityLogEntry(entry?.id ?? 0, {
    query: { enabled: entry !== null },
  });
  const detail = (query.data as { data?: ActivityLogDetail } | undefined)?.data;
  // The detail carries every field the list row has, plus before/after state.
  const row = detail ?? entry;
  const before = prettyJson(detail?.before_state);
  const after = prettyJson(detail?.after_state);

  return (
    <CustomDialog title="Activity detail" open={entry !== null} onClose={onClose} width="42rem">
      {entry && (
        <div className="flex flex-col gap-4 text-sm">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-xs text-muted-foreground">When</dt>
              <dd className="text-foreground">
                {formatDateTime(row?.created_at ?? "")}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Who</dt>
              <dd className="text-foreground">
                {row?.actor?.email ?? 'System'}
                {row?.actor?.role ? ` (${row?.actor?.role})` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Action</dt>
              <dd className="text-foreground">{row?.action}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Entity</dt>
              <dd className="text-foreground">
                {row?.entity_type ?? '—'}
                {row?.record_id ? ` #${row?.record_id}` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">IP</dt>
              <dd className="text-foreground">{row?.ip ?? '—'}</dd>
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
