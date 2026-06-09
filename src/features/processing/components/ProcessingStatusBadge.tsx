import { cn } from '../../../lib/cn';

const STATUS_CLS: Record<string, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  pending: 'bg-secondary text-secondary-foreground',
  in_progress: 'bg-info/10 text-info-60',
  completed: 'bg-positive/10 text-positive-70',
  cancelled: 'bg-destructive/10 text-destructive',
};

export function ProcessingStatusBadge({ status }: { status: string }) {
  const cls = STATUS_CLS[status.toLowerCase()] ?? 'bg-secondary text-secondary-foreground';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        cls,
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
