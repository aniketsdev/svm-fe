import { cn } from '../../../lib/cn';

const STATUS: Record<string, { label: string; cls: string }> = {
  draft: { label: 'Draft', cls: 'bg-secondary text-secondary-foreground' },
  posted: { label: 'Posted', cls: 'bg-positive/10 text-positive-70' },
  cancelled: { label: 'Cancelled', cls: 'bg-destructive/10 text-destructive' },
};

export function GrnStatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, cls: 'bg-secondary text-secondary-foreground' };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        s.cls,
      )}
    >
      {s.label}
    </span>
  );
}
