import { CustomDrawer } from '../../../common/custom-drawer';
import { formatDateTime, prettyJson } from '../../../utils/format';
import { useAdminGetActivityLogEntry } from '../../../sdk/activity-log';
import type { ActivityLogDetail } from '../../../sdk/schemas';
import type { AuditRow } from '../api/activity-log';
import { ActionBadge } from './ActionBadge';

interface AuditDetailDialogProps {
  entry: AuditRow | null;
  onClose: () => void;
}

/** Render the entity as a friendly label, matching the list's "Record" column:
 *  prefer the API-resolved name, else a prettified entity type with `#id`. */
function renderEntity(row?: { entity_type?: string | null; record_id?: number | string | null; record_name?: string | null } | null) {
  if (!row) return '—';
  const { entity_type, record_id, record_name } = row;
  if (record_name) return record_name;
  if (!entity_type && record_id == null) return '—';
  const name = entity_type
    ? entity_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Record';
  return (
    <>
      {name}
      {record_id != null && <span className="text-muted-foreground"> #{record_id}</span>}
    </>
  );
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
    <CustomDrawer
      anchor="right"
      title="Activity Log Details"
      open={entry !== null}
      onClose={onClose}
      drawerWidth="38rem"
    >
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
              <dd className="text-foreground">
                {row?.action ? <ActionBadge action={row.action} /> : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Entity</dt>
              <dd className="text-foreground">{renderEntity(row)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">IP</dt>
              <dd className="text-foreground">{row?.ip ?? '—'}</dd>
            </div>
          </dl>

          {before || after ? (
            <div className="grid grid-cols-1 gap-4">
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
    </CustomDrawer>
  );
}
