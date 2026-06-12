import { cn } from '../../../lib/cn';

const CLS: Record<string, string> = {
  unpaid: 'bg-destructive/10 text-destructive',
  partial: 'bg-warning/10 text-warning-60',
  paid: 'bg-positive/10 text-positive-70',
};

export function PaymentStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const cls = CLS[status.toLowerCase()] ?? 'bg-secondary text-secondary-foreground';
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
