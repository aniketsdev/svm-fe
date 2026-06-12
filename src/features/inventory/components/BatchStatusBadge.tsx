import { cn } from '../../../lib/cn';

const STATUS_CLS: Record<string, string> = {
  available: 'bg-positive/10 text-positive-70',
  reserved: 'bg-info/10 text-info-60',
  blocked: 'bg-warning/10 text-warning-60',
  expired: 'bg-destructive/10 text-destructive',
  scrapped: 'bg-secondary text-secondary-foreground',
};

export function BatchStatusBadge({ status }: { status: string }) {
  const cls = STATUS_CLS[status.toLowerCase()] ?? 'bg-secondary text-secondary-foreground';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        cls,
      )}
    >
      {status}
    </span>
  );
}
