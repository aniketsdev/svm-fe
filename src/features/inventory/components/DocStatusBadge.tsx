import { cn } from '../../../lib/cn';

// Covers every inventory-document status (GRN / Transfer / Adjustment).
const STATUS_CLS: Record<string, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  requested: 'bg-secondary text-secondary-foreground',
  pending: 'bg-secondary text-secondary-foreground',
  approved: 'bg-info/10 text-info-60',
  dispatched: 'bg-warning/10 text-warning-60',
  in_transit: 'bg-warning/10 text-warning-60',
  received: 'bg-positive/10 text-positive-70',
  posted: 'bg-positive/10 text-positive-70',
  completed: 'bg-positive/10 text-positive-70',
  cancelled: 'bg-destructive/10 text-destructive',
  rejected: 'bg-destructive/10 text-destructive',
};

export function DocStatusBadge({ status }: { status: string }) {
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
