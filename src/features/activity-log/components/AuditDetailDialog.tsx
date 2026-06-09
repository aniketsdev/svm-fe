import type { ReactNode } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { cn } from '../../../lib/cn';
import { formatDateTime, formatRelativeTime, prettyJson } from '../../../utils/format';
import { describeActivity, activityToneClass } from '../../../utils/activity';
import { useAdminGetActivityLogEntry } from '../../../sdk/activity-log';
import type { ActivityLogDetail } from '../../../sdk/schemas';
import type { AuditRow } from '../api/activity-log';
import { ActivityAction } from './ActivityAction';

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
  const row = detail ?? entry;
  const before = prettyJson(detail?.before_state);
  const after = prettyJson(detail?.after_state);
  const desc = row ? describeActivity(row.action, row.entity_type) : null;

  const recordValue = row?.record_name
    ? row.record_name
    : row?.entity_type
      ? `${row.entity_type.replace(/_/g, ' ')}${row.record_id != null ? ` #${row.record_id}` : ''}`
      : '—';

  return (
    <CustomDrawer
      anchor="right"
      title="Activity detail"
      open={entry !== null}
      onClose={onClose}
      drawerWidth="38rem"
    >
      {entry && row && (
        <div className="flex flex-col gap-5 text-sm">
          {desc && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <span
                className={cn(
                  'inline-flex size-10 shrink-0 items-center justify-center rounded-full',
                  activityToneClass(desc.tone),
                )}
              >
                <desc.Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-base font-semibold text-foreground">{desc.label}</p>
                <p className="text-xs text-muted-foreground">
                  {row.actor?.email ?? 'System'} · {formatRelativeTime(row.created_at)}
                </p>
              </div>
            </div>
          )}

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
                {row?.action ? <ActivityAction action={row.action} /> : '—'}
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
              No before/after snapshot recorded for this event.
            </p>
          )}
        </div>
      )}
    </CustomDrawer>
  );
}
