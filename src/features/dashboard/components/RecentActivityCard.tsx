import { cn } from '../../../lib/cn';
import { formatRelativeTime } from '../../../utils/format';
import { activityToneClass, describeActivity } from '../../../utils/activity';
import type { ActivityLogListItem } from '../../../sdk/schemas';

export function RecentActivityCard({ items }: { items: ActivityLogListItem[] }) {
  if (!items.length) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No recent activity.</p>;
  }
  return (
    <ul className="flex flex-col gap-3">
      {items.map((a) => {
        const { label, Icon, tone } = describeActivity(a.action, a.entity_type);
        return (
          <li key={a.id} className="flex items-center gap-3">
            <span
              className={cn(
                'inline-flex size-7 shrink-0 items-center justify-center rounded-full',
                activityToneClass(tone),
              )}
            >
              <Icon className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">
                {label}
                {a.record_name && <span className="text-muted-foreground"> — {a.record_name}</span>}
              </p>
              <p className="text-xs text-muted-foreground">
                {a.actor?.email ?? 'System'} · {formatRelativeTime(a.created_at)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
