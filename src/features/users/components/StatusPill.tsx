import { cn } from '../../../lib/cn';

interface StatusPillProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

/** Small on/off pill — reused for the Active and 2FA columns. */
export function StatusPill({
  active,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
}: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        active ? 'bg-positive/10 text-positive' : 'bg-muted text-muted-foreground',
      )}
    >
      <span
        className={cn('size-1.5 rounded-full', active ? 'bg-positive' : 'bg-muted-foreground/50')}
      />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
