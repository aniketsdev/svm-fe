import { cn } from '../../../lib/cn';

interface RoleStatusBadgeProps {
  /** Role status string from the API ('active' | 'inactive'). */
  status: string;
}

/** Small active/inactive pill for a role (mirrors users/StatusPill). */
export function RoleStatusBadge({ status }: RoleStatusBadgeProps) {
  const active = status === 'active';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        active ? 'bg-positive/10 text-positive' : 'bg-muted text-muted-foreground',
      )}
    >
      <span
        className={cn('size-1.5 rounded-full', active ? 'bg-positive' : 'bg-muted-foreground/50')}
      />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}
