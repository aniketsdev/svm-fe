import { cn } from '../../../lib/cn';
import { formatDate } from '../../../utils/format';
import type { StockListItem } from '../../../sdk/schemas';

export function ExpiringWatchlist({ batches }: { batches: StockListItem[] }) {
  if (!batches.length) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Nothing expiring soon.</p>;
  }
  return (
    <ul className="divide-y divide-border/60">
      {batches.map((b) => {
        const d = b.days_remaining ?? 0;
        const tone = d <= 7 ? 'text-destructive' : d <= 30 ? 'text-warning-60' : 'text-muted-foreground';
        return (
          <li key={b.batch_uuid} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{b.material_name}</p>
              <p className="text-xs text-muted-foreground">
                {b.batch_no} · {b.store_code}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className={cn('text-sm font-semibold tabular-nums', tone)}>{d}d left</p>
              <p className="text-xs text-muted-foreground">
                {b.expiry_date ? formatDate(b.expiry_date) : '—'}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
