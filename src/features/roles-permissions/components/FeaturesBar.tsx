import { cn } from '../../../lib/cn';

/** "X / Y" permission ratio with a small progress bar. */
export function FeaturesBar({ enabled, total }: { enabled: number; total: number }) {
  const pct = total > 0 ? Math.round((enabled / total) * 100) : 0;
  const full = total > 0 && enabled >= total;

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full', full ? 'bg-positive' : 'bg-primary')}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-xs text-muted-foreground">
        {enabled} / {total}
      </span>
    </div>
  );
}
